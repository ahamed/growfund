<?php

namespace Growfund\Supports;

class Auth
{
    public static function login_url(string $redirect = '')
    {
        $login_url = home_url('/auth/login/');

        if (!empty($redirect)) {
            $login_url = add_query_arg('redirect_to', urlencode($redirect), $login_url);
        }

        return $login_url;
    }

    public static function register_url($is_fundraiser = false)
    {
        return $is_fundraiser ? home_url('/auth/register-fundraiser/') : home_url('/auth/register/');
    }

    public static function forget_password_url()
    {
        return home_url('/auth/forgot-password/');
    }

    public static function reset_password_url()
    {
        return home_url('/auth/reset-password/');
    }
}
