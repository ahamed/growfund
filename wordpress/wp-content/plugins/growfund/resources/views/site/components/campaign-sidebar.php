<?php

/**
 * Campaign Sidebar Component
 * Displays campaign statistics, countdown, action buttons and creator information
 * 
 * @param object $campaign - Campaign data object
 * @param array $actions - Optional custom action buttons configuration
 */

use Growfund\Supports\GoalDisplay;
use Growfund\Supports\Utils;

$campaign = $campaign ?? null;

if (!$campaign) {
    return;
}


$fund_raised = is_numeric($campaign->fund_raised) ? (float) $campaign->fund_raised : 0.0;
$goal_amount = is_numeric($campaign->goal_amount) ? (float) $campaign->goal_amount : 0.0;
$progress = GoalDisplay::calculate_progress(
    $campaign->goal_type ?? null,
    $goal_amount,
    $fund_raised,
    $campaign->number_of_contributors ?? 0,
    $campaign->number_of_contributions ?? 0
);

$has_goal = $campaign->has_goal ?? false;
?>

<div class="gf-card gf-project__sidebar">
    <div class="gf-stats-card">
        <div class="gf-stats-card__amount"><?php echo esc_html(gf_to_currency($fund_raised)); ?> <?php esc_html_e('raised', 'growfund'); ?></div>
        <?php if ($has_goal) : ?>
        <div class="gf-progress">
            <div class="gf-progress__bar" style="width: <?php echo esc_attr(min(100, $progress)); ?>%"></div>
        </div>
        <?php endif; ?>
        <div class="gf-stats-card__footer">
            <?php
            $contributors_info = GoalDisplay::format_contributors_display(
                $has_goal,
                $campaign->goal_type ?? null,
                $campaign->number_of_contributors ?? null,
                $campaign->number_of_contributions ?? null
            );
            ?>
            <span class="gf-stats-card__backers"><strong><?php echo esc_html(number_format($contributors_info['count'])); ?></strong> <?php echo esc_html($contributors_info['label']); ?></span>
            <span class="gf-stats-card__goal"><?php echo esc_html(GoalDisplay::format_goal($campaign->goal_type ?? null, $goal_amount, gf_app()->is_donation_mode())); ?></span>
        </div>
    </div>

    <!-- Countdown -->
    <?php if (!empty($campaign->end_date)) : ?>
        <?php
        gf_renderer()->render('site.components.countdown', [
			'end_date' => $campaign->end_date,
			'campaign_id' => $campaign->id ?? ''
		]);
        ?>
    <?php endif; ?>

    <div class="gf-action-buttons">
        <?php

        $button_text = gf_app()->is_donation_mode() ? __('Donate now', 'growfund') : __('Back this campaign', 'growfund');

        if (!$campaign->is_closed) :
            if (gf_app()->is_donation_mode()) :
                $checkout_url = $campaign->checkout_url ?? Utils::get_checkout_url($campaign->id);
				?>
                <a href="<?php echo esc_url($checkout_url); ?>" class="gf-btn-link">
                    <?php
                    gf_renderer()
                        ->render('site.components.button', [
                            'text' => $button_text,
                            'class' => 'gf-btn--primary'
                        ]);
					?>
                </a>
				<?php
            else :
                gf_renderer()
                    ->render('site.components.button', [
                        'text' => $button_text,
                        'class' => 'gf-btn--primary',
                        'attributes' => [
                            'data-action' => 'open-pledge-modal'
                        ]
                    ]);
            endif;
        endif;
        ?>
        <?php
        $is_user_logged_in = gf_user()->is_logged_in();
        $is_admin = gf_user()->is_admin();
        $campaign_id = $campaign->id ?? 0;

        if (!empty($campaign_id) && is_numeric($campaign_id) && !$is_admin) :
            if ($is_user_logged_in) :
                $is_bookmarked = $campaign->is_bookmarked ?? false;
                $bookmark_text = $is_bookmarked ? __('Saved', 'growfund') : __('Save for later', 'growfund');
                $bookmark_class = $is_bookmarked ? 'gf-btn--primary' : 'gf-btn--gray';
				?>
                <?php
                gf_renderer()
                    ->render('site.components.button', [
                        'text' => $bookmark_text,
                        'icon' => 'bookmark',
                        'iconPosition' => 'left',
                        'class' => $bookmark_class,
                        'attributes' => [
                            'data-action' => 'gf_bookmark_campaign',
                            'data-campaign-id' => $campaign_id,
                            'data-is-bookmarked' => $is_bookmarked ? 'true' : 'false'
                        ]
                    ]);
				?>
            <?php else : ?>
                <?php
                gf_renderer()
                    ->render('site.components.button', [
                        'text' => __('Save for later', 'growfund'),
                        'icon' => 'bookmark',
                        'iconPosition' => 'left',
                        'class' => 'gf-btn--gray',
                        'href' => gf_login_url(gf_campaign_url())
                    ]);
				?>
            <?php endif; ?>
        <?php endif; ?>
    </div>

    <?php if (gf_app()->is_donation_mode()) : ?>
        <?php if (!empty($campaign->number_of_contributors)) : ?>
            <div class="gf-donation-notice">
                <div class="gf-donation-notice__text">
                    <div class="gf-donation-notice__icon">
                        <?php
                        gf_renderer()
                            ->render('site.components.icon', [
                                'name' => 'trending-up',
                                'size' => 'lg'
                            ]);
						?>
                    </div>
                    <p class="gf-donation-notice__content">
                        <?php if ($campaign->can_show_donations) : ?>
                            <?php echo esc_html(number_format($campaign->number_of_contributors ?? 0)); ?> <?php esc_html_e('people have just made a donation', 'growfund'); ?>
                        <?php else : ?>
                            <?php esc_html_e('People are making donations to this campaign', 'growfund'); ?>
                        <?php endif; ?>
                    </p>
                </div>

                <?php
                if ($campaign->can_show_donations) :
                    gf_renderer()->render('site.components.donation-list', [
                        'donations' => $campaign->campaign_donations ?? [],
                        'show_navigation' => true,
                        'max_items' => 5,
                        'campaign_id' => $campaign->id ?? 0
                    ]);
                endif;
                ?>

                <?php if (!empty($campaign->campaign_donations) && !empty($campaign->campaign_donations_count) && $campaign->can_show_donations) : ?>
                    <?php
                    gf_renderer()->render('site.components.donation-modal', [
						'campaign_id' => $campaign->id ?? 0,
						'total_donations' => $campaign->campaign_donations_count ?? 0,
						'campaign' => $campaign
					]);
                    ?>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    <?php else : ?>
        <div class="gf-notice">
            <p class="gf-notice__text"><strong><?php esc_html_e('All or nothing.', 'growfund'); ?></strong> <?php esc_html_e('This campaign will only be funded if it reaches its goal by', 'growfund'); ?> <span data-gf-datetime="<?php echo esc_attr($campaign->end_date ?? ''); ?>"><?php echo esc_html($campaign->end_date ?? ''); ?></span>.</p>
        </div>
    <?php endif; ?>

    <div class="gf-creator-card__location">
        <div class="gf-location-icon">
            <?php
            gf_renderer()
                ->render('site.components.icon', [
                    'name' => 'location',
                    'size' => 'sm'
                ]);
			?>
        </div>
        <span>
            <?php echo $campaign->location ? esc_html(gf_pretty_location($campaign->location ?? '')) : esc_html__('Location not specified', 'growfund'); ?>
        </span>
    </div>

    <?php if (!empty($campaign->author)) : ?>
        <div class="gf-creator-card">
            <?php if (!empty($campaign->collaborators)) : ?>
                <div class="gf-creator-card-summary">
                    <div class="gf-creator-card-summary-avatars">
                        <?php
                        $collaborators = array_merge([$campaign->author], $campaign->collaborators);
                        foreach ($collaborators as $index => $collaborator) {
                            if ($index > 2) {
                                break;
                            }

                            $author_image = $collaborator->image ?? '';
                            gf_renderer()
                                ->render('site.components.image', [
                                    'src' => !empty($author_image) ? $author_image : gf_user_avatar(),
                                    'alt' => $collaborator->name ?? '',
                                ]);
                        }
                        ?>
                    </div>

                    <div class="gf-creator-card-summary-info">
                        <div class="gf-creator-card-summary-info-text"><?php echo esc_html($campaign->author->name); ?>
                            <?php if (count($campaign->collaborators) > 1) : ?>
                                <?php
                                printf(
                                    /* translators: 1: collaborator name, 2: number of extra collaborators */
                                    esc_html__(', %1$s & +%2$d more', 'growfund'),
                                    esc_html($campaign->collaborators[0]->name ?? ''),
                                    esc_html(count($campaign->collaborators) - 1)
                                );
                                ?>
                            <?php else : ?>
                                <?php
                                printf(
                                    '& %s',
                                    esc_html($campaign->collaborators[0]->name ?? '')
                                );
                                ?>
                            <?php endif; ?>
                        </div>
                        <button class="gf-contributors-toggle-button gf-contributors-toggle-button-down"><?php echo esc_html__('Show All Creators', 'growfund'); ?></button>
                    </div>
                </div>
            <?php endif; ?>

            <div class="gf-creator-card__content <?php echo esc_attr(!empty($campaign->collaborators) ? 'hidden' : ''); ?>">
                <!--Author Item start -->
                <div class="gf-creator-card__profile">
                    <div class="gf-creator-card__avatar--sm">
                        <?php
                        $author_image = $campaign->author->image ?? '';
                        $image_src = !empty($author_image) ? $author_image : gf_user_avatar();
                        gf_renderer()
                            ->render('site.components.image', [
                                'src' => $image_src,
                                'alt' => $campaign->author->name ?? '',
                            ]);
						?>
                    </div>
                    <div class="gf-creator-card__info">
                        <div class="gf-creator-card__name"> <?php echo !empty($campaign->author->name) ? esc_html($campaign->author->name) : esc_html__('Anonymous', 'growfund'); ?></div>
                        <div class="gf-creator-card__stats">
                            <?php
                            printf(
                                /* translators: 1: number of campaigns, 2: created, 3: number of pledges, 4: donated or backed */
                                '%1$s %2$s • %3$s %4$s',
                                esc_html($campaign->author->campaign_count ?? '0'),
                                esc_html__('created', 'growfund'),
                                esc_html($collaborator->pledge_count ?? '0'),
                                esc_html(gf_app()->is_donation_mode() ? __('donated', 'growfund') : __('backed', 'growfund'))
                            );
                            ?>
                        </div>

                    </div>
                </div>
                <!--Author Item end -->

                <?php
                if (!empty($campaign->collaborators)) :
                    foreach ($campaign->collaborators as $collaborator) :
						?>
                        <!--Collaborator Item start -->
                        <div class="gf-creator-card__profile">
                            <div class="gf-creator-card__avatar--sm">
                                <?php
                                $author_image = $collaborator->image ?? '';
                                $image_src = !empty($author_image) ? $author_image : gf_user_avatar();
                                gf_renderer()
                                    ->render('site.components.image', [
                                        'src' => $image_src,
                                        'alt' => $collaborator->name ?? '',
                                    ]);
								?>
                            </div>
                            <div class="gf-creator-card__info">
                                <div class="gf-creator-card__name"> <?php echo !empty($collaborator->name) ? esc_html($collaborator->name) : esc_html__('Anonymous', 'growfund'); ?></div>
                                <div class="gf-creator-card__stats"><?php echo esc_html($collaborator->campaign_count ?? '0'); ?> <?php esc_html_e('created', 'growfund'); ?> • <?php echo esc_html($collaborator->pledge_count ?? '0'); ?> <?php esc_html_e('backed', 'growfund'); ?></div>
                            </div>
                        </div>
                        <!--Collaborator Item end -->
                    <?php endforeach; ?>
                    <button class="gf-contributors-toggle-button gf-contributors-toggle-button-up"><?php echo esc_html__('Show Less', 'growfund'); ?></button>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>
</div>