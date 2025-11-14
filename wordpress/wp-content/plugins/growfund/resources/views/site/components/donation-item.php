<?php

/**
 * Donation Item Component
 * Displays a single donation item with donor name, amount, and time
 * 
 * @param string $donor_name - Name of the donor
 * @param float $amount - Donation amount
 * @param int $timestamp - Timestamp of the donation
 * @param string $currency - Currency code (default: USD)
 * @param string $variant - Component variant (default: 'default', options: 'default', 'modal')
 */

use Growfund\Supports\Date;
use Growfund\Supports\Utils;

// Set default values for variables
$donor_name = $donor_name ?? '';
$amount = $amount ?? 0;
$timestamp = $timestamp ?? time();
$currency = $currency ?? Utils::get_currency();
$variant = $variant ?? 'default';
?>

<div class="gf-donation-item<?php echo $variant !== 'default' ? ' gf-donation-item--' . esc_attr($variant) : ''; ?>">
    <div class="gf-donation-item__icon">
        <?php
        gf_renderer()
            ->render('site.components.icon', [
                'name' => 'heart-handshake',
                'size' => 'lg'
            ]);
		?>
    </div>
    <div class="gf-donation-item__content">
        <div class="gf-donation-item__donor"><?php echo esc_html($donor_name); ?></div>
        <div class="gf-donation-item__details">
            <span class="gf-donation-item__amount"><?php echo esc_html(gf_to_currency($amount)); ?></span>
            <span class="gf-donation-item__separator">•</span>
            <span class="gf-donation-item__time"><?php echo esc_html(Date::human_readable_time_diff(date('Y-m-d H:i:s', $timestamp))); // phpcs:ignore ?></span>
        </div>
    </div>
</div>