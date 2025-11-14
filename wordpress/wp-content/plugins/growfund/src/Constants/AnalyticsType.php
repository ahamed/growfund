<?php

namespace Growfund\Constants;

use Growfund\Traits\HasConstants;

class AnalyticsType
{
    use HasConstants;

    const METRICS              = 'metrics';
    const REVENUE_CHART        = 'revenue-chart';
    const TOP_CAMPAIGNS        = 'top-campaigns';
    const TOP_BACKERS          = 'top-backers';
    const TOP_DONORS           = 'top-donors';
    const REVENUE_BREAKDOWN    = 'revenue-breakdown';
    const TOP_FUNDS            = 'top-funds';
    const RECENT_CONTRIBUTIONS = 'recent-contributions';
}
