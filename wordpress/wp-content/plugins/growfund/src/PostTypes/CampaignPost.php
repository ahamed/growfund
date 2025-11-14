<?php

namespace Growfund\PostTypes;

use Growfund\Contracts\Registrable;

/**
 * Class to register a custom post type for campaing post.
 *
 * @since 1.0.0
 */
class CampaignPost implements Registrable
{
    /**
     * Post type's unique name.
     */
    const NAME = 'gf_campaign_post';

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
        $labels = [
            'name' => __('Campaign Posts', 'growfund'),
            'singular_name' => __('Campaign Post', 'growfund'),
        ];
        $args = [
            'labels' => $labels,
            'has_archive' => true,
            'public' => false,
            'hierarchical' => true,
            'rewrite' => ['slug' => 'campaign-posts'],
            'supports' => [
                'title',
                'editor',
            ],
        ];

        register_post_type(static::NAME, $args);
    }
}
