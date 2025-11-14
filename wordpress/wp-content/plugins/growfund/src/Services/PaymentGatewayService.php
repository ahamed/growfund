<?php 

namespace Growfund\Services;

use Growfund\Constants\AppConfigKeys;
use Growfund\Core\AppSettings;
use Growfund\Supports\Arr;
use Growfund\Supports\Option;

class PaymentGatewayService {
    /**
     * Store payment gateway information.
     * 
     * @param string $name The name of the payment gateway.
     * @param array $payload The payment gateway information.
     * 
     * @return void
     */
    public function store_gateway_info(string $name, array $payload) {
        $payments = gf_settings(AppSettings::PAYMENT)->get('payments', []);
        $payments = Arr::make($payments);
        $payment = $payments->find(function ($item) use ($name) {
            return $item['name'] === $name;
        });

        if (empty($payment)) {
            $payments->push($payload);
        } else {
            $payments = $payments->map(function ($item) use ($name, $payload) {
                if ($item['name'] === $name) {
                    return array_merge($item, $payload);
                }
                return $item;
            });
        }

        $existing_payment_settings = gf_settings(AppSettings::PAYMENT)->get() ?? [];
        $updated_payment_settings = array_merge(
            $existing_payment_settings,
            [
                'payments' => $payments->toArray(),
            ]
        );

        Option::update(AppConfigKeys::PAYMENT, $updated_payment_settings);
    }

    public function remove_gateway_info(string $name) {
        $payments = gf_settings(AppSettings::PAYMENT)->get('payments', []);
        $payments = Arr::make($payments)
            ->filter(function ($item) use ($name) {
                return $item['name'] !== $name;
            });

        $existing_payment_settings = gf_settings(AppSettings::PAYMENT)->get() ?? [];
        $updated_payment_settings = array_merge(
            $existing_payment_settings,
            [
                'payments' => $payments->toArray(),
            ]
        );

        Option::update(AppConfigKeys::PAYMENT, $updated_payment_settings);
    }
}