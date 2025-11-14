<?php

namespace Growfund\Supports;

class WPQueryHelper
{
    /**
     * Get current WordPress query variables
     *
     * @return array
     */
    public static function get_query_vars()
    {
        global $wp_query;
        return $wp_query->query ?? [];
    }
}
