<?php

namespace Growfund\Gateways\Stripe;

use Growfund\Payments\Constants\PaymentEventStatus;
use Growfund\Payments\Constants\WebhookType;
use Growfund\Payments\Contracts\FuturePaymentContract;
use Growfund\Payments\Contracts\PaymentGatewayContract;
use Stripe\StripeClient;
use Stripe\Webhook;
use Growfund\Payments\DTO\{
    CustomerDTO,
    PaymentPayloadDTO,
    PaymentResponseDTO,
    WebhookResponseDTO,
    RefundResponseDTO,
    PaymentStatusDTO,
    SavePaymentMethodPayloadDTO
};
use Exception;
use InvalidArgumentException;
use Stripe\Exception\CardException;

/**
 * Stripe Payment Gateway Integration
 */
class Stripe implements PaymentGatewayContract, FuturePaymentContract
{
    /** @var StripeClient */
    protected $client;

    /** @var string */
    protected $webhook_secret;

    /**
     * Constructor
     *
     * @param array $config
     */
    public function __construct(array $config)
    {
        $this->set_config($config);
    }

    public function get_client()
    {
        return $this->client;
    }

    /**
     * Set gateway configuration
     *
     * @param array $config
     * @return void
     */
    public function set_config(array $config)
    {
        if (empty($config['secret_key'])) {
            throw new InvalidArgumentException('Stripe secret_key is required in config.');
        }

        if (empty($config['webhook_secret'])) {
            throw new InvalidArgumentException('Stripe webhook_secret is required in config.');
        }

        $this->client = new StripeClient($config['secret_key']);
        $this->webhook_secret = $config['webhook_secret'];
    }

