<?php

namespace Growfund\Hooks\DeactivationAction;

use Growfund\Contracts\Action;

class FlushRewriteRules implements Action
{
    public function handle()
    {
        flush_rewrite_rules();
    }
}
