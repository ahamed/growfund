import { createContext, type PropsWithChildren, use, useMemo } from 'react';

import { Box, BoxContent } from '@/components/ui/box';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaignBuilderContext } from '@/features/campaigns/contexts/campaign-builder';
import { type Reward } from '@/features/campaigns/schemas/reward';
import { type RewardItem } from '@/features/campaigns/schemas/reward-item';
import { useCampaignRewardsQuery } from '@/features/campaigns/services/reward';
import { useGetRewardItemsQuery } from '@/features/campaigns/services/reward-item';
import { matchQueryStatus } from '@/utils/match-query-status';

interface CampaignRewardContextType {
  rewards: Reward[];
  rewardItems: RewardItem[];
}

const CampaignRewardContext = createContext<CampaignRewardContextType | null>(null);

const useCampaignReward = () => {
  const context = use(CampaignRewardContext);

  if (!context) {
    throw new Error('useCampaignReward must be used within a CampaignRewardProvider');
  }

  return context;
};

const CampaignRewardProvider = ({ children }: PropsWithChildren) => {
  const { campaignId } = useCampaignBuilderContext();

  const campaignRewardsQuery = useCampaignRewardsQuery(campaignId);
  const getRewardItemsQuery = useGetRewardItemsQuery({ campaign_id: campaignId ?? null });

  const rewards = useMemo(() => {
    if (!campaignRewardsQuery.data) {
      return [];
    }
    return campaignRewardsQuery.data;
  }, [campaignRewardsQuery.data]);

  const rewardItems = useMemo(() => {
    if (!getRewardItemsQuery.data) {
      return [];
    }

    return getRewardItemsQuery.data;
  }, [getRewardItemsQuery.data]);

  return (
    <CampaignRewardContext value={{ rewards, rewardItems }}>
      {matchQueryStatus(getRewardItemsQuery, {
        Loading: (
          <div className="gf-flex gf-flex-col gf-gap-4 gf-rounded-md gf-bg-background-surface-secondary gf-py-2 gf-px-4">
            <div className="gf-flex gf-items-center gf-justify-between gf-h-12">
              <Skeleton animate className="gf-h-5 gf-w-[20%]" />
              <Skeleton animate className="gf-h-8 gf-w-[20%]" />
            </div>
            <Separator />
            {Array.from({ length: 5 }).map((_, index) => (
              <Box key={index}>
                <BoxContent className="gf-grid gf-grid-cols-[1fr_2fr_2fr_1fr] gf-gap-4">
                  <Skeleton className="gf-h-5 gf-w-10" animate />
                  <div className="gf-space-y-4">
                    <Skeleton animate className="gf-h-5 gf-w-full" />
                    <Skeleton animate className="gf-h-5 gf-w-[90%]" />
                    <Skeleton animate className="gf-h-5 gf-w-[60%]" />
                  </div>
                  <div className="gf-space-y-4">
                    <Skeleton animate className="gf-h-5 gf-w-full" />
                    <Skeleton animate className="gf-h-5 gf-w-[90%]" />
                    <Skeleton animate className="gf-h-5 gf-w-[60%]" />
                  </div>
                  <Skeleton animate className="gf-h-32 gf-w-32 gf-rounded-md" />
                </BoxContent>
                <Separator />
                <div className="gf-flex gf-items-center gf-justify-between gf-p-3">
                  <Skeleton animate className="gf-h-5 gf-w-[30%]" />
                  <div className="gf-flex gf-items-center gf-gap-2 gf-w-[30%]">
                    <Skeleton animate className="gf-h-5 gf-w-full" />
                    <Skeleton animate className="gf-h-5 gf-w-full" />
                  </div>
                </div>
              </Box>
            ))}
          </div>
        ),
        Error: children,
        Empty: children,
        Success: () => {
          return children;
        },
      })}
    </CampaignRewardContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { CampaignRewardProvider, useCampaignReward };
