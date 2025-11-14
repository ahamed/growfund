<?php

/**
 * FAQ Tab Content Component
 */

$faqs = $faqs ?? [];
?>

<div class="gf-tab-content gf-tab-content--faq" data-tab="faq">
    <div class="gf-tab-content__container">
        <div class="gf-faq-layout">
            <div class="gf-faq-header">
                <h2 class="gf-faq-title"><?php esc_html_e('Frequently', 'growfund'); ?><br><?php esc_html_e('asked questions', 'growfund'); ?></h2>
            </div>

            <?php
            gf_renderer()
                ->render('site.components.faq', [
                    'faqs' => $faqs
                ]);
			?>
        </div>
    </div>
</div>