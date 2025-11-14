<?php

/**
 * Campaign Tab Content Component
 */

$campaign = $campaign ?? null;

// Determine the tab name based on donation mode
$tabName = gf_app()->is_donation_mode() ? 'info' : 'campaign';

?>

<div class="gf-tab-content gf-tab-content--campaign" data-tab="<?php echo esc_attr($tabName); ?>">
    <div class="gf-tab-content__container">
        <div class="gf-tab-content__body">
            <div class="gf-campaign">
                <div class="gf-campaign__container">
                    <div class="gf-campaign__main">
                        <div class="gf-content-section">
                            <h3 class="gf-content-section__title"><?php echo __('Story', 'growfund'); ?></h3>

                            <?php if ($campaign && !empty($campaign->story)) : ?>
                                <div class="gf-rich-text-content">
                                    <?php echo wp_kses_post($campaign->story); ?>
                                </div>
                            <?php else : ?>
                                <p><?php esc_html_e('No story content available for this campaign.', 'growfund'); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>

                    <?php if (!gf_app()->is_donation_mode()) : ?>
                        <div class="gf-campaign__sidebar">
                            <?php
                            gf_renderer()
                                ->render('site.components.support-section', [
                                    'campaign' => $campaign,
                                    'is_donation_mode' => gf_app()->is_donation_mode()
                                ]);
							?>

                            <?php
                            // Use pre-prepared rewards data from controller
                            $rewards = $campaign->rewards ?? [];

                            // Only show the first three rewards
                            $displayRewards = array_slice($rewards, 0, 3);

                            // Render rewards if available
                            if (!empty($displayRewards)) {
                                gf_renderer()
                                    ->render('site.components.campaign-reward', [
										'rewards' => $displayRewards,
										'is_closed' => $campaign->is_closed ?? ''
									]);
                            }
                            ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>