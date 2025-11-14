<?php

use Growfund\AjaxRouter;
use Growfund\Controllers\Site\AuthController;
use Growfund\Controllers\Site\CampaignController;
use Growfund\Controllers\Site\CommentController;
use Growfund\Controllers\Site\CampaignCheckoutController;

AjaxRouter::add_action('growfund_ajax_get_campaigns_archive', [CampaignController::class, 'ajax_get_campaigns_archive'])->with_nonce(gf_with_prefix('ajax_nonce'));
AjaxRouter::add_action('gf_search_campaigns', [CampaignController::class, 'ajax_search_campaigns'])->with_nonce(gf_with_prefix('ajax_nonce'));

AjaxRouter::add_action('gf_get_campaign_slider_items', [CampaignController::class, 'ajax_get_campaign_slider_items'])
    ->with_nonce(gf_with_prefix('ajax_nonce'));

AjaxRouter::add_action('gf_get_campaign_updates', [CampaignController::class, 'ajax_get_campaign_updates'])
    ->with_nonce(gf_with_prefix('ajax_nonce'));

AjaxRouter::add_action('gf_get_campaign_rewards', [CampaignController::class, 'ajax_get_campaign_rewards'])
    ->with_nonce(gf_with_prefix('ajax_nonce'));

AjaxRouter::add_action('gf_get_update_detail', [CampaignController::class, 'ajax_get_update_detail'])
    ->with_nonce(gf_with_prefix('ajax_nonce'));

AjaxRouter::add_action('gf_get_campaign_donations_modal', [CampaignController::class, 'ajax_get_campaign_donations_modal'])
    ->with_nonce(gf_with_prefix('ajax_nonce'));

// Bookmark routes
AjaxRouter::add_action('gf_bookmark_campaign', [CampaignController::class, 'ajax_bookmark_campaign'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_authenticated();

// Comment routes
AjaxRouter::add_action('gf_create_comment', [CommentController::class, 'create'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_authenticated();

AjaxRouter::add_action('gf_get_reply_form_template', [CommentController::class, 'get_reply_form_template'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_authenticated();

AjaxRouter::add_action('gf_get_comment_template', [CommentController::class, 'get_comment_template'])
    ->with_nonce(gf_with_prefix('ajax_nonce'));

// Auth routes
AjaxRouter::add_action('gf_login_user', [AuthController::class, 'ajax_login'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_guest();

AjaxRouter::add_action('gf_forgot_password', [AuthController::class, 'ajax_forgot_password'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_guest();

AjaxRouter::add_action('gf_reset_password', [AuthController::class, 'ajax_reset_password'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_guest();

AjaxRouter::add_action('gf_register_user', [AuthController::class, 'ajax_register'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_guest();

AjaxRouter::add_action('gf_register_fundraiser', [AuthController::class, 'ajax_register_fundraiser'])
    ->with_nonce(gf_with_prefix('ajax_nonce'))
    ->for_guest();

// Shipping cost calculation
AjaxRouter::add_action('gf_calculate_shipping_cost', [CampaignCheckoutController::class, 'calculate_shipping_cost'])->with_nonce(gf_with_prefix('ajax_nonce'));
AjaxRouter::add_action('gf_update_wc_session', [CampaignCheckoutController::class, 'ajax_update_wc_session'])->with_nonce(gf_with_prefix('ajax_nonce'));
