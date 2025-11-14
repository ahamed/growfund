<?php
/*
* Plugin Name:       Growfund Gateway Stripe
* Plugin URI:        https://growfund.com
* Description:       A payment plugin for the growfund plugin
* Version:           1.0.0
* Author:            Growfund
* Author URI:        https://growfund.com
* Text Domain:       growfund-stripe
* Requires at least: 5.9
* Tested up to:      6.6.2
* License:           GPL-2.0+
* License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
* Domain Path:       /languages
*/

use Growfund\Services\PaymentGatewayService;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Define plugin version
 */
define('GF_STRIPE_VERSION', '1.0.0');

/**
 * Define plugin file
 * @since   1.0.0
 */
define('GF_STRIPE_PLUGIN_FILE', __FILE__);

/**
 * Define plugin working directory
 * @since   1.0.0
 */
define('GF_STRIPE_WORKING_DIRECTORY', dirname(GF_STRIPE_PLUGIN_FILE));

/**
 * Define plugin root url
 * @since   1.0.0
 */
define('GF_STRIPE_ROOT_URL', plugin_dir_url(__FILE__));

/**
 * Define plugin directory url
 * @since   1.0.0
 */
define('GF_STRIPE_DIR_URL', plugin_dir_url(__FILE__));

/**
 * Define plugin directory path
 * @since   1.0.0
 */
define('GF_STRIPE_DIR_PATH', plugin_dir_path(__FILE__));

/**
 * Define plugin directory src path
 * @since   1.0.0
 */
define('GF_STRIPE_SRC_PATH', GF_STRIPE_DIR_PATH . 'src/');

/**
 * Define the react application root url
 * @since 1.0.0
 */
define('GF_STRIPE_REACT_APP_URL', GF_STRIPE_DIR_URL . 'resources/ts/');

/**
 * Define the react application root path
 * @since 1.0.0
 */
define('GF_STRIPE_REACT_APP_PATH', GF_STRIPE_DIR_PATH . 'resources/ts/');

/**
 * Define plugin base name
 * @since   1.0.0
 */
define('GF_STRIPE_BASENAME', plugin_basename(__FILE__));

if (function_exists('add_action')) {
    add_action('admin_init', function() {
        if (!is_plugin_active('growfund/growfund.php')) {
            deactivate_plugins(GF_STRIPE_BASENAME);
            add_action('admin_notices', function () {
                echo '<div class="notice notice-error"><p><strong>Growfund Gateway Paypal:</strong> The Growfund plugin must be installed and activated to use Growfund Gateway Paypal.</p></div>';
            });
        }
    });
}

require_once __DIR__ . '/../growfund/vendor/autoload.php';
require_once __DIR__ . '/vendor/autoload.php';


register_activation_hook(GF_STRIPE_PLUGIN_FILE, 'activate_growfund_stripe_plugin'); 

function activate_growfund_stripe_plugin() {
    try {     
        $manifest_path = GF_STRIPE_DIR_PATH . 'manifest.json';

        if (!file_exists($manifest_path)) {
            error_log('Manifest file not exist: ' . $manifest_path);
        }
    
        $manifest_file_content = file_get_contents($manifest_path);
            
        if (!gf_is_valid_json($manifest_file_content)) {
            error_log('Invalid manifest file');
        }
    
        $manifest = json_decode($manifest_file_content, true);
        $service = new PaymentGatewayService();
        $service->store_gateway_info($manifest['name'], $manifest);
    } catch (Exception $error) {
        error_log($error->getMessage());
    }
}


register_deactivation_hook(GF_STRIPE_PLUGIN_FILE, 'deactivate_growfund_stripe_plugin');

function deactivate_growfund_stripe_plugin() {
    try {     
        $manifest_path = GF_STRIPE_DIR_PATH . 'manifest.json';

        if (!file_exists($manifest_path)) {
            error_log('Manifest file not exist: ' . $manifest_path);
        }
    
        $manifest_file_content = file_get_contents($manifest_path);
            
        if (!gf_is_valid_json($manifest_file_content)) {
            error_log('Invalid manifest file');
        }
    
        $manifest = json_decode($manifest_file_content, true);
        $service = new PaymentGatewayService();
        $service->remove_gateway_info($manifest['name']);
    } catch (Exception $error) {
        error_log($error->getMessage());
    }
}

register_uninstall_hook(GF_STRIPE_PLUGIN_FILE, 'uninstall_growfund_stripe_plugin');

function uninstall_growfund_stripe_plugin() {
    try {     
        $manifest_path = GF_STRIPE_DIR_PATH . 'manifest.json';

        if (!file_exists($manifest_path)) {
            error_log('Manifest file not exist: ' . $manifest_path);
        }
    
        $manifest_file_content = file_get_contents($manifest_path);
            
        if (!gf_is_valid_json($manifest_file_content)) {
            error_log('Invalid manifest file');
        }
    
        $manifest = json_decode($manifest_file_content, true);
        $service = new PaymentGatewayService();
        $service->remove_gateway_info($manifest['name']);
    } catch (Exception $error) {
        error_log($error->getMessage());
    }
}
