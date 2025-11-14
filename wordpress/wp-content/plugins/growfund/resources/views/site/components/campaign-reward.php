<?php

/**
 * Campaign Reward Component
 * 
 * @param array $rewards Array of reward objects with properties:
 *   - image_src: Source URL for the reward image
 *   - image_alt: Alt text for the reward image
 *   - title: Reward title
 *   - price: Reward price
 *   - description: Reward description
 *   - ships_to: Shipping destination
 *   - backers: Number of backers
 *   - delivery_date: Estimated delivery date
 *   - quantity_info: Quantity information (e.g., "100 left of 500")
 *   - items: Array of items included (each item should have: name, quantity, image_src, image_alt)
 *   - button_text: Button text
 *   - variant: Component variant ('default', 'checkout', or 'pledge')
 *   - campaign_id: Campaign ID for checkout URL
 *   - reward_id: Reward ID for checkout URL
 * @param bool $is_closed Whether the campaign is closed
 */

use Growfund\Supports\Utils;

// Get proper placeholder image URL
$placeholder_url = gf_site_placeholder_image_url();

// Handle rewards data that might be passed directly or as a nested array
$rewards = $rewards ?? [];
$is_closed = $is_closed ?? false;

if (isset($data['rewards'])) {
    $rewards = $data['rewards'];
}

$campaign = $data['campaign'] ?? null;

// If no rewards array, return early
if (empty($rewards)) {
    return;
}

