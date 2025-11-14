<?php

namespace Growfund\DTO\Site\Campaign;

use Growfund\DTO\DTO;

/**
 * DTO for campaign timeline dates
 * 
 */
class TimelineDatesDTO extends DTO
{
    /** @var string */
    public $start_date;

    /** @var string */
    public $end_date;

    /** @var string */
    public $start_date_formatted;

    /** @var string */
    public $end_date_formatted;

    /** @var string */
    public $launch_date_formatted;
}
