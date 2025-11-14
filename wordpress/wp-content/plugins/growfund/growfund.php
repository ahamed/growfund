<?php
/**
* Plugin Name:       Growfund
* Plugin URI:        https://growfund.com
* Description:       Launch your donation or reward-based WordPress crowdfunding platform with Growfund. It combines native payments, WooCommerce integration, real-time insights, and fully customizable campaigns, making it the ultimate WordPress crowdfunding plugin.
* Version:           1.0.0
* Author:            Themeum
* Author URI:        https://themeum.com
* Text Domain:       growfund
* Requires PHP:      7.4
* Requires at least: 5.9
* Tested up to:      6.8
* License:           GPLv2 or later
* License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
* Domain Path:       /languages
*
* @package Growfund
*/

use Growfund\Application;
use Growfund\Constants\HookNames;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Define plugin version
 */
define('GF_VERSION', '1.0.0');

/**
 * Define plugin file
 * @since   1.0.0
 */
define('GF_PLUGIN_FILE', __FILE__);

/**
 * Define plugin working directory
 * @since   1.0.0
 */
define('GF_WORKING_DIRECTORY', dirname(GF_PLUGIN_FILE));

/**
 * Define plugin root url
 * @since   1.0.0
 */
define('GF_ROOT_URL', plugin_dir_url(__FILE__));

/**
 * Define plugin directory url
 * @since   1.0.0
 */
define('GF_DIR_URL', plugin_dir_url(__FILE__));

/**
 * Define plugin directory path
 * @since   1.0.0
 */
define('GF_DIR_PATH', plugin_dir_path(__FILE__));

/**
 * Define plugin directory src path
 * @since   1.0.0
 */
define('GF_SRC_PATH', GF_DIR_PATH . 'src/');

/**
 * Define the react application root url
 * @since 1.0.0
 */
define('GF_REACT_APP_URL', GF_DIR_URL . 'resources/ts/');

/**
 * Define the react application root path
 * @since 1.0.0
 */
define('GF_REACT_APP_PATH', GF_DIR_PATH . 'resources/ts/');

/**
 * Define plugin base name
 * @since   1.0.0
 */
define('GF_BASENAME', plugin_basename(__FILE__));

/**
 * Define plugin environment mode
 * Available values - development|production
 * @since   1.0.0
 */
define('GF_ENV_MODE', 'development');

/**
 * Define plugin prefix
 * @since   1.0.0
 */
define('GF_PREFIX', 'gf_');

if (!class_exists('ActionScheduler')) {
    require_once __DIR__ . '/vendor/woocommerce/action-scheduler/action-scheduler.php';
}

// Include the autoloader
require_once __DIR__ . '/vendor/autoload.php';

register_activation_hook(GF_PLUGIN_FILE, [Application::class, 'handle_activation']);
register_deactivation_hook(GF_PLUGIN_FILE, [Application::class, 'handle_deactivation']);
register_uninstall_hook(GF_PLUGIN_FILE, [Application::class, 'handle_uninstall']);

add_action(HookNames::PLUGINS_LOADED, 'gf_plugin_initializer');

function gf_plugin_initializer()
{
	if (is_plugin_active('growfund-pro/growfund-pro.php')) {
		add_action('pre_current_active_plugins', function () {
            add_filter('plugin_action_links_' . GF_BASENAME, function ($actions) {
                if (isset($actions['deactivate'])) {
                    $actions['deactivate'] = '<span style="color:gray;" title="Deactivate Growfund Pro first to disable Growfund.">Deactivate (disabled)</span>';
                }
                return $actions;
            });
		});

		add_action('after_plugin_row_' . GF_BASENAME, function () {
			echo '
                <script type="text/javascript">
                    document.querySelector("tr[data-slug=\'growfund\']").classList.add("update");
                </script>
                <tr class="plugin-update-tr active">
                    <td colspan="4" class="plugin-update colspanchange">
                        <div class="update-message notice inline notice-warning notice-alt">
                            <p><strong>Growfund:</strong> You must deactivate <strong>Growfund Pro</strong> before deactivating Growfund.</p>
                        </div>
                    </td>
                </tr>
            ';
		});
	}
    

    require_once __DIR__ . '/bootstrap/app.php';
}

require_once __DIR__ . '/helpers.php';
