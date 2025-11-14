import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';

import CampaignCard from '@/components/campaigns/campaign-card';
import { Box, BoxContent } from '@/components/ui/box';
import { Form } from '@/components/ui/form';
import UserPreviewCard from '@/components/users/user-preview-card';
import { type Backer } from '@/features/backers/schemas/backer';
import PaymentCard from '@/features/pledges/components/payment-card';
import PledgeAction from '@/features/pledges/components/pledge-action/pledge-action';
import PledgeRewardPreview from '@/features/pledges/components/rewards/pledge-reward-preview';
import PledgeTimeline from '@/features/pledges/components/timeline/pledge-timeline';
import { type Pledge, type PledgeStatus } from '@/features/pledges/schemas/pledge';
import { isDefined } from '@/utils';

interface PledgeDetailsProps {
  pledge: Pledge;
}

const PledgeDetails = ({ pledge }: PledgeDetailsProps) => {
  const form = useForm<{ status: PledgeStatus }>({
    defaultValues: {
      status: pledge.status,
    },
  });

  return (
    <div className="gf-grid gf-grid-cols-[auto_20rem] gf-gap-4">
      <div>
        <CampaignCard campaign={pledge.campaign} mode="view" />
        {isDefined(pledge.reward) && <PledgeRewardPreview mode="view" reward={pledge.reward} />}

        <div className="gf-mt-4">
          <PaymentCard
            payment={{
              payment_status: pledge.payment.payment_status,
              amount: pledge.payment.amount,
              shipping_cost: pledge.payment.shipping_cost,
              bonus_support_amount: pledge.payment.bonus_support_amount,
              recovery_fee: pledge.payment.recovery_fee,
              payment_method: pledge.payment.payment_method,
            }}
            pledgeOption={pledge.pledge_option}
          />
        </div>
        <PledgeTimeline pledgeId={pledge.id} />
      </div>
      <Form {...form}>
        <div className="gf-space-y-4">
          <PledgeAction pledge={pledge} />
          <UserPreviewCard user={pledge.backer as Backer} title={__('Backer', 'growfund')} />
          <Box>
            <BoxContent>
              <h6 className="gf-typo-h6 gf-text-fg-primary">{__('Notes', 'growfund')}</h6>

              <div className="gf-typo-small gf-text-fg-secondary gf-mt-3">
                {pledge.notes ?? __('No notes', 'growfund')}
              </div>
            </BoxContent>
          </Box>
        </div>
      </Form>
    </div>
  );
};

export default PledgeDetails;
