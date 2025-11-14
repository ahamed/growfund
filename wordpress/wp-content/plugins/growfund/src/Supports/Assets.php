<?php

namespace Growfund\Supports;

use Growfund\Constants\UserTypes\Admin;

class Assets
{
    /**
     * enqueue vite assets with help of the manifest file.
     *
     * @return void
     */
    public static function enqueue_vite_assets()
    {
        static::add_growfund_config();

        $vite = new ViteManifest(
            GF_DIR_PATH . 'resources/dist/',
            GF_DIR_URL . 'resources/dist/'
        );

        $entrypoint = $vite->get_entrypoint('growfund/src/main.tsx', true);

        if (empty($entrypoint)) {
            return;
        }

        $styles = $vite->get_styles('growfund/src/main.tsx');

        foreach ($styles as $index => $style) {
            // phpcs:ignore -- intentionally ignored enqueue version
            wp_enqueue_style(
                'growfund-bundle-style-' . $index,
                $style['url'],
                []
            );
        }

        if (gf_app_features()->is_pro()) {
            return;
        }

        wp_enqueue_script(
            'growfund-bundle',
            $entrypoint['url'],
            [],
            null,  // phpcs:ignore -- intentionally ignored enqueue version
            true
        );

        add_filter('script_loader_tag', function ($tag, $handle) {
            if ($handle === 'growfund-bundle') {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
            return $tag;
        }, 10, 3);

        static::load_js_translations(
            'growfund',
            'growfund-bundle'
        );
    }

    /**
     * Load the JavaScript translations for the growfund plugin.
     *
     * @param string $domain The domain of the translations.
     * @return void
     */
    public static function load_js_translations(string $domain = 'growfund', string $handle = 'growfund-bundle')
    {
        if (!wp_script_is($handle, 'enqueued')) {
            return;
        }

        $locale = determine_locale();
        $translation_file = GF_DIR_PATH . "languages/{$domain}-{$locale}-*.json";
        $files = glob($translation_file);

        if (!empty($files)) {
            foreach ($files as $file) {
                $translations = file_get_contents($file);
                $translation_data = json_decode($translations, true);

                if ($translation_data && isset($translation_data['locale_data'][$domain])) {
                    wp_add_inline_script(
                        $handle,
                        sprintf(
                            'wp.i18n.setLocaleData(%s, "%s")',
                            wp_json_encode($translation_data['locale_data'][$domain]),
                            $domain
                        ),
                        'before'
                    );
                }

            }
        }
    }

    /**
     * Generate the assets url based on the ENV mode
     *
     * @return string
     */
    public static function get_assets_url()
    {
        return gf_is_dev_mode()
            ? 'http://localhost:5173'
            : esc_url(GF_DIR_URL . 'resources/dist');
    }

    /**
     * Generates the window.growfund JavaScript configuration object.
     *
     * @param bool $as_guest config script based on the guest user or login user.
     * @return string The JavaScript object assignment for window.growfund.
     */
    public static function get_growfund_config_script($as_guest = false)
    {
        $user_role = gf_user()->get_active_role();

        if ($user_role === null) {
            $user_role = Admin::ROLE;
        }

        $config_data = [
            'site_url' => esc_url(site_url()),
            'rest_url_base' => esc_url(rest_url() . 'growfund/v1'),
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => esc_attr(wp_create_nonce('wp_rest')),
            'ajax_nonce' => wp_create_nonce(gf_with_prefix('ajax_nonce')),
            'user_role' => gf_user()->get_active_role(),
            'is_onboarding_completed' => gf_app()->is_onboarding_completed(),
            'is_woocommerce_installed' => gf_app()->is_woocommerce_installed(),
            'is_donation_mode' => gf_app()->is_donation_mode(),
            'version' => GF_VERSION,
            'debug' => gf_is_dev_mode(),
            'mode' => GF_ENV_MODE,
            'assets_url' => static::get_assets_url(),
            'as_guest' => $as_guest,
            'is_pro' => gf_app_features()->is_pro(),
            'features' => gf_app_features()->all(),
            'is_migration_available_from_crowdfunding' => gf_app()->is_migration_available_from_crowdfunding(),
        ];

        return sprintf(
            'window.growfund = %s;',
            wp_json_encode($config_data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        );
    }

    /**
     * add growfund config to the head.
     *
     * @return void
     */
    protected static function add_growfund_config()
    {
        wp_register_script('growfund-config', false, [], GF_VERSION, true);
        wp_enqueue_script('growfund-config');
        wp_add_inline_script('growfund-config', static::get_growfund_config_script(), 'after');
    }
}
