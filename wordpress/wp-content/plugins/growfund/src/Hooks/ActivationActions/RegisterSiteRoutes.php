<?php

namespace Growfund\Hooks\ActivationActions;

use Growfund\Contracts\Action;
use Growfund\SiteRouter;

class RegisterSiteRoutes implements Action
{
    public function handle()
    {
        SiteRouter::register_rewrite_rules();
        flush_rewrite_rules();
    }
}
