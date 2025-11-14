<?php

namespace Growfund\Hooks\Actions;

use Growfund\Constants\HookNames;
use Growfund\Constants\HookTypes;
use Growfund\Hooks\BaseHook;
use Growfund\Route;

class RegisterRestApi extends BaseHook
{
    public function get_name()
    {
        return HookNames::REST_API_INIT;
    }

    public function get_type()
    {
        return HookTypes::ACTION;
    }

    public function handle(...$args)
    {
        do_action(HookNames::GF_ROUTE_BEFORE_INIT_ACTION);

        $routes = Route::get_routes();

        foreach ($routes as $route) {
            $route->register();
        }
    }
}
