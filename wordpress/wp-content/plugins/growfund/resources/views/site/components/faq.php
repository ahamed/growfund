<?php

/**
 * FAQ Component
 * Reusable FAQ accordion component with smooth animations and accessibility
 */

// Get FAQ items from campaign data
$faq_items = $faqs ?? [];

// Generate unique IDs for accessibility
$unique_id = uniqid('faq_');
?>

<div class="gf-faq-content" data-component="faq-accordion">
    <?php if (!empty($faq_items)) : ?>
        <div class="gf-faq-list" role="region" aria-label="<?php echo esc_attr__('Frequently Asked Questions', 'growfund'); ?>">
            <?php
            foreach ($faq_items as $index => $item) :
                $question_id = $unique_id . '_question_' . $index;
                $panel_id = $unique_id . '_panel_' . $index;
				?>
                <div class="gf-faq-item <?php echo !empty($item['active']) ? 'active' : ''; ?>" data-faq-item>
                    <h3 class="gf-faq-question-wrapper">
                        <button
                            class="gf-faq-question"
                            type="button"
                            aria-expanded="<?php echo !empty($item['active']) ? 'true' : 'false'; ?>"
                            aria-controls="<?php echo esc_attr($panel_id); ?>"
                            id="<?php echo esc_attr($question_id); ?>"
                            data-faq-trigger>
                            <span class="gf-faq-icon" aria-hidden="true">
                                <span class="gf-faq-icon-line gf-faq-icon-line--horizontal"></span>
                                <span class="gf-faq-icon-line gf-faq-icon-line--vertical"></span>
                            </span>
                            <span class="gf-faq-question-text"><?php echo esc_html($item['question']); ?></span>
                        </button>
                    </h3>
                    <div
                        class="gf-faq-answer-wrapper"
                        id="<?php echo esc_attr($panel_id); ?>"
                        role="region"
                        aria-labelledby="<?php echo esc_attr($question_id); ?>"
                        data-faq-panel>
                        <div class="gf-faq-answer-content">
                            <p><?php echo esc_html($item['answer']); ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else : ?>
        <div class="gf-faq-empty">
            <p class="gf-faq-empty-message"><?php esc_html_e('No frequently asked questions available for this campaign.', 'growfund'); ?></p>
        </div>
    <?php endif; ?>
</div>