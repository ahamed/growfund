<?php

namespace Growfund\Constants\Status;

use Growfund\Traits\HasConstants;

class TermStatus
{
    use HasConstants;

    const PUBLISHED = 'published';
    const DRAFT = 'draft';
    const TRASHED = 'trashed';
}
