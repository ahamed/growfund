<?php

namespace Growfund\PostTypes;

use Growfund\Constants\AppConfigKeys;
use Growfund\Contracts\Registrable;
use Growfund\Core\AppSettings;
use Growfund\Supports\Option;

/**
 * Class to register a custom post type for campaigns.
 *
 * @since 1.0.0
 */
class Campaign implements Registrable
{
    /**
     * Post type's unique name.
     */
    const NAME = 'gf_campaign';

    /**
     * Default post status.
     */
    const DEFAULT_POST_STATUS = 'publish';

    /**
     * Register a custom post type.
     *
     * @return void
     */
    public function register()
    {
        $advance_settings = gf_settings(AppSettings::ADVANCED)->get();

        $labels = [
            'name' => __('Campaigns', 'growfund'),
            'singular_name' => __('Campaign', 'growfund'),
        ];
        $args = [
            'labels' => $labels,
            'has_archive' => true,
            'public' => false,
            'publicly_queryable' => true,
            'hierarchical' => true,
            'rewrite' => ['slug' => trim($advance_settings['campaign_permalink'] ?? 'campaigns', '/')],
            'supports' => ['title'],
            'show_in_nav_menus' => true,
        ];

        register_post_type(self::NAME, $args);
    }
}
