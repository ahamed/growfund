<?php

namespace Growfund\Hooks\Actions;

use Growfund\AjaxRouter;
use Growfund\Constants\HookNames;
use Growfund\Constants\HookTypes;
use Growfund\Hooks\BaseHook;

class RegisterAjaxRouter extends BaseHook
{
    public function get_name()
    {
        return HookNames::INIT;
    }

    public function get_type()
    {
        return HookTypes::ACTION;
    }

    public function handle(...$args)
    {
        AjaxRouter::register();
    }
}
