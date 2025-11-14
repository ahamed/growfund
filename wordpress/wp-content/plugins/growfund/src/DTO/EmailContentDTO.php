<?php

namespace Growfund\DTO;

use Growfund\CastAttributes\MoneyAttribute;

class EmailContentDTO extends DTO
{
    /** @var string */
    public $subject;

    /** @var string */
    public $heading;

    /** @var string */
    public $message;
}
