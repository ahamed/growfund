<?php

namespace Growfund\Services;

use Exception;
use Growfund\Constants\AppConfigKeys;
use Growfund\Constants\OptionKeys;
use Growfund\Core\AppSettings;
use Growfund\Core\CurrencyConfig;
use Growfund\Supports\Option;

class AppConfigService
{
    public function get_config()
    {
        if (! is_user_logged_in()) {
            return $this->public_config();
        }

        $keys = AppConfigKeys::all();
        $config = [];

        foreach ($keys as $key) {
            $config[$key] = Option::get($key, null);
        }

        if (isset($config[AppConfigKeys::PAYMENT])) {
            $config[AppConfigKeys::PAYMENT] = array_merge(
                $config[AppConfigKeys::PAYMENT],
                gf_app()->make(CurrencyConfig::class)->get()
            );
        }

        $config['gf_current_user'] = gf_user()->get_data();

        return $config;
    }

    protected function public_config()
    {
        return [
            AppConfigKeys::IS_DONATION_MODE => gf_app()->is_donation_mode(),
            AppConfigKeys::GENERAL => [
                'organization' => [
                    'name' => gf_settings(AppSettings::GENERAL)->get_organization_name(),
                    'location' => gf_settings(AppSettings::GENERAL)->get_organization_location(),
                    'contact_email' => gf_settings(AppSettings::GENERAL)->get_organization_contact_email(),
                ]
            ],
            AppConfigKeys::CAMPAIGN => [
                'allow_fund' => gf_settings(AppSettings::CAMPAIGNS)->allow_fund(),
                'allow_tribute' => gf_settings(AppSettings::CAMPAIGNS)->allow_tribute(),
                'allow_comments' => gf_settings(AppSettings::CAMPAIGNS)->allow_comments(),
            ],
            AppConfigKeys::BRANDING => gf_settings(AppSettings::BRANDING)->get(),
            AppConfigKeys::PAYMENT => gf_app()->make(CurrencyConfig::class)->get(),
        ];
    }

    public function save_salutation() {
        $titles = ['Mr.', 'Mrs.', 'Dr.', 'Prof.', 'Rev.', 'Lady', 'Sir', 'Dame', 'Lord'];
        Option::add(OptionKeys::SALUTAION, $titles);
    }

    public function save_paypal_config() {
        try {
            $manifest_path = GF_DIR_PATH . 'gateways/Paypal/manifest.json';

			if (!file_exists($manifest_path)) {
				error_log('Manifest file not exist: ' . $manifest_path); // phpcs:ignore
			}
    
			$manifest_file_content = file_get_contents($manifest_path);
            
			if (!gf_is_valid_json($manifest_file_content)) {
				error_log('Invalid manifest file'); // phpcs:ignore
			}
    
			$manifest = json_decode($manifest_file_content, true);
			$manifest['config']['logo'] = GF_DIR_URL . 'gateways/Paypal/' . $manifest['config']['logo'];
			$service = new PaymentGatewayService();
			$service->store_gateway_info($manifest['name'], $manifest);
		} catch (Exception $error) {
			error_log($error->getMessage()); // phpcs:ignore
		}
	}
}
