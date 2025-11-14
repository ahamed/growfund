<?php

namespace Growfund\Hooks\ActivationActions;

use Growfund\Contracts\Action;
use Growfund\Supports\Woocommerce;

class CreateWoocommerceProduct implements Action
{
    public function handle()
    {
        if (!Woocommerce::is_active()) {
            return;
        }

        Woocommerce::create_gf_product();
    }
}
