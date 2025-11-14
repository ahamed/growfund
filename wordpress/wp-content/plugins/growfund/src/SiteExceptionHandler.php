<?php

namespace Growfund;

use Growfund\Exceptions\NotFoundException;
use Growfund\Exceptions\ValidationException;
use Growfund\Http\Response;
use Exception;

class SiteExceptionHandler
{
    public static function handle(Exception $exception)
    {
        if ($exception instanceof NotFoundException) {
            return gf_redirect(home_url());
        }

        gf_redirect(home_url());
    }
}