    /**
     * Create a Checkout session for one-time payment
     *
     * @param PaymentPayloadDTO $payload
     * @return PaymentResponseDTO
     */
    public function charge(PaymentPayloadDTO $payload)
    {
        $params = array_filter([
            'mode' => 'payment',
            'success_url' => $payload->success_url,
            'cancel_url' => $payload->cancel_url,
            'payment_intent_data' => [
                'metadata' => array_merge($payload->metadata ?? [], [
                    'order_id' => $payload->order_id
                ]),
            ],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => strtolower($payload->currency),
                        'unit_amount' => $this->format_amount($payload->amount),
                        'product_data' => [
                            'name' => $payload->description,
                        ]
                    ],
                    'quantity' => 1,
                ]
            ]
        ]);


        $session = $this->client->checkout->sessions->create($params);

        return PaymentResponseDTO::from_array([
            'is_redirect' => true,
            'redirect_url' => $session->url,
            'transaction_id' => $session->id,
            'payment_form' => null,
            'raw' => $session->toArray(),
        ]);
    }

    /**
     * Create a session to save payment method using setup mode
     *
     * @param SavePaymentMethodPayloadDTO $payload
     * @return PaymentResponseDTO
     */
    public function save_payment_method(SavePaymentMethodPayloadDTO $payload)
    {
        if (empty($payload->customer_id)) {
            throw new InvalidArgumentException('Stripe customer_id is required in config.');
        }

        $params = array_filter([
            'mode' => 'setup',
            'success_url' => $payload->success_url,
            'cancel_url' => $payload->cancel_url,
            'setup_intent_data' => [
                'metadata' => array_merge($payload->metadata ?? [], [
                    'order_id' => $payload->order_id
                ]),
            ],
            'customer' => $payload->customer_id,
            'currency' => strtolower($payload->currency),
        ]);


        $session = $this->client->checkout->sessions->create($params);

        return PaymentResponseDTO::from_array(array(
            'is_redirect' => true,
            'redirect_url' => $session->url,
            'transaction_id' => $session->setup_intent,
            'payment_form' => null,
            'raw' => $session->toArray(),
        ));
    }

    /**
     * Issue a refund
     *
     * @param string $transaction_id
     * @param float|null $amount
     * @return RefundResponseDTO
     */
    public function refund($transaction_id, $amount = null, $currency = null)
    {
        $params = ['payment_intent' => $transaction_id];

        if ($amount !== null) {
            $params['amount'] = $this->format_amount($amount);
        }

        $refund = $this->client->refunds->create($params);

        return RefundResponseDTO::from_array([
            'success' => $refund->status === 'succeeded',
            'refund_id' => $refund->id,
            'transaction_id' => $transaction_id,
            'amount' => $this->parse_amount($refund->amount),
            'raw' => $refund->toArray(),
        ]);
    }

    /**
     * Verify the transaction
     *
     * @param string $transaction_id
     * @return PaymentStatusDTO
     */
    public function verify($transaction_id)
    {
        $intent = $this->client->paymentIntents->retrieve($transaction_id);

        return PaymentStatusDTO::from_array([
            'status' => $intent->status,
            'transaction_id' => $intent->id,
            'amount' => $this->parse_amount((isset($intent->amount_received) ? $intent->amount_received : $intent->amount)),
            'currency' => strtolower($intent->currency),
            'raw' => $intent->toArray(),
        ]);
    }

    /**
     * Confirm the completion of a transaction.
     *
     * @param mixed $data Data required for confirming the transaction.
     * @return bool Returns true if the transaction is successfully confirmed.
     */
    public function confirm($data)
    {
        return true;
    }

    /**
     * Handle webhook events
     *
     * @param string $body
     * @param array $headers
     * @return WebhookResponseDTO
     * @throws Exception
     */
    public function handle_webhook($body, $headers)
    {
        $sig_header = isset($headers['Stripe-Signature']) ? $headers['Stripe-Signature'] : '';

        try {
            $event = Webhook::constructEvent($body, $sig_header, $this->webhook_secret);
        } catch (Exception $error) {
            throw new Exception('Invalid webhook signature: ' . $error->getMessage());
        }

        $object = $event->data->object;
        $type = null;
        $status = PaymentEventStatus::PENDING;
        $transaction_id = '';
        $amount = 0;
        $fee = 0;
        $currency = null;

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $type = WebhookType::PAYMENT;
                $status = PaymentEventStatus::SUCCESS;
                $transaction_id = $object->id;
                $amount = isset($object->amount_received) ? $object->amount_received : $object->amount;
                $currency = $object->currency;

                if (!empty($object->latest_charge)) {
                    $charge = $this->client->charges->retrieve($object->latest_charge);

                    if (!empty($charge->balance_transaction)) {
                        $balance_tx = $this->client->balanceTransactions->retrieve($charge->balance_transaction);
                        $fee = $balance_tx->fee;
                    }
                }
                break;

            case 'payment_intent.payment_failed':
                $type = WebhookType::PAYMENT;
                $status = PaymentEventStatus::FAILED;
                $transaction_id = $object->id;
                $amount = $object->amount;
                $currency = $object->currency;
                break;

            case 'payment_intent.canceled':
                $type = WebhookType::PAYMENT;
                $status = PaymentEventStatus::CANCELLED;
                $transaction_id = $object->id;
                $amount = $object->amount;
                $currency = $object->currency;
                break;

            case 'charge.refunded':
                $type = WebhookType::REFUND;
                $status = PaymentEventStatus::PENDING;

                if ($object->status === 'succeeded') {
                    $status = PaymentEventStatus::SUCCESS;
                } elseif ($object->status === 'failed') {
                    $status = PaymentEventStatus::FAILED;
                }

                $transaction_id = isset($object->payment_intent) ? $object->payment_intent : $object->id;
                $amount = $object->amount_refunded;
                $currency = $object->currency;
                break;

            case 'refund.updated':
                $type = WebhookType::REFUND;
                $status = PaymentEventStatus::PENDING;

                if ($object->status === 'succeeded') {
                    $status = PaymentEventStatus::SUCCESS;
                } elseif ($object->status === 'failed') {
                    $status = PaymentEventStatus::FAILED;
                }

                $transaction_id = isset($object->payment_intent) ? $object->payment_intent : ($object->charge ?? $object->id);
                $amount = $object->amount;
                $currency = $object->currency;
                break;


            case 'checkout.session.completed':
                if ($object->mode === 'setup') {
                    $type = WebhookType::SETUP;
                    $status = PaymentEventStatus::SUCCESS;
                    $transaction_id = $object->setup_intent;

                    $amount = 0;
                    $currency = null;
                } elseif ($object->mode === 'payment') {
                    $type = WebhookType::PAYMENT;
                    $status = PaymentEventStatus::SUCCESS;
                    $transaction_id = $object->payment_intent;

                    $payment_status_dto = $this->verify($transaction_id);
                    $amount = $payment_status_dto->amount;
                    $currency = $payment_status_dto->currency;
                }
                break;

            case 'checkout.session.async_payment_succeeded':
                $type = WebhookType::PAYMENT;
                $status = PaymentEventStatus::SUCCESS;
                $transaction_id = $object->payment_intent;
                $payment_status_dto = $this->verify($transaction_id);
                $amount = $payment_status_dto->amount;
                $currency = $payment_status_dto->currency;
                break;

            case 'checkout.session.async_payment_failed':
                $type = WebhookType::PAYMENT;
                $status = PaymentEventStatus::FAILED;
                $transaction_id = $object->payment_intent;
                break;

            case 'setup_intent.succeeded':
                $type = WebhookType::SETUP;
                $status = PaymentEventStatus::SUCCESS;
                $transaction_id = $object->id;
                break;
            case 'charge.succeeded':
                $type = WebhookType::PAYMENT;
                $status = PaymentEventStatus::SUCCESS;
                $transaction_id = $object->payment_intent ?? $object->id;
                $amount = $object->amount;
                $currency = $object->currency;

                if (!empty($object->balance_transaction)) {
                    $balance_tx = $this->client->balanceTransactions->retrieve($object->balance_transaction);
                    $fee = $balance_tx->fee;
                }
                break;


            default:
                $type = WebhookType::UNKNOWN;
                $status = PaymentEventStatus::PENDING;
                $transaction_id = isset($object->id) ? $object->id : '';
                break;
        }

        $intent = null;

        if ($type === WebhookType::SETUP) {
            $intent = $this->client->setupIntents->retrieve($transaction_id);
        } elseif ($type === WebhookType::PAYMENT || $type === WebhookType::REFUND) {
            $intent = $this->client->paymentIntents->retrieve($transaction_id);
        }

        $metadata = isset($intent->metadata) ? json_decode(json_encode($intent->metadata), true) : [];

        return WebhookResponseDTO::from_array([
            'type' => $type,
            'status' => $status,
            'order_id' => $metadata['order_id'] ?? null,
            'transaction_id' => $transaction_id,
            'metadata' => !empty($metadata) ? $metadata : [],
            'amount' => $this->parse_amount($amount),
            'fee' => $this->parse_amount($fee),
            'currency' => $currency ? strtolower($currency) : null,
            'payment_gateway' => 'growfund-gateway-stripe',
            'raw' => $event->toArray(),
        ]);
    }

    /**
     * Create a PaymentIntent for off-session (delayed) charge using a previously saved payment method.
     *
     * @param PaymentPayloadDTO $payload
     * @return PaymentResponseDTO
     * @throws Exception
     */
    public function charge_stored_payment_method(PaymentPayloadDTO $payload)
    {
        if (empty($payload->payment_token_id)) {
            throw new Exception("Setup Intent ID is missing.");
        }

        try {
            $setup_intent = $this->client->setupIntents->retrieve($payload->payment_token_id);
        } catch (Exception $error) {
            throw new Exception("Failed to retrieve Setup Intent: " . $error->getMessage());
        }

        if (empty($setup_intent->customer) || empty($setup_intent->payment_method)) {
            throw new Exception("Customer ID or Payment Method ID is missing.");
        }

        try {
            $params = array_filter([
                'amount' => $this->format_amount($payload->amount),
                'currency' => $payload->currency,
                'customer' => $setup_intent->customer,
                'payment_method' => $setup_intent->payment_method,
                'off_session' => true,
                'confirm' => true,
                'metadata' => array_merge($payload->metadata ?? [], [
                    'order_id' => $payload->order_id
                ]),
                'description' => $payload->description,
                'capture_method' => 'automatic',
            ]);

            $intent = $this->client->paymentIntents->create($params);
        } catch (CardException $error) {
            throw new Exception("Payment error: " . $error->getMessage());
        } catch (Exception $error) {
            throw new Exception("Payment error: " . $error->getMessage());
        }

        return PaymentResponseDTO::from_array([
            'is_redirect' => false,
            'redirect_url' => null,
            'transaction_id' => $intent->id,
            'payment_form' => null,
            'raw' => $intent->toArray(),
        ]);
    }


    /**
     * Create a customer in Stripe
     * 
     * @param CustomerDTO $customer_dto
     * @return string The Stripe customer ID
     * @throws Exception
     */
    public function create_customer(CustomerDTO $customer_dto)
    {
        $params = [];

        if (!empty($customer_dto->name)) {
            $params['name'] = $customer_dto->name;
        }

        if (!empty($customer_dto->email)) {
            $params['email'] = $customer_dto->email;
        }

        $params['metadata'] = [
            'user_id' => $customer_dto->user_id
        ];

        try {
            $customer = $this->client->customers->create($params);
            return $customer->id;
        } catch (Exception $error) {
            throw new Exception('Failed to create Stripe customer: ' . $error->getMessage());
        }
    }

    /**
     * Format amount for the payment gateway
     * 
     * @param int $amount
     * @return int|float
     */
    public function format_amount($amount)
    {
        return $amount;
    }

    /**
     * Parse amount from the payment gateway
     * 
     * @param int $amount
     * @return int|float
     */
    public function parse_amount($amount)
    {
        return $amount;
    }
}
