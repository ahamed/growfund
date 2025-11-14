<?php

/**
 * Register Template
 * 
 * @var string $redirect_to
 * @var string $error
 * @var string $success
 * @var bool $is_fundraiser
 */

// Load WordPress header to include CSS and JS
gf_get_header();

$register_fields = [
    [
        'type' => 'group',
        'wrapper_class' => 'gf-form-row-half',
        'fields' => [
            [
                'type' => 'input',
                'name' => 'first_name',
                'label' => __('First name', 'growfund'),
                'data' => [
                    'name' => 'first_name',
                    'type' => 'text',
                    'placeholder' => __('e.g. John', 'growfund'),
                    'required' => true,
                    'value' => isset($_POST['first_name']) ? $_POST['first_name'] : '', // phpcs:ignore
                ]
            ],
            [
                'type' => 'input',
                'name' => 'last_name',
                'label' => __('Last name', 'growfund'),
                'data' => [
                    'name' => 'last_name',
                    'type' => 'text',
                    'placeholder' => __('e.g. Smith', 'growfund'),
                    'required' => true,
                    'value' => isset($_POST['last_name']) ? $_POST['last_name'] : '', // phpcs:ignore
                ]
            ]
        ]
    ],
    [
        'type' => 'input',
        'name' => 'email',
        'label' => __('Email address', 'growfund'),
        'data' => [
            'name' => 'email',
            'type' => 'email',
            'placeholder' => __('e.g. johnsmith@yourmail.com', 'growfund'),
            'required' => true,
            'value' => isset($_POST['email']) ? $_POST['email'] : '', // phpcs:ignore
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
            'placeholder' => __('••••••••', 'growfund'),
            'required' => true,
            'value' => isset($_POST['password']) ? $_POST['password'] : '', // phpcs:ignore
            'class' => 'gf-input gf-password-input',
            'autocomplete' => 'new-password',
        ]
    ],
    [
        'type' => 'input',
        'name' => 'password_confirmation',
        'label' => __('Confirm Password', 'growfund'),
        'data' => [
            'name' => 'password_confirmation',
            'type' => 'password',
            'placeholder' => __('••••••••', 'growfund'),
            'required' => true,
            'value' => isset($_POST['password_confirmation']) ? $_POST['password_confirmation'] : '', // phpcs:ignore
            'class' => 'gf-input gf-password-input',
            'autocomplete' => 'new-password',
        ]
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
?>

<div class="gf-register-container gf-page-container">
    <div class="gf-register-card">
        <div class="gf-register-header">
            <?php
            gf_renderer()->render('site.components.image', [
				'src' => gf_site_image_url('logo.svg'),
				'alt' => __('Growfund', 'growfund'),
				'attributes' => [
					'class' => 'gf-register-logo'
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
            'fields' => $register_fields,
            'form_attributes' => [
                'method' => 'POST',
                'action' => '',
                'class' => 'gf-register-form'
            ],
            'submit_button_text' => isset($is_fundraiser) && $is_fundraiser ? esc_html__('Create Fundraiser Account', 'growfund') : esc_html__('Sign up', 'growfund'),
            'submit_button_attributes' => [
                'class' => 'gf-register-btn gf-register-btn--primary gf-register-btn--full'
            ]
        ]);
        ?>

        <div class="gf-register-footer">
            <p class="gf-register-terms-text">
                <?php esc_html_e('By continue, you agree to the', 'growfund'); ?>
                <a href="<?php echo esc_url(home_url('/terms/')); ?>" class="gf-register-link gf-register-link--bold"><?php esc_html_e('Terms and Conditions', 'growfund'); ?></a>
                <?php esc_html_e('and', 'growfund'); ?>
                <a href="<?php echo esc_url(home_url('/privacy/')); ?>" class="gf-register-link gf-register-link--bold"><?php esc_html_e('Privacy Policy', 'growfund'); ?></a>
                <?php esc_html_e('of Growfund.', 'growfund'); ?>
            </p>
            <p class="gf-register-links">
                <?php esc_html_e('Have an account?', 'growfund'); ?>
                <a href="<?php echo esc_url(gf_login_url()); ?>" class="gf-register-link gf-register-link--bold">
                    <?php esc_html_e('Log in', 'growfund'); ?>
                </a>
            </p>
        </div>
    </div>
</div>

<?php gf_get_footer(); ?>