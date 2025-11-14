<?php

namespace Growfund\Constants;

class Tables
{
    /**
     * Table name for pledges
     */
    const PLEDGES = 'gf_pledges';

    /**
     * Table name for donations
     */
    const DONATIONS = 'gf_donations';

    /**
     * Table name for campaign collaborator
     */
    const CAMPAIGN_COLLABORATORS = 'gf_campaign_collaborators';

    /**
     * Table name for funds
     */
    const FUNDS = 'gf_funds';

    /**
     * Table name for activities of user, campaign and pledge, donation etc
     */
    const ACTIVITIES = 'gf_activities';

    /**
     * Table name for storing the bookmarked campaigns by backers/donors
     */
    const BOOKMARKS = 'gf_bookmarks';
}
