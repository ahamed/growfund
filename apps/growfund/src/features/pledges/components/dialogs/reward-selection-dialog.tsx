import { __ } from '@wordpress/i18n';
import { Gift } from 'lucide-react';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type Reward } from '@/features/campaigns/schemas/reward';
import { useCampaignRewardsQuery } from '@/features/campaigns/services/reward';
import RewardItem from '@/features/pledges/components/rewards/reward-item';
import { type PledgeForm } from '@/features/pledges/schemas/pledge-form';
import { useDebounce } from '@/hooks/use-debounce';

const RewardSelectionDialog = ({
  children,
  open,
  onOpenChange,
  onSelect,
}: React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSelect?: (reward: Reward) => void;
}>) => {
  const form = useFormContext<PledgeForm>();
  const campaignId = useDebounce(useWatch({ control: form.control, name: 'campaign_id' }));

  const rewardsQuery = useCampaignRewardsQuery(campaignId ?? undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="gf-max-w-[43.75rem] gf-max-h-[90svh] gf-overflow-y-auto">
        <DialogHeader className="gf-sticky gf-top-0 gf-z-header">
          <DialogTitle className="gf-flex gf-items-center gf-gap-2">
            <Gift className="gf-size-6 gf-text-icon-primary" />
            {__('Select Reward', 'growfund')}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="gf-p-4 gf-pt-0 gf-bg-background-surface-secondary gf-grid gf-gap-2">
          {rewardsQuery.data?.map((reward, index) => {
            return (
              <RewardItem
                key={index}
                reward={reward}
                onSelect={(reward) => {
                  onSelect?.(reward);
                  form.setValue('reward_id', reward.id);
                  onOpenChange(false);
                }}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const RewardSelectionDialogTrigger = ({ children }: React.PropsWithChildren) => {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
};

RewardSelectionDialogTrigger.displayName = 'RewardSelectionDialogTrigger';

export default RewardSelectionDialog;
