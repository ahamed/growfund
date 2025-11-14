<?php

namespace Growfund\Supports;

use Growfund\Capabilities\CampaignCapabilities;
use Growfund\Constants\Status\CampaignStatus;
use Growfund\Core\AppSettings;
use Growfund\Services\Site\CampaignService;

class Template
{
    public static function get_campaign_archive_content()
    {
        $campaign_service = new CampaignService();
        $template_dto = $campaign_service->prepare_campaigns_data();

        return gf_renderer()->get_html('site.campaigns.template-parts.archive-content', $template_dto->to_array());
    }

    public static function get_campaign_details_content()
    {
        if (gf_settings(AppSettings::CAMPAIGNS)->is_login_required_to_view_campaign_detail() && !gf_user()->is_logged_in()) {
            gf_redirect(gf_login_url(gf_campaign_url()));
        }

        $campaign_service = new CampaignService();

        $campaign_status = PostMeta::get(get_the_ID(), 'status');

        if (!in_array($campaign_status, [CampaignStatus::COMPLETED, CampaignStatus::FUNDED, CampaignStatus::PUBLISHED], true) && !gf_user()->can(CampaignCapabilities::EDIT, get_the_ID())) {
            gf_redirect(home_url());
        } else {
			$template_dto = $campaign_service->prepare_single_campaign_data();
        }

        return gf_renderer()->get_html('site.campaigns.template-parts.single-content', $template_dto->to_array());
    }
}
