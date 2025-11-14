<?php

/**
 * Renders a list of campaigns.
 *
 * @param array $args {
 *     @type object $campaigns      Paginated campaign data.
 *     @type string $header         The header text for the list.
 *     @type bool   $is_ajax_load   Whether the list is loaded via AJAX.
 * }
 */

$campaigns = $campaigns ?? (object) [
	'results' => [],
	'total' => 0
];
$total_campaigns = $campaigns->total ?? 0;
/* translators: %s: number of campaigns */
$header = $header ?? sprintf(esc_html__('Explore %s projects', 'growfund'), number_format($total_campaigns));
$is_ajax_load = $is_ajax_load ?? false;
?>

<div class="gf-campaign-list">
    <?php if (!$is_ajax_load) : ?>
        <div class="gf-campaign-list__header">
            <h4 class="gf-campaign-list__title"><?php echo esc_html($header); ?></h4>
        </div>
    <?php endif; ?>

    <?php if (!empty($campaigns->results) && is_array($campaigns->results) && count($campaigns->results) > 0) : ?>
        <div class="gf-campaign-list__grid">
            <?php foreach ($campaigns->results as $campaign) : ?>
                <?php
                gf_renderer()
                    ->render('site.components.campaign-card', [
                        'campaign' => $campaign,
                        'variant' => 'list'
                    ]);
                ?>
            <?php endforeach; ?>
        </div>
    <?php elseif (!$is_ajax_load) : ?>
        <div class="gf-no-campaigns">
            <div class="gf-no-campaigns__content">
                <h2><?php esc_html_e('No campaigns found.', 'growfund'); ?></h2>
                <p><?php esc_html_e('Try adjusting your search or filter criteria.', 'growfund'); ?></p>
            </div>
        </div>
    <?php endif; ?>
</div>