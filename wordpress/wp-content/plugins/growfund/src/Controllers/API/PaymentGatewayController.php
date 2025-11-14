<?php

namespace Growfund\Controllers\API;

use Growfund\Constants\AppConfigKeys;
use Growfund\Contracts\Request;
use Growfund\Core\AppSettings;
use Growfund\Exceptions\ValidationException;
use Growfund\Http\Response;
use Growfund\Payments\DTO\PaymentGatewayDTO;
use Growfund\Supports\Option;
use Growfund\Supports\Arr;
use Exception;
use Growfund\Services\PaymentGatewayService;

class PaymentGatewayController
{
    /** @var PaymentGatewayService */
    private $service = null;

    public function __construct(PaymentGatewayService $service) {
        $this->service = $service;
    }
    /**
     * Get all the available payment gateways from growfund server.
     *
     * @return Response
     */
    public function available()
    {
        $request_url = gf_remote_request_url('/payment-gateways');
        $response = wp_remote_get($request_url);

        if (is_wp_error($response) || empty($response)) {
            return gf_response()->json([
                'message' => $response->get_error_message(),
            ], Response::INTERNAL_SERVER_ERROR);
        }

        $gateways = [];

        if ($response['body']) {
            $gateways = json_decode($response['body'], true);
        }

        foreach ($gateways as &$gateway) {
            $gateway['is_installed'] = gf_installer()->is_installed(
                sprintf('%s/%s.php', $gateway['name'], $gateway['name'])
            );
            $gateway['is_enabled'] = false;
            $gateway = PaymentGatewayDTO::from_array($gateway);
        }

        unset($gateway);

        return gf_response()->json([
            'data' => $gateways,
            'message' => __('Payment gateways fetched successfully!', 'growfund')
        ]);
    }

    /**
     * Install a payment gateway from the given plugin url.
     *
     * @param Request $request
     * @return Response
     */
    public function install(Request $request)
    {
        $plugin_url = $request->get_url('plugin_url');

        if (empty($plugin_url)) {
            throw new ValidationException(esc_html__('The plugin URL is required.', 'growfund'));
        }

        try {
            gf_installer()->install($plugin_url);
        } catch (Exception $error) {
            return gf_response()->json([
                'message' => $error->getMessage()
            ], Response::INTERNAL_SERVER_ERROR);
        }

        return gf_response()->json([
            'message' => __('Payment gateway installed successfully!', 'growfund')
        ]);
    }

    /**
     * Store payment gateway configuration.
     *
     * @param Request $request The HTTP request instance.
     * @param string $name The alias of the payment gateway to retrieve.
     * @return Response JSON response containing the gateway data or null if not found.
     */
    public function store(Request $request)
    {
        $name = $request->get_string('name');
        $payload = $request->get_array('payload');

        if (empty($payload)) {
            throw new ValidationException(esc_html__('The payload is required.', 'growfund'));
        }

        $this->service->store_gateway_info($name, $payload);

        return gf_response()->json([
            'message' => __('Payment configuration updated!', 'growfund'),
        ]);
    }
}
