<?php

namespace Growfund\Hooks\Actions;

use Growfund\Constants\HookNames;
use Growfund\Constants\HookTypes;
use Growfund\Core\AppSettings;
use Growfund\Hooks\BaseHook;
use WP_Error;

class RestrictUserFromLogin extends BaseHook
{
    public function get_name()
    {
        return HookNames::WP_AUTHENTICATE_USER;
    }

    public function get_type()
    {
        return HookTypes::FILTER;
    }

    public function handle(...$args)
    {
        list($user) = $args;

        if (gf_user($user->ID)->is_admin()) {
            return $user;
        }

        if (gf_user($user->ID)->is_soft_deleted() || gf_user($user->ID)->is_anonymized()) {
            return new WP_Error(
                'user_not_found',
                __('User not found.', 'growfund')
            );
        }

        if (gf_settings(AppSettings::SECURITY)->is_enabled_email_verification() && !gf_user($user->ID)->is_verified()) {
            return new WP_Error(
                'email_not_verified',
                __('You must verify your email before logging in.', 'growfund')
            );
        }


        return $user;
    }
}
