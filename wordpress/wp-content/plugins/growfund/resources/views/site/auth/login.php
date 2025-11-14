<?php

/**
 * Login Template
 * 
 * @var string $redirect_to
 * @var string $error
 * @var string $success
 */

// Get login form fields
$login_fields = [
    [
        'type' => 'input',
        'name' => 'email',
        'label' => __('Email Address', 'growfund'),
        'data' => [
            'name' => 'email',
            'type' => 'email',
            'placeholder' => __('Enter your email', 'growfund'),
            'required' => true,
            'value' => '',
            'autocomplete' => 'email'
        ]
    ],
    [
        'type' => 'input',
        'name' => 'password',
        'label' => __('Password', 'growfund'),
        'data' => [
            'name' => 'password',
            'type' => 'password',
            'placeholder' => __('Enter your password', 'growfund'),
            'required' => true,
            'value' => '',
        ]
    ],
    [
        'type' => 'html',
        'content' => '<div class="gf-forgot-password-link"><a href="' . esc_url(gf_forget_password_url()) . '" class="gf-login-link gf-login-link--bold">' . __('Forgot your password?', 'growfund') . '</a></div>'
    ],
    [
        'type' => 'input',
        'data' => [
            'type' => 'hidden',
            'name' => 'redirect_to',
            'value' => esc_attr($redirect_to)
        ]
    ]
];

$error = $error ?? gf_flash_get_message('error') ?? null; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
$success = $success ?? gf_flash_get_message('success') ?? null;

// Load WordPress header to include CSS and JS
gf_get_header(); ?>

<div class="gf-login-container gf-page-container">
    <div class="gf-login-card">
        <div class="gf-login-header">
            <?php
            gf_renderer()->render('site.components.image', [
				'src' => gf_site_image_url('logo.svg'),
				'alt' => 'Growfund',
				'attributes' => [
					'class' => 'gf-login-logo'
				]
			]);
            ?>
        </div>
        <?php
        if (!empty($error)) :
			?>
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

        <?php
        gf_renderer()->render('site.components.form-builder', [
            'fields' => $login_fields,
            'form_attributes' => [
                'method' => 'POST',
                'action' => '',
                'class' => 'gf-login-form'
            ],
            'submit_button_text' => __('Sign In', 'growfund'),
            'submit_button_attributes' => [
                'class' => 'gf-login-btn gf-login-btn--primary gf-login-btn--full'
            ]
        ]);
        ?>

        <div class="gf-login-footer">
            <p class="gf-login-terms-text">
                <?php esc_html_e('By continue, you agree to the', 'growfund'); ?>
                <a href="<?php echo esc_url(home_url('/terms/')); ?>" class="gf-login-link gf-login-link--bold"><?php esc_html_e('Terms and Conditions', 'growfund'); ?></a>
                <?php esc_html_e('and', 'growfund'); ?>
                <a href="<?php echo esc_url(home_url('/privacy/')); ?>" class="gf-login-link gf-login-link--bold"><?php esc_html_e('Privacy Policy', 'growfund'); ?></a>
                <?php esc_html_e('of Growfund.', 'growfund'); ?>
            </p>
            <p class="gf-login-links">
                <?php esc_html_e('Have an account?', 'growfund'); ?>
                <a href="<?php echo esc_url(gf_register_url()); ?>" class="gf-login-link gf-login-link--bold">
                    <?php esc_html_e('Sign up', 'growfund'); ?>
                </a>
            </p>
        </div>
    </div>
</div>

<?php gf_get_footer(); ?>