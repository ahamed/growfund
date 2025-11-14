<?php

namespace Growfund\App\Events;

class CampaignEndedEvent
{
    /** @var int */
    public $campaign_id;

    public function __construct(int $campaign_id)
    {
        $this->campaign_id = $campaign_id;
    }
}
