<?php

namespace Growfund\Constants;

use Growfund\Contracts\Constant;
use Growfund\Traits\HasConstants;

class AppConfigKeys implements Constant
{
    use HasConstants;

    /**
     * Option to store the general settings
     */
    const GENERAL = 'gf_general';

    /**
     * Option to store the campaign settings
     */
    const CAMPAIGN = 'gf_campaign';

    /**
     * Option to store the user permissions settings
     */
    const USER_PERMISSIONS = 'gf_user_permissions';

    /**
     * Option to store the payment settings
     */
    const PAYMENT = 'gf_payment';

    /**
     * Option to store the PDF receipt settings
     */
    const PDF_RECEIPT = 'gf_pdf_receipt';

    /**
     * Option to store the email and notifications settings
     */
    const EMAIL_AND_NOTIFICATIONS = 'gf_email_and_notifications';

    /**
     * Option to store the security settings
     */
    const SECURITY = 'gf_security';

    /**
     * Option to store the integrations settings
     */
    const INTEGRATIONS = 'gf_integrations';

    /**
     * Option to store the branding settings
     */
    const BRANDING = 'gf_branding';

    /**
     * Option to store the advanced settings
     */
    const ADVANCED = 'gf_advanced';

    /**
     * Option to store if its donation mode or not
     */
    const IS_DONATION_MODE = 'gf_is_donation_mode';

    /**
     * Option to store if the onboarding is completed or not
     */
    const IS_ONBOARDING_COMPLETED = 'gf_is_onboarding_completed';

    /**
     * Get all the keys
     *
     * @return array
     */
    public static function all()
    {
        return static::get_constant_values();
    }
}
