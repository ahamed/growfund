<?php

namespace Growfund\Shortcodes;

use Growfund\Core\Shortcode;

class Thumbnail extends Shortcode
{
    protected $name = 'gf_campaign_thumbnail';

    public function callback($attributes, string $content = '', string $shortcode_tag = '')
    {
        $attributes = shortcode_atts([
            'src' => '#',
        ], $attributes);

        $source = esc_url($attributes['src']);

        return gf_renderer()->get_html('site.components.thumbnail', ['src' => $source]);
    }
}
