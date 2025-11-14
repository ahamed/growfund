<?php

namespace Growfund\Constants;

use Growfund\Traits\HasConstants;

class UserDeleteType
{
    use HasConstants;

    const TRASH = 'trash';

    const ANONYMIZE = 'anonymize';

    const PERMANENT = 'permanent';
}
