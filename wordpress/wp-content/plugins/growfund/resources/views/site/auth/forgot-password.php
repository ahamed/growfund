<?php

/**
 * Forgot Password Template
 * 
 * @var string $error
 * @var string $success
 * @var string $submitted_email
 */

// Load WordPress header to include CSS and JS
gf_get_header();

$forget_password_fields = [
    [
        'type' => 'input',
        'name' => 'email',
        'label' => esc_html__('Email Address', 'growfund'),
        'data' => [
            'name' => 'email',
            'type' => 'email',
            'placeholder' => esc_html__('Enter your email', 'growfund'),
            'required' => true,
            'value' => '',
            'autocomplete' => 'email'
        ]
    ]
];
?>

<div class="gf-forgot-password-container gf-page-container">
    <div class="gf-forgot-password-card">
        <div class="gf-forgot-password-header">
            <?php
            gf_renderer()->render('site.components.image', [
				'src' => gf_site_image_url('logo.svg'),
				'alt' => 'Growfund',
				'attributes' => [
					'class' => 'gf-forgot-password-logo'
				]
			]);
            ?>

            <?php if (!empty($error)) : ?>
                <div class="gf-alert gf-alert--error">
                    <p><?php echo esc_html($error); ?></p>
                </div>
            <?php endif; ?>

            <?php if (!empty($submitted_email)) : ?>
                <p class="gf-forgot-password-subtitle">
                    <?php
                    printf(
                        /* translators: %s: email address */
                        esc_html__('We\'ve sent a password reset link to %s if you have an existing account. Check your email and click the link to reset your password.', 'growfund'),
                        '<strong>' . esc_html($submitted_email) . '</strong>'
                    );
                    ?>
                </p>
            <?php else : ?>
                <p class="gf-forgot-password-subtitle"><?php esc_html_e('No worries! Enter your email address and we\'ll send you a link to reset your password.', 'growfund'); ?></p>
            <?php endif; ?>
        </div>



        <?php if (empty($submitted_email)) : ?>
            <?php

            gf_renderer()->render('site.components.form-builder', [
                'fields' => $forget_password_fields,
                'form_attributes' => [
                    'method' => 'POST',
                    'action' => '',
                    'class' => 'gf-forgot-password-form'
                ],
                'submit_button_text' => esc_html__('Send Reset Link', 'growfund'),
                'submit_button_attributes' => [
                    'class' => 'gf-forgot-password-btn gf-forgot-password-btn--primary gf-forgot-password-btn--full'
                ]
            ]);
            ?>
        <?php endif; ?>

        <div class="gf-forgot-password-footer">
            <?php if (!empty($submitted_email)) : ?>
                <p class="gf-forgot-password-links">
                    <?php esc_html_e('Don\'t get a link?', 'growfund'); ?>
                    <a href="<?php echo esc_url(gf_forget_password_url()); ?>" class="gf-forgot-password-link gf-forgot-password-link--bold">
                        <?php esc_html_e('Send Again', 'growfund'); ?>
                    </a>
                </p>
            <?php else : ?>
                <p class="gf-forgot-password-links">
                    <?php esc_html_e('Remember your password?', 'growfund'); ?>
                    <a href="<?php echo esc_url(gf_login_url()); ?>" class="gf-forgot-password-link gf-forgot-password-link--bold">
                        <?php esc_html_e('Log in', 'growfund'); ?>
                    </a>
                </p>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php gf_get_footer(); ?>