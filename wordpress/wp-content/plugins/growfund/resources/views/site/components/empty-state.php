<?php

/**
 * Empty State Component
 * For use when no reward is selected in checkout
 */
?>
<div class="gf-empty-state">
    <?php
    gf_renderer()->render('site.components.icon', [
		'name' => 'pledge-without-reward',
		'size' => 80,
		'attributes' => ['class' => 'gf-empty-icon']
	]);
    ?>
    <div class="gf-empty-content">
        <div class="gf-empty-title">You are Pledging Without a Reward</div>
        <div class="gf-empty-message">Thank you for your support!</div>
        <a href="<?php echo esc_url(home_url('/campaigns/' . $campaign_slug . '/#rewards')); ?>" class="gf-empty-action">Choose a Reward</a>
    </div>
</div>