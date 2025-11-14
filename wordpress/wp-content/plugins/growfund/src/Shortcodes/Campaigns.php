<?php

namespace Growfund\Shortcodes;

use Growfund\Core\Shortcode;
use Growfund\Supports\Template;

class Campaigns extends Shortcode
{
    protected $name = 'gf_campaigns';

    public function callback($attributes, string $content = '', string $shortcode_tag = '')
    {
        return Template::get_campaign_archive_content();
    }
}
