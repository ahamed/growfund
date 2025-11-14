import { Pencil2Icon } from '@radix-ui/react-icons';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import { RewardItemEmptyStateIcon } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import AddRewardItemDialog from '@/features/campaigns/components/dialogs/manage-reward-item-dialog';
import { useCampaignBuilderContext } from '@/features/campaigns/contexts/campaign-builder';
import { useCampaignReward } from '@/features/campaigns/contexts/campaign-reward';
import { useConsentDialog } from '@/features/campaigns/contexts/consent-dialog-context';
import { useCampaignRewardsQuery } from '@/features/campaigns/services/reward';
import { useDeleteRewardItemMutation } from '@/features/campaigns/services/reward-item';

const RewardItems = () => {
  const { campaignId } = useCampaignBuilderContext();
  const { rewardItems } = useCampaignReward();
  const deleteRewardItemMutation = useDeleteRewardItemMutation();
  const { openDialog } = useConsentDialog();
  const rewardsQuery = useCampaignRewardsQuery(campaignId);

  const counts = useMemo(() => {
    return rewardItems.reduce<Record<string, number>>((result, current) => {
      result[current.id] ||=
        rewardsQuery.data?.reduce((sum, curr) => {
          if (curr.items.find((item) => item.id === current.id)) {
            return sum + 1;
          }

          return sum;
        }, 0) ?? 0;

      return result;
    }, {});
  }, [rewardItems, rewardsQuery.data]);

  if (rewardItems.length === 0) {
    return (
      <EmptyState className="gf-rounded-xl gf-mt-4">
        <RewardItemEmptyStateIcon />
        <EmptyStateDescription>{__('No items added yet.', 'growfund')}</EmptyStateDescription>
      </EmptyState>
    );
  }

  return (
    <div className="gf-space-y-2 gf-mt-3">
      {rewardItems.map((item) => {
        return (
          <Box key={item.id}>
            <BoxContent className="gf-py-2 gf-ps-2 gf-pe-3 gf-grid gf-grid-cols-[3rem_auto] gf-gap-2 gf-relative gf-group/reward-item">
              <Image
                src={item.image?.url ?? null}
                alt={item.title}
                className="gf-w-12"
                aspectRatio="square"
              />
              <div className="gf-grid gf-items-between">
                <p className="gf-typo-small gf-font-medium gf-text-fg-primary">{item.title}</p>
                <p className="gf-typo-tiny gf-text-fg-secondary">
                  {sprintf(
                    /* translators: %d: Number of rewards */
                    _n('Used in: %d Reward', 'Used in: %d Rewards', counts[item.id], 'growfund'),
                    counts[item.id],
                  )}
                </p>
              </div>
              <div className="gf-flex gf-items-center gf-border gf-border-border gf-p-1 gf-rounded-sm gf-absolute gf-top-[50%] gf-right-4 gf-translate-y-[-50%] gf-opacity-0 group-hover/reward-item:gf-opacity-100 gf-transition-opacity gf-duration-200">
                <AddRewardItemDialog defaultValues={item}>
                  <Button variant="ghost" size="icon" className="gf-size-6">
                    <Pencil2Icon />
                  </Button>
                </AddRewardItemDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="gf-size-6 hover:gf-text-icon-critical"
                  onClick={() => {
                    openDialog({
                      title: __('Delete Item', 'growfund'),
                      content: __(
                        'Are you sure you want to delete this item? Deleting it will automatically remove it from any reward bundles that include it, and this action cannot be undone.',
                        'growfund',
                      ),
                      confirmButtonVariant: 'destructive',
                      confirmText: __('Delete', 'growfund'),
                      declineText: __('Cancel', 'growfund'),
                      onConfirm: async (closeDialog) => {
                        if (!campaignId) {
                          return;
                        }

                        await deleteRewardItemMutation.mutateAsync({
                          campaign_id: campaignId,
                          id: item.id,
                        });
                        closeDialog();
                      },
                    });
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </BoxContent>
          </Box>
        );
      })}
    </div>
  );
};

export default RewardItems;