// Render each reward in the array
foreach ($rewards as $reward) {
    // Determine variant and classes
    $variant = $reward->variant ?? 'default';
    $variant_class = '';
    $card_class = 'gf-card ';

    switch ($variant) {
        case 'checkout':
            $variant_class = 'gf-campaign-reward--checkout';
            $card_class = '';
            break;
        case 'pledge':
            $variant_class = 'gf-campaign-reward--pledge';
            $card_class = '';
            break;
        default:
            $variant_class = '';
            $card_class = 'gf-card ';
            break;
    }

    $checkout_url = '#';
    if (isset($reward->campaign_id) && isset($reward->id)) {
        $is_user_logged_in = gf_user()->is_logged_in();

        if ($is_user_logged_in) {
            $checkout_url = esc_url(Utils::get_checkout_url($reward->campaign_id, $reward->id));
        } else {
            $checkout_url = esc_url(gf_login_url(gf_campaign_url($reward->campaign_id)));
        }
    }
	?>

    <div class="<?php echo esc_attr($card_class); ?>gf-campaign-reward <?php echo esc_attr($variant_class); ?>"
        data-reward-id="<?php echo esc_attr($reward->id ?? ''); ?>"
        data-campaign-id="<?php echo esc_attr($reward->campaign_id ?? ''); ?>">
        <?php if ($variant === 'pledge') : ?>
            <!-- Pledge Variant -->
            <div class="gf-reward-pledge-layout">
                <div class="gf-reward-content">
                    <div class="gf-reward-header">
                        <h4 class="gf-reward-title"><?php echo esc_html($reward->title ?? __('Untitled Reward', 'growfund')); ?></h4>
                        <span class="gf-reward-price"><?php echo esc_html(gf_to_currency($reward->price ?? 0)); ?></span>
                    </div>
                    <p class="gf-reward-description">
                        <?php echo esc_html($reward->description ?? ''); ?>
                    </p>

                    <div class="gf-reward-details">
                        <div class="gf-reward-shipping">
                            <?php
                            gf_renderer()
                                ->render('site.components.icon', [
									'name' => 'location',
									'size' => 'sm'
								]);
							?>
                            <div class="gf-reward-shipping-text-container">
                                <span class="gf-reward-shipping-label"><?php esc_html_e('Ships to', 'growfund'); ?></span>
                                <span class="gf-reward-shipping-text"><?php echo esc_html($reward->ships_to ?? __('Worldwide', 'growfund')); ?></span>
                            </div>
                        </div>
                        <div class="gf-reward-backers">
                            <?php
                            gf_renderer()
                                ->render('site.components.icon', [
									'name' => 'users',
									'size' => 'sm'
								]);
							?>
                            <div class="gf-reward-backers-text-container">
                                <span class="gf-reward-backers-label"><?php esc_html_e('Backers', 'growfund'); ?></span>
                                <span class="gf-reward-backers-text"><?php echo esc_html($reward->backers ?? '0'); ?></span>
                            </div>
                        </div>
                    </div>

                    <?php if ($reward->delivery_date || $reward->quantity_info) : ?>
                        <div class="gf-reward-meta">
                            <?php if ($reward->delivery_date) : ?>
                                <div class="gf-delivery">
                                    <?php
                                    gf_renderer()
                                        ->render('site.components.icon', [
											'name' => 'shipping',
											'size' => 'sm'
										]);
									?>
                                    <div class="gf-reward-delivery-text-container">
                                        <span class="gf-reward-delivery-label"><?php esc_html_e('Estimated Delivery:', 'growfund'); ?></span>
                                        <span class="gf-reward-delivery-text"><?php echo esc_html($reward->delivery_date); ?></span>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if ($reward->quantity_info) : ?>
                                <div class="gf-quantity">
                                    <?php
                                    gf_renderer()
                                        ->render('site.components.icon', [
											'name' => 'shopping',
											'size' => 'sm'
										]);
									?>
                                    <div class="gf-reward-quantity-text-container">
                                        <span class="gf-reward-quantity-label"><?php esc_html_e('Limited Quantity:', 'growfund'); ?></span>
                                        <span class="gf-reward-quantity-text"><?php echo esc_html($reward->quantity_info); ?></span>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Items section -->
                    <div class="gf-reward-items">
                        <?php $items = $reward->items ?? []; ?>
                        <?php if (!empty($items)) : ?>
                            <p class="gf-reward-items-label">
                                <?php
                                /* translators: %d: Number of items */
                                printf(esc_html(_n('%d item included', '%d items included', count($items), 'growfund')), count($items));
                                ?>
                            </p>
                            <ul class="gf-reward-items-list">
                                <?php foreach ($items as $item) : ?>
                                    <li class="gf-reward-item">
                                        <div class="gf-reward-item-image">
                                            <?php
                                            gf_renderer()
                                                ->render('site.components.image', [
                                                    'src' => !empty($item->image_src) ? $item->image_src : $placeholder_url,
                                                    'alt' => $item->image_alt ?? $item->name
                                                ]);
											?>
                                        </div>
                                        <div class="gf-reward-item-content">
                                            <div class="gf-reward-item-name"><?php echo esc_html($item->name); ?></div>
                                            <?php if (isset($item->quantity)) : ?>
                                                <span class="gf-qty">
                                                    <?php
                                                    /* translators: %s: Quantity */
                                                    printf(esc_html__('Quantity: %s', 'growfund'), esc_html($item->quantity));
                                                    ?>
                                                </span>
                                            <?php endif; ?>
                                        </div>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php else : ?>
                            <p class="gf-reward-items-label"><?php esc_html_e('0 items included', 'growfund'); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="gf-reward-pledge-right">
                    <div class="gf-reward-pledge-image">
                        <?php
                        gf_renderer()
                            ->render('site.components.image', [
                                'src' => !empty($reward->image_src) ? $reward->image_src : $placeholder_url,
                                'alt' => $reward->image_alt ?? __('Reward Image', 'growfund')
                            ]);
						?>
                    </div>
                    <div class="gf-reward-pledge-action">
                        <?php
                        gf_renderer()
                            ->render('site.components.button', [
                                /* translators: %s: Reward price */
                                'text' => sprintf(esc_html__('Pledge %s', 'growfund'), esc_html(gf_to_currency($reward->price ?? 0))),
                                'class' => 'gf-btn--primary gf-reward-pledge-button',
                                'href' => $checkout_url
                            ]);
						?>
                    </div>
                </div>
            </div>

        <?php elseif ($variant === 'checkout') : ?>
            <!-- Checkout Variant -->
            <div class="gf-reward-checkout-header">
                <div class="gf-reward-checkout-image">
                    <?php
                    gf_renderer()
                        ->render('site.components.image', [
                            'src' => !empty($reward->image_src) ? $reward->image_src : $placeholder_url,
                            'alt' => $reward->image_alt ?? esc_html__('Reward Image', 'growfund')
                        ]);
					?>
                </div>
                <div class="gf-reward-checkout-info">
                    <h4 class="gf-reward-title">
                        <?php echo esc_html($reward->title ?? esc_html__('Untitled Reward', 'growfund')); ?>
                    </h4>
                    <span class="gf-reward-price"><?php echo esc_html(gf_to_currency($reward->price ?? 0)); ?></span>
                </div>
            </div>

            <!-- Items section for checkout variant -->
            <div class="gf-reward-items gf-reward-items--checkout">
                <?php $items = $reward->items ?? []; ?>
                <?php if (!empty($items)) : ?>
                    <p class="gf-reward-items-label">
                        <?php
                        /* translators: %d: Number of items */
                        printf(esc_html(_n('%d item included', '%d items included', count($items), 'growfund')), esc_html(count($items)));
                        ?>
                    </p>
                    <ul class="gf-reward-items-list">
                        <?php foreach ($items as $item) : ?>
                            <li class="gf-reward-item">
                                <div class="gf-reward-item-image">
                                    <?php
                                    gf_renderer()
                                        ->render('site.components.image', [
                                            'src' => !empty($item->image_src) ? $item->image_src : $placeholder_url,
                                            'alt' => $item->image_alt ?? $item->name
                                        ]);
									?>
                                </div>
                                <div class="gf-reward-item-content">
                                    <div class="gf-reward-item-name"><?php echo esc_html($item->name); ?></div>
                                    <?php if (isset($item->quantity)) : ?>
                                        <span class="gf-qty">
                                            <?php
                                            /* translators: %s: Quantity */
                                            printf(esc_html__('Quantity: %s', 'growfund'), esc_html($item->quantity));
                                            ?>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else : ?>
                    <p class="gf-reward-items-label"><?php esc_html_e('0 items included', 'growfund'); ?></p>
                <?php endif; ?>
            </div>

        <?php else : ?>
            <!-- Default Variant -->
            <div class="gf-reward-image">
                <?php
                gf_renderer()
                    ->render('site.components.image', [
                        'src' => !empty($reward->image_src) ? $reward->image_src : $placeholder_url,
                        'alt' => $reward->image_alt ?? esc_html__('Reward Image', 'growfund')
                    ]);
				?>
            </div>
            <div class="gf-reward-content">
                <div class="gf-reward-header">
                    <h4 class="gf-reward-title"><?php echo esc_html($reward->title ?? esc_html__('Untitled Reward', 'growfund')); ?></h4>
                    <span class="gf-reward-price"><?php echo esc_html(gf_to_currency($reward->price ?? 0)); ?></span>
                </div>
                <p class="gf-reward-description">
                    <?php echo esc_html($reward->description ?? ''); ?>
                </p>

                <div class="gf-reward-details">
                    <div class="gf-reward-shipping">
                        <?php
                        gf_renderer()
                            ->render('site.components.icon', [
								'name' => 'location',
								'size' => 'sm'
							]);
						?>
                        <div class="gf-reward-shipping-text-container">
                            <span class="gf-reward-shipping-label"><?php esc_html_e('Ships to', 'growfund'); ?></span>
                            <span class="gf-reward-shipping-text"><?php echo esc_html($reward->ships_to ?? esc_html__('Worldwide', 'growfund')); ?></span>
                        </div>
                    </div>
                    <div class="gf-reward-backers">
                        <?php
                        gf_renderer()
                            ->render('site.components.icon', [
								'name' => 'users',
								'size' => 'sm'
							]);
						?>
                        <div class="gf-reward-backers-text-container">
                            <span class="gf-reward-backers-label"><?php esc_html_e('Backers', 'growfund'); ?></span>
                            <span class="gf-reward-backers-text"><?php echo esc_html($reward->backers ?? '0'); ?></span>
                        </div>
                    </div>
                </div>

                <?php if ($reward->delivery_date || $reward->quantity_info) : ?>
                    <div class="gf-reward-meta">
                        <?php if ($reward->delivery_date) : ?>
                            <div class="gf-delivery">
                                <?php
                                gf_renderer()
                                    ->render('site.components.icon', [
										'name' => 'shipping',
										'size' => 'sm'
									]);
								?>
                                <div class="gf-reward-delivery-text-container">
                                    <span class="gf-reward-delivery-label"><?php esc_html_e('Estimated Delivery:', 'growfund'); ?></span>
                                    <span class="gf-reward-delivery-text"><?php echo esc_html($reward->delivery_date); ?></span>
                                </div>
                            </div>
                        <?php endif; ?>
                        <?php if ($reward->quantity_info) : ?>
                            <div class="gf-quantity">
                                <?php
                                gf_renderer()
                                    ->render('site.components.icon', [
										'name' => 'shopping',
										'size' => 'sm'
									]);
								?>
                                <div class="gf-reward-quantity-text-container">
                                    <span class="gf-reward-quantity-label"><?php esc_html_e('Limited Quantity:', 'growfund'); ?></span>
                                    <span class="gf-reward-quantity-text"><?php echo esc_html($reward->quantity_info); ?></span>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <!-- Items section -->
                <div class="gf-reward-items">
                    <?php $items = $reward->items ?? []; ?>
                    <?php if (!empty($items)) : ?>
                        <p class="gf-reward-items-label">
                            <?php
                            /* translators: %d: Number of items */
                            printf(esc_html(_n('%d item included', '%d items included', count($items), 'growfund')), esc_html(count($items)));
                            ?>
                        </p>
                        <ul class="gf-reward-items-list">
                            <?php foreach ($items as $item) : ?>
                                <li class="gf-reward-item">
                                    <div class="gf-reward-item-image">
                                        <?php
                                        gf_renderer()
                                            ->render('site.components.image', [
                                                'src' => !empty($item->image_src) ? $item->image_src : $placeholder_url,
                                                'alt' => $item->image_alt ?? $item->name
                                            ]);
										?>
                                    </div>
                                    <div class="gf-reward-item-content">
                                        <div class="gf-reward-item-name"><?php echo esc_html($item->name); ?></div>
                                        <?php if (isset($item->quantity)) : ?>
                                            <span class="gf-qty">
                                                <?php
                                                /* translators: %s: Quantity */
                                                printf(esc_html__('Quantity: %s', 'growfund'), esc_html($item->quantity));
                                                ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php else : ?>
                        <p class="gf-reward-items-label"><?php esc_html_e('0 items included', 'growfund'); ?></p>
                    <?php endif; ?>
                </div>

                <div class="gf-reward-button-container">
                    <?php
					if (!$is_closed) {
						gf_renderer()
						->render('site.components.button', [
							/* translators: %s: Reward price */
							'text' => sprintf(esc_html__('Pledge %s', 'growfund'), gf_to_currency($reward->price ?? 0)),
							'class' => 'gf-btn--reward',
							'href' => $checkout_url
						]);
                    }
					?>
                </div>
            </div>
        <?php endif; ?>
    </div>

	<?php
}
?>