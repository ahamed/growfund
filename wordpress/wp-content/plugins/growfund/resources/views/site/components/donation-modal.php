<?php

/**
 * Donation Modal Component
 * Displays a modal with all donations, sorting options, and infinite scroll
 * 
 * @param int $campaign_id - Campaign ID to fetch donations for
 * @param int $total_donations - Total number of donations
 */

use Growfund\Supports\Utils;

$campaign_id = $campaign_id ?? 0;
$total_donations = $total_donations ?? 0;

$is_user_logged_in = gf_user()->is_logged_in();

$checkout_url = $campaign->checkout_url ?? Utils::get_checkout_url($campaign_id);
?>

<div class="gf-donation-modal" id="gf-donation-modal-<?php echo esc_attr($campaign_id); ?>" data-checkout-url="<?php echo esc_url($checkout_url); ?>">
    <div class="gf-donation-modal__overlay"></div>

    <div class="gf-donation-modal__content">
        <!-- Modal Header -->
        <div class="gf-donation-modal__header">
            <h3 class="gf-donation-modal__title">
                <?php
                /* Translators: %d: Total number of donations */
                printf(esc_html__('Donations (%d)', 'growfund'), esc_html($total_donations));
                ?>
            </h3>
            <?php
            gf_renderer()
                ->render('site.components.button', [
                    'text' => '',
                    'type' => 'button',
                    'variant' => 'icon-only',
                    'class' => 'gf-donation-modal__close',
                    'icon' => 'cross',
                    'ariaLabel' => esc_html__('Close modal', 'growfund')
                ]);
            ?>
        </div>

        <!-- Sorting Options -->
        <div class="gf-donation-modal__sorting">
            <?php
            gf_renderer()
                ->render('site.components.button', [
                    'text' => esc_html__('Newest', 'growfund'),
                    'type' => 'button',
                    'variant' => 'default',
                    'class' => 'gf-donation-modal__sort-btn gf-donation-modal__sort-btn--newest gf-donation-modal__sort-btn--active',
                    'attributes' => [
                        'data-sort' => 'newest',
                        'data-campaign-id' => $campaign_id
                    ]
                ]);
            ?>
            <?php
            gf_renderer()
                ->render('site.components.button', [
                    'text' => esc_html__('Top', 'growfund'),
                    'type' => 'button',
                    'variant' => 'default',
                    'class' => 'gf-donation-modal__sort-btn gf-donation-modal__sort-btn--top',
                    'attributes' => [
                        'data-sort' => 'top',
                        'data-campaign-id' => $campaign_id
                    ]
                ]);
            ?>
        </div>

        <!-- Donations List Container -->
        <div class="gf-donation-modal__list-container">
            <div class="gf-donation-modal__list" id="gf-donation-modal-list-<?php echo esc_attr($campaign_id); ?>">
                <!-- Donations will be loaded here via AJAX -->
            </div>

            <!-- Loading Indicator -->
            <div class="gf-donation-modal__loading" id="gf-donation-modal-loading-<?php echo esc_attr($campaign_id); ?>" style="display: none;">
                <div class="gf-donation-modal__loading-spinner"></div>
                <span><?php esc_html_e('Loading...', 'growfund'); ?></span>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="gf-donation-modal__footer">
            <?php
            gf_renderer()
                ->render('site.components.button', [
                    'text' => esc_html__('Donate now', 'growfund'),
                    'type' => 'button',
                    'class' => 'gf-donation-modal__donate-btn gf-btn gf-btn--primary'
                ]);
            ?>
        </div>
    </div>
</div>

<!-- Donation Item Template (hidden, used for cloning) -->
<template id="gf-donation-item-template">
    <?php
    gf_renderer()
        ->render('site.components.donation-item', [
            'donor_name' => '',
            'amount' => 0,
            'timestamp' => time(),
            'currency' => Utils::get_currency(),
            'variant' => 'modal'
        ]);
	?>
</template>

<!-- Empty State Template -->
<template id="gf-donation-empty-template">
    <div class="gf-donation-modal__empty">
        <p><?php esc_html_e('No donations found', 'growfund'); ?></p>
    </div>
</template>