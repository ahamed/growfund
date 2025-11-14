<?php

/**
 * Reset Password Template
 * 
 * @var string $error
 * @var string $success
 * @var string $key
 * @var string $login
 */

// Load WordPress header to include CSS and JS
gf_get_header();


$password_reset_fields = [
    [
        'type' => 'input',
        'name' => 'password',
        'label' => __('New Password', 'growfund'),
        'data' => [
            'name' => 'password',
            'type' => 'password',
            'placeholder' => __('Enter your new password', 'growfund'),
            'required' => true,
            'value' => '',
            'autocomplete' => 'new-password',
            'spellcheck' => 'false'
        ]
    ],
    [
        'type' => 'input',
        'name' => 'password_confirmation',
        'label' => __('Confirm New Password', 'growfund'),
        'data' => [
            'name' => 'password_confirmation',
            'type' => 'password',
            'placeholder' => __('Confirm your new password', 'growfund'),
            'required' => true,
            'value' => '',
            'autocomplete' => 'new-password',
            'spellcheck' => 'false'
        ]
    ],
    [
        'type' => 'input',
        'data' => [
            'type' => 'hidden',
            'name' => 'key',
            'value' => ''
        ]
    ],
    [
        'type' => 'input',
        'data' => [
            'type' => 'hidden',
            'name' => 'login',
            'value' => ''
        ]
    ]
];
?>

<div class="gf-reset-password-container gf-page-container">
    <div class="gf-reset-password-card">
        <div class="gf-reset-password-header">
            <?php
            gf_renderer()->render('site.components.image', [
				'src' => gf_site_image_url('logo.svg'),
				'alt' => 'Growfund',
				'attributes' => [
					'class' => 'gf-reset-password-logo'
				]
			]);
            ?>
            <h1 class="gf-reset-password-title"><?php esc_html_e('Reset Password', 'growfund'); ?></h1>
            <p class="gf-reset-password-subtitle"><?php esc_html_e('Enter your new password below.', 'growfund'); ?></p>
        </div>

        <?php if (!empty($error)) : ?>
            <div class="gf-alert gf-alert--error">
                <p><?php echo esc_html(urldecode($error)); ?></p>
            </div>
			<?php
        endif;
        if (!empty($success)) :
			?>
            <div class="gf-alert gf-alert--success">
                <p><?php echo esc_html($success); ?></p>
            </div>
        <?php endif; ?>

        <?php if (isset($show_form) && $show_form === false) : ?>
            <!-- Form is hidden due to invalid link -->
        <?php else : ?>
            <?php

            gf_renderer()->render('site.components.form-builder', [
                'fields' => $password_reset_fields,
                'form_attributes' => [
                    'method' => 'POST',
                    'action' => '',
                    'class' => 'gf-reset-password-form'
                ],
                'submit_button_text' => __('Reset Password', 'growfund'),
                'submit_button_attributes' => [
                    'class' => 'gf-reset-password-btn gf-reset-password-btn--primary gf-reset-password-btn--full'
                ]
            ]);
            ?>
        <?php endif; ?>

        <div class="gf-reset-password-footer">
            <p class="gf-reset-password-links">
                <?php esc_html_e('Remember your password?', 'growfund'); ?>
                <a href="<?php echo esc_url(gf_login_url()); ?>" class="gf-reset-password-link gf-reset-password-link--bold">
                    <?php esc_html_e('Log in', 'growfund'); ?>
                </a>
            </p>
        </div>
    </div>
</div>

<?php gf_get_footer(); ?>