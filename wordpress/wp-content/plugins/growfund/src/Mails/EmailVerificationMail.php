<?php

namespace Growfund\Mails;

use Growfund\Constants\Mail\MailKeys;
use Growfund\Mailer;
use InvalidArgumentException;

class EmailVerificationMail extends Mailer
{
    protected $content_key = MailKeys::EMAIL_VERIFICATION;

    public function with($data)
    {
        if (!isset($data['user_id']) || !isset($data['token'])) {
            throw new InvalidArgumentException(esc_html__('User ID and token are required', 'growfund'));
        }

        $user = gf_user($data['user_id']);

        if (!$user) {
            throw new InvalidArgumentException(esc_html__('User not found', 'growfund'));
        }

        $verification_link = add_query_arg([
            'gf_verify_email' => '1',
            'uid' => $user->get_id(),
            'token' => $data['token'],
        ], site_url());

        $this->set_receiver_user_id($user->get_id());
        $this->to($user->get_email());

        return parent::with([
            'first_name' => $user->get_first_name(),
            'last_name' => $user->get_last_name(),
            'verification_link_button' => gf_renderer()->get_html('mails.components.link-button', [
                'text' => __('Verify Your Account', 'growfund'),
                'link' => $verification_link,
                'colors' => $this->get_colors(),
            ]),
            'verification_link' =>  gf_renderer()->get_html('mails.components.links.url', [
                'text' => $verification_link,
                'link' => $verification_link,
                'colors' => $this->get_colors(),
            ]),
        ]);
    }
}
