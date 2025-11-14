<?php

namespace Growfund\Controllers\API;

use Exception;

class AuthController
{
    public function logout()
    {
        if (! gf_user()) {
            throw new Exception(esc_html__('You are not logged in', 'growfund'));
        }

        wp_logout();

        return gf_response()->json([
            'data' => true,
            'message' => __('You have been logged out', 'growfund')
        ]);
    }
}
