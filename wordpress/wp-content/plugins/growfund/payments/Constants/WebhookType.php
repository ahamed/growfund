<?php

namespace Growfund\Payments\Constants;

class WebhookType
{
    const PAYMENT = 'payment';
    const SETUP = 'setup';
    const REFUND = 'refund';
    const UNKNOWN = 'unknown';
}
