<?php

/**
 * Reusable Tabs Component
 * 
 * @param array $tabs - Array of tab data: ['label' => 'Tab Label', 'active' => bool, 'badge' => 'Badge Text']
 * @param array $actions - Array of action buttons: ['label' => 'Button Label', 'variant' => 'primary|outline|secondary']
 * @param bool $is_closed - Whether the campaign is closed
 */


$tabs = $tabs ?? []; // phpcs:ignore -- intentionally used

if (empty($tabs)) {
    return;
}

?>


<div class="gf-tabs<?php echo esc_html(gf_app()->is_donation_mode() ? ' gf-tabs--donation-mode' : ''); ?>" <?php echo esc_html(gf_app()->is_donation_mode() ? ' data-mode="donation"' : ''); ?>>
    <div class="gf-tabs__nav-wrapper">
        <div class="gf-tabs__scroll-btn-wrapper gf-tabs__scroll-btn-wrapper--left">
            <?php
            try {
                gf_renderer()->render('site.components.button', [
                    'variant' => 'icon-only',
                    'icon' => 'arrow-left',
                    'ariaLabel' => esc_html__('Scroll tabs left', 'growfund'),
                    'class' => 'gf-tabs__scroll-btn gf-tabs__scroll-btn--left'
                ]);
            } catch (Exception $error) {
                echo '<button class="gf-tabs__scroll-btn gf-tabs__scroll-btn--left" aria-label="' . esc_attr__('Scroll tabs left', 'growfund') . '">←</button>';
            }
            ?>
        </div>

        <div class="gf-tabs__nav" id="gf-tabs-nav">
            <?php // phpcs:ignore ?>
            <?php foreach ($tabs as $tab) : ?>
                <?php
                $tabClasses = ['gf-tabs__btn'];
                if ($tab['active'] ?? false) {
                    $tabClasses[] = 'gf-tabs__btn--active';
                }
                $tabClassString = implode(' ', $tabClasses);
                $tabName = strtolower($tab['label']);
                ?>
                <button class="<?php echo esc_attr($tabClassString); ?>" data-tab="<?php echo esc_attr($tabName); ?>">
                    <?php echo esc_html($tab['label']); ?>
                    <?php if (isset($tab['badge'])) : ?>
                        <?php
                        $badgeClass = '';
                        if ($tab['active'] ?? false) {
                            $badgeClass = 'gf-badge--active';
                        }
                        ?>
                        <?php
                        gf_renderer()->render('site.components.badge', [
                            'text' => $tab['badge'],
                            'class' => $badgeClass
                        ]);

                        ?>
                    <?php endif; ?>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="gf-tabs__scroll-btn-wrapper gf-tabs__scroll-btn-wrapper--right">
            <?php
            gf_renderer()
                ->render('site.components.button', [
                    'variant' => 'icon-only',
                    'icon' => 'arrow-right-black',
                    'ariaLabel' => __('Scroll tabs right', 'growfund'),
                    'class' => 'gf-tabs__scroll-btn gf-tabs__scroll-btn--right'
                ]);
            ?>
        </div>
    </div>

    <?php
    // Only show action buttons if not in donation mode
    if (!gf_app()->is_donation_mode()) :
        $actions = $actions ?? [
            [
				'label' => __('Back this campaign', 'growfund'),
				'variant' => 'gf-btn--primary'
			]
        ];

        if (!empty($actions)) :
			?>
            <div class="gf-tabs__actions">
                <?php foreach ($actions as $action) : // phpcs:ignore ?>
                    <div class="gf-tabs__button-wrapper-<?php echo esc_attr($action['variant'] === 'gf-btn--primary' ? 'primary' : 'gray'); ?>">
                        <?php
                        $button_attributes = [];

                        if (($action['variant'] === 'gf-btn--primary' || $action['variant'] === 'gf-btn--primary') &&
                            (strpos(strtolower($action['label']), 'back this campaign') !== false ||
                                strpos(strtolower($action['label']), 'donate now') === false)
                        ) {
                            $button_attributes['data-action'] = 'open-pledge-modal';
                        }

                        if (isset($action['attributes']) && is_array($action['attributes'])) {
                            $button_attributes = array_merge($button_attributes, $action['attributes']);
                        }

                        gf_renderer()
                            ->render('site.components.button', [
                                'text' => $action['label'],
                                'class' => $action['variant'],
                                'icon' => $action['icon'] ?? null,
                                'iconPosition' => $action['iconPosition'] ?? 'left',
                                'attributes' => $button_attributes
                            ]);
                        ?>
                    </div>
                <?php endforeach; ?>
            </div>
			<?php
        endif;
    endif;
    ?>
</div>