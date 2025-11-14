<?php

/**
 * Update Detail View Component
 * 
 * Expected data format:
 * @param CampaignUpdateDetailsDTO $data Update data DTO with the following structure:
 *   - id: string
 *   - post_id: int
 *   - update_badge: string (default: 'UPDATE')
 *   - update_date: string
 *   - update_title: string
 *   - update_image: string
 *   - update_image_alt: string
 *   - update_content_preview: string
 *   - update_content_full: string
 *   - update_creator: array (name, avatar)
 *   - update_stats: array (comments, likes)
 *   - comments: array
 *   - comment_data: array (prepared comment form and settings)
 */

use Growfund\Constants\Site\SocialSharing;

// Ensure we have valid data
if (!isset($data) || !is_object($data)) {
    $data = (object) [];
}
?>

<div class="gf-tab-content__body gf-update-detail-view" id="update-detail-view-<?php echo esc_attr($data->update_id ?? $data->id ?? ''); ?>" style="display: none;">
    <div class="gf-update-detail">
        <div class="gf-update-detail__header">
            <div class="gf-back-to-list-wrapper">
                <?php
                gf_renderer()
                    ->render('site.components.button', [
                        'text' => esc_html__('All updates', 'growfund'),
                        'icon' => 'arrow-left',
                        'iconPosition' => 'left',
                        'class' => 'gf-btn--gray back-to-updates'
                    ]);
				?>
            </div>
        </div>

        <div class="gf-update-detail__title">
            <h1 class="gf-update-detail__title-text"><?php echo esc_html($data->update_title ?? $data->title); ?></h1>
        </div>

        <div class="gf-update-detail__meta">
            <div class="gf-update-detail__creator">
                <div class="gf-update-detail__creator-avatar-wrapper">
                    <?php
                    gf_renderer()
                        ->render('site.components.image', [
                            'src' => $data->update_creator['avatar'] ?? $data->author->image ?? '',
                            'alt' => $data->update_creator['name'] ?? $data->author->name ?? '',
                            'attributes' => ['class' => 'gf-update-detail__creator-avatar']
                        ]);
					?>
                </div>
                <div class="gf-update-detail__creator-name-wrapper">
                    <div class="gf-update-detail__creator-info">
                        <span class="gf-update-detail__creator-name"><?php echo esc_html($data->update_creator['name'] ?? $data->author->name ?? ''); ?></span>
                    </div>
                    <span class="gf-update-detail__date" data-gf-datetime="<?php echo esc_attr($data->update_date ?? ''); ?>"><?php echo esc_html($data->update_date ?? ''); ?></span>
                </div>
            </div>

            <?php
            // Prepare sharing data
            $social_shares = $social_sharing_options;
            $share_url = get_permalink($data->post_id ?? get_the_ID());
            $share_title = $data->update_title ?? $data->title ?? '';
            /* translators: %s: update title */
            $share_text = sprintf(__('Check out this update: %s', 'growfund'), $share_title);

            if (!empty($social_shares)) {
                gf_renderer()
                    ->render('site.components.social-share', [
                        'social_shares' => $social_shares,
                        'share_url' => esc_url($share_url),
                        'share_title' => $share_title,
                        'share_text' => $share_text
                    ]);
            }
            ?>
        </div>

        <div class="gf-update-detail__content">
            <?php if (!empty($data->thumbnail)) : ?>
                <div class="gf-update-detail__image">
                    <?php
                    gf_renderer()
                        ->render('site.components.image', [
                            'src' => $data->thumbnail,
                            'alt' => $data->title ?? 'Update image'
                        ]);
					?>
                </div>
            <?php endif; ?>

            <div class="gf-update-detail__text">
                <p><?php echo wp_kses_post($data->update_content_full ?? $data->story ?? ''); ?></p>
            </div>
        </div>
    </div>

    <!-- Comments Section - Show if comments exist or if comment form is enabled -->
    <?php if (!empty($data->comments) || (isset($data->comment_form_data) && $data->comment_form_data !== null && !empty($data->comment_form_data))) : ?>
        <div class="gf-update-detail__comments">
            <div class="gf-update-detail__comments-header">
                <h3 class="gf-update-detail__comments-title"><?php esc_html_e('Comments', 'growfund'); ?></h3>
            </div>

            <div class="gf-update-detail__comments-content">
                <?php
                $commentFormData = $data->comment_form_data ?? null;
                $post_id = $data->post_id ?? get_the_ID(); // phpcs:ignore -- intentionally used
                $commentFormHtml = '';

                if ($commentFormData && !empty($commentFormData->comment_form_html)) {
                    $commentFormHtml = $commentFormData->comment_form_html;
                }

                // Use pre-prepared comments data from controller
                $commentsData = $data->comments ?? [];

                try {
                    gf_renderer()
                        ->render('site.components.comment', [
                            'showMainWrapper' => true,
                            'commentsList' => $commentsData,
                            'comment_type' => 'update_comment',
                            'post_id' => $post_id,
                            'commentFormHtml' => $commentFormHtml
                        ]);
                } catch (Exception $error) {
                    gf_renderer()->render('site.components.comments-fallback', [
                        'state' => 'unavailable'
                    ]);
                }
                ?>
            </div>
        </div>
    <?php endif; ?>
</div>