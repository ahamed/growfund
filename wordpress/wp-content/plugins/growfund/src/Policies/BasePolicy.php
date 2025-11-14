<?php

namespace Growfund\Policies;

use Growfund\Exceptions\AuthorizationException;

class BasePolicy
{
    public function __call($method, $args)
    {
        if (gf_user()->is_admin()) {
            return true;
        }

        $method = str_replace('authorize_', '', $method);

        if (method_exists($this, $method)) {
            return $this->{$method}(...$args);
        }

        throw new AuthorizationException(esc_html__('Invalid policy method', 'growfund'));
    }
}
