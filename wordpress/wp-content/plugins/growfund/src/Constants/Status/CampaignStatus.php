<?php

namespace Growfund\Constants\Status;

use Growfund\Traits\HasConstants;

class CampaignStatus
{
    use HasConstants;

    const PUBLISHED = 'published';
    const DRAFT = 'draft';
    const PENDING = 'pending';
    const FUNDED = 'funded';
    const DECLINED = 'declined';
    const TRASHED = 'trashed';
    const COMPLETED = 'completed';
    const CANCELLED = 'cancelled';
}
