<?php

namespace Growfund\Hooks\UninstallActions;

use Growfund\Contracts\Action;
use Growfund\Core\AppSettings;
use Growfund\Services\CleanupService;

class EraseApplicationData implements Action
{
    public function handle()
    {
        if (!gf_settings(AppSettings::ADVANCED)->get('erase_data_upon_uninstallation', false)) {
            return;
        }

        (new CleanupService())->erase();
    }
}
