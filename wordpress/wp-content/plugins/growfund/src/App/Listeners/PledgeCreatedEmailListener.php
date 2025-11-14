<?php

namespace Growfund\App\Listeners;

use Growfund\App\Events\PledgeCreatedEvent;
use Growfund\Constants\Mail\MailKeys;
use Growfund\Mails\Backer\OfflinePledgeRequestMail;
use Growfund\Mails\NewOfflinePledgeMail;
use Growfund\Mails\NewPledgeMail;
use Growfund\Mails\Backer\PledgeCreatedMail;
use Growfund\Supports\AdminUser;

class PledgeCreatedEmailListener
{
    public function handle(PledgeCreatedEvent $event)
    {
        gf_scheduler()->resolve(
            $event->create_pledge_dto->is_manual
                ? NewOfflinePledgeMail::class
                : NewPledgeMail::class
        )
            ->with([
                'content_key' => $event->create_pledge_dto->is_manual
                    ? MailKeys::ADMIN_NEW_OFFLINE_PLEDGE
                    : MailKeys::ADMIN_NEW_PLEDGE,
                'pledge_id' => $event->pledge_id,
                'receiver_user_id' => AdminUser::get_id(),
            ])
            ->group('gf_new_pledge_mails')
            ->schedule_email();

        gf_scheduler()->resolve($event->create_pledge_dto->is_manual ? OfflinePledgeRequestMail::class : PledgeCreatedMail::class)
            ->with(['pledge_id' => $event->pledge_id])
            ->group('gf_new_pledge_mails')
            ->schedule_email();
    }
}
