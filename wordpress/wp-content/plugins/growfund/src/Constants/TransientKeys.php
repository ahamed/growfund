<?php

namespace Growfund\Constants;

use Growfund\Traits\HasConstants;

class TransientKeys
{
    use HasConstants;

    /**
     * Transient key to store the whether the growfund plugin is activated
     */
    const GF_GROWFUND_ACTIVATED = 'gf_growfund_activated_transient';
}
