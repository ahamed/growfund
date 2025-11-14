<?php

/**
 * Payment Method Selector Component
 * @param array $methods - [['value' => 'stripe', 'label' => 'Stripe', 'icon' => 'stripe'], ...]
 * @param string $selected - currently selected value
 * @param string $name - input name
 */
$methods = $methods ?? [];
$selected = $selected ?? '';
$name = $name ?? 'payment_method';
?>

<div class="gf-payment-method-selector">
    <?php if (!empty($methods)) : ?>
        <div class="gf-payment-method-list">
            <?php foreach ($methods as $method) : ?>
                <?php
                $method_value = $method['value'] ?? '';
                $method_label = $method['label'] ?? '';
                $icon = $method['icon'];
                $is_selected = $selected === $method_value;
                ?>
                <label class="gf-payment-method-option <?php echo $is_selected ? 'selected' : ''; ?>">
                    <input type="radio"
                        name="<?php echo esc_attr($name); ?>"
                        value="<?php echo esc_attr($method_value); ?>"
                        <?php checked($selected, $method_value); ?>
                        class="gf-payment-method-radio" />
                    <div class="gf-payment-method-content">
                        <div class="gf-payment-method-icon">
                            <?php if (!empty($icon)) : ?>
                                <img src="<?php echo esc_attr($icon['url'] ?? $icon); ?>" alt="<?php echo esc_attr(__('Payment method icon', 'growfund')); ?>" />
                            <?php endif; ?>
                        </div>
                        <span class="gf-payment-method-label"><?php echo esc_html($method_label); ?></span>
                    </div>
                </label>
            <?php endforeach; ?>
        </div>
    <?php else : ?>
        <div class="gf-payment-method-empty-card">
            <div class="gf-payment-method-empty-icon">
                <img src="<?php echo esc_url(gf_site_assets_url('images/no-payment-methods.svg')); ?>" />
            </div>

            <div class="gf-payment-method-empty-content">
                <div class="gf-payment-method-empty-title"><?php echo esc_html__('No payment methods available at this time.', 'growfund'); ?></div>
                <div class="gf-payment-method-empty-subtitle"><?php echo esc_html__('Please check back later or contact support for assistance.', 'growfund'); ?></div>
            </div>
        </div>
    <?php endif; ?>
</div>