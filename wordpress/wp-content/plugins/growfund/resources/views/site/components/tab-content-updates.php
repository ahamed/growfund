<?php

/**
 * Updates Tab Content Component
 */

$updates = $updates ?? [];
$campaign = $campaign ?? null;
$campaignId = $campaign_id ?? null;

// Get timeline dates from controller - already formatted
$timelineDates = $campaign->timeline_dates ?? null;
$startDateFormatted = $timelineDates->start_date_formatted ?? date('M j'); // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
$endDateFormatted = $timelineDates->end_date_formatted ?? date('M j'); // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
$launchDateFormatted = $timelineDates->launch_date_formatted ?? date('F j, Y'); // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date

// Get total updates count from pre-prepared data
$totalUpdatesCount = 0;
if (is_object($campaign) && isset($campaign->total_campaign_updates_count)) {
    $totalUpdatesCount = $campaign->total_campaign_updates_count;
}
?>

<div class="gf-tab-content gf-tab-content--updates" data-tab="updates" <?php echo $campaignId ? 'data-campaign-id="' . esc_attr($campaignId) . '"' : ''; ?> <?php echo $totalUpdatesCount > 0 ? 'data-total-updates-count="' . esc_attr($totalUpdatesCount) . '"' : ''; ?>>
    <div class="gf-tab-content__container">

        <!-- Updates List View -->
        <div class="gf-tab-content__body gf-updates-list-view" id="updates-list-view">
            <?php if (!empty($updates)) : ?>
                <div class="gf-updates-wrapper">
                    <div class="gf-updates-wrapper__top">
                        <div class="gf-updates-timeline">
                            <div class="gf-timeline-start">
                                <span class="gf-timeline-date-label"><?php echo esc_html($startDateFormatted); ?></span>
                            </div>

                            <div class="gf-timeline-line-container">
                                <div class="gf-timeline-line-background"></div>
                                <div class="gf-timeline-line-progress"></div>
                                <div class="gf-timeline-dot-current"></div>
                            </div>

                            <div class="gf-timeline-end">
                                <span class="gf-timeline-date-label"><?php echo esc_html($endDateFormatted); ?></span>
                            </div>

                            <div class="gf-timeline-progress-text">
                                <span class="gf-timeline-count">1/<?php echo esc_html($totalUpdatesCount > 0 ? $totalUpdatesCount : 0); ?></span>
                                <span class="gf-timeline-current-date"><?php echo esc_html($startDateFormatted); ?></span>
                            </div>
                        </div>

                        <div class="gf-updates-list" id="gf-updates-list">
                            <?php foreach ($updates as $update) : ?>
                                <?php
                                gf_renderer()
                                    ->render('site.components.update-item', ['data' => $update]);
								?>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div class="gf-updates__project-launch">
                        <div class="gf-updates__project-launch-date">
                            <span class="gf-updates__project-launch-date-text"><?php esc_html_e('Campaign launches', 'growfund'); ?></span>
                            <span class="gf-updates__project-launch-date-time"><?php echo esc_html($launchDateFormatted); ?></span>
                        </div>
                    </div>
                </div>
            <?php else : ?>
                <div class="gf-no-updates">
                    <p><?php esc_html_e('No updates available yet.', 'growfund'); ?></p>
                </div>
            <?php endif; ?>
        </div>

        <!-- Update Detail Views -->
        <?php if (!empty($updates)) : ?>
            <?php foreach ($updates as $singleUpdateDTO) : ?>
                <?php
                gf_renderer()
                    ->render('site.components.update-detail-view', [
                        'data' => $singleUpdateDTO,
                        'social_sharing_options' => gf_social_sharing_options()
                    ]);
				?>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>