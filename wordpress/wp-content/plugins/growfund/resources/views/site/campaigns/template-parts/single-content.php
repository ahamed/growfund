<?php if ($data) : ?>
    <div class="gf-container">
        <?php
        if (gf_app()->is_donation_mode() && !empty($data->contribution)) {
            gf_renderer()->render(
                'site.components.donation-success-modal',
                [
                    'contribution' => $data->contribution
                ]
            );
        } elseif (!gf_app()->is_donation_mode() && !empty($data->contribution)) {
            gf_renderer()->render(
                'site.components.pledge-success-modal',
                [
                    'contribution' => $data->contribution
                ]
            );
        } elseif (isset($_GET['failed'])) { // phpcs:ignore
            gf_renderer()->render('site.components.contribution-failed-modal');
        }
        ?>
        <div class="gf-project">
            <div class="gf-project__header">
                <div class="gf-project__main">
                    <h1 class="gf-project__title"><?php echo esc_html($data->title ?? ''); ?></h1>
                    <p class="gf-project__description">
                        <?php echo esc_html($data->description ?? ''); ?>
                    </p>

                    <div class="gf-media">
                        <div class="gf-media__container">
                            <?php if (!empty($data->video) && !empty($data->video['url'])) : ?>
                                <?php
                                gf_renderer()
                                    ->render('site.components.video', [
                                        'src' => $data->video['url'],
                                        'poster' => '',
                                        'title' => '',
                                        'attributes' => [
                                            'class' => 'gf-media__video'
                                        ],
                                        'controls' => true,
                                        'muted' => false,
                                        'autoplay' => false
                                    ]);
								?>
                            <?php elseif (!empty($data->images) && is_array($data->images) && !empty($data->images[0]['url'])) : ?>
                                <?php
                                gf_renderer()
                                    ->render('site.components.image', [
                                        'src' => $data->images[0]['url'],
                                        'alt' => esc_attr($data->title ?? 'Campaign Image'),
                                        'attributes' => [
                                            'class' => 'gf-media__image'
                                        ]
                                    ]);
								?>
                            <?php else : ?>
                                <?php
                                gf_renderer()
                                    ->render('site.components.image', [
                                        'src' => gf_site_placeholder_image_url(false),
                                        'alt' => 'Campaign Placeholder Image',
                                        'attributes' => [
                                            'class' => 'gf-media__image gf-media__placeholder'
                                        ]
                                    ]);
                                ?>

                            <?php endif; ?>
                        </div>
                    </div>

                    <?php if (!empty($data->tags)) : ?>
                        <div class="gf-tags-section">
                            <div class="gf-tags">
                                <div class="gf-tags__icon">
                                    <?php
                                    gf_renderer()
                                        ->render('site.components.icon', [
                                            'name' => 'tags',
                                            'size' => 'sm'
                                        ]);
									?>
                                </div>
                                <span>
                                    <?php
                                    $tagCount = count($data->tags);
                                    foreach ($data->tags as $index => $tag) { // phpcs:ignore
                                        echo esc_html($tag->name);
                                        if ($index < $tagCount - 1) {
                                            echo ', ';
                                        }
                                    }
                                    ?>
                                </span>
                            </div>
                            <div class="gf-tags__button">
                                <?php
                                // Prepare sharing data
                                $social_shares = gf_social_sharing_options();
                                $share_url = gf_campaign_url($data->post_id ?? get_the_ID());
                                $share_title = $data->update_title ?? $data->title ?? '';
                                /* translators: %s: campaign title */
                                $share_text = sprintf(__('Check out this campaign: %s', 'growfund'), $share_title);

                                if (!empty($social_shares)) {
                                    gf_renderer()
                                        ->render('site.components.social-share', [
                                            'social_shares' => $social_shares,
                                            'share_url' => $share_url,
                                            'share_title' => $share_title,
                                            'share_text' => $share_text
                                        ]);
                                }
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <?php
                gf_renderer()
                    ->render('site.components.campaign-sidebar', [
                        'campaign' => $data
                    ]);
				?>
            </div>

            <?php
            $totalUpdatesCount = 0;
            if (is_object($data) && isset($data->total_campaign_updates_count)) {
                $totalUpdatesCount = $data->total_campaign_updates_count;
            }

            $totalCommentsCount = 0;
            if (is_object($data) && isset($data->total_comments_count)) {
                $totalCommentsCount = $data->total_comments_count;
            }
            ?>
            <?php
            $actions = [];
            if (!gf_app()->is_donation_mode() && !$data->is_closed) {
                $actions = [
                    [
						'label' => __('Back this campaign', 'growfund'),
						'variant' => 'gf-btn--primary'
					]
                ];
            }
            ?>
            <?php
            $campaignTabLabel = gf_app()->is_donation_mode() ? 'Info' : 'Campaign';
            $tabs = [ // phpcs:ignore
                [
					'label' => $campaignTabLabel,
					'active' => true
				]
            ];

            if (!gf_app()->is_donation_mode()) {
                array_splice($tabs, 1, 0, [
                    [
						'label' => __('Rewards', 'growfund'),
						'active' => false
					]
                ]);
            }

            if (isset($data->can_see_campaign_updates) && $data->can_see_campaign_updates) {
                $tabs[] = [ // phpcs:ignore
					'label' => __('Updates', 'growfund'),
					'active' => false,
					'badge' => $totalUpdatesCount
				];
            }

            if (!empty($data->comments) || (isset($data->comment_form_data) && $data->comment_form_data !== null && !empty($data->comment_form_data))) {
                $tabs[] = [ // phpcs:ignore
					'label' => __('Comments', 'growfund'),
					'active' => false,
					'badge' => $totalCommentsCount
				];
            }

            $insertPosition = gf_app()->is_donation_mode() ? 1 : 2;
            array_splice($tabs, $insertPosition, 0, [
                [
					'label' => __('FAQ', 'growfund'),
					'active' => false
				]
            ]);
            ?>
            <?php
            gf_renderer()
                ->render('site.components.tabs', [
                    'tabs' => $tabs,
                    'actions' => $actions,
                    'is_closed' => $data->is_closed
                ]);
			?>

            <div class="gf-tab-container">
                <?php
                gf_renderer()
                    ->render('site.components.tab-content-campaign', [
                        'campaign' => $data
                    ]);
				?>
                <?php if (!gf_app()->is_donation_mode()) : ?>
                    <?php
                    gf_renderer()
                        ->render('site.components.tab-content-rewards', [
                            'rewards' => $data->rewards ?? [],
                            'campaign' => $data
                        ]);
					?>
                <?php endif; ?>
                <?php
                gf_renderer()
                    ->render('site.components.tab-content-faq', [
                        'faqs' => $data->faqs ?? []
                    ]);
				?>
                <?php if (isset($data->can_see_campaign_updates) && $data->can_see_campaign_updates) : ?>
                    <?php
                    gf_renderer()
                        ->render('site.components.tab-content-updates', [
                            'updates' => !empty($data->campaign_updates) ? $data->campaign_updates : [],
                            'campaign' => $data,
                            'campaign_id' => $campaign_id
                        ]);
					?>
                <?php endif; ?>
                <?php if (!empty($data->comments) || (isset($data->comment_form_data) && $data->comment_form_data !== null && !empty($data->comment_form_data))) : ?>
                    <?php
                    gf_renderer()
                        ->render('site.components.tab-content-comments', [
                            'comments' => $data->comments ?? [],
                            'comment_form_data' => $data->comment_form_data ?? null,
                            'campaign_id' => $campaign_id
                        ]);
					?>
                <?php endif; ?>

            </div>
        </div>
    </div>

    <?php if (!empty($data->related_campaigns)) : ?>
        <?php
        gf_renderer()
            ->render('site.components.recommendations', [
                'campaigns' => $data->related_campaigns,
                'title' => __('We also recommend', 'growfund'),
                'exploreText' => __('Explore more', 'growfund')
            ]);
		?>
    <?php endif; ?>

    <?php if ($data) : ?>
        <?php
        gf_renderer()
            ->render('site.components.pledge-modal', [
                'campaign' => $data,
                'rewards' => $data->rewards ?? [],
                'min_pledge_amount' => $data->min_pledge_amount ?? 1,
                'max_pledge_amount' => $data->max_pledge_amount ?? null
            ]);
		?>
    <?php endif; ?>

<?php else : ?>
    <div class="gf-container">
        <p><?php esc_html_e('Campaign not found.', 'growfund'); ?></p>
    </div>
<?php endif; ?>