import { ListBulletIcon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import { PackageOpen, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import FeatureGuard from '@/components/feature-guard';
import CampaignRewardFallback from '@/components/pro-fallbacks/campaign/campaign-reward-fallback';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManageRewardDialog from '@/features/campaigns/components/dialogs/manage-reward-dialog/manage-reward-dialog';
import ManageRewardItemDialog from '@/features/campaigns/components/dialogs/manage-reward-item-dialog';
import RewardItems from '@/features/campaigns/components/reward-step/reward-items/reward-items';
import CampaignRewards from '@/features/campaigns/components/reward-step/rewards/campaign-rewards';
import { useCampaignReward } from '@/features/campaigns/contexts/campaign-reward';
import { type CampaignForm } from '@/features/campaigns/schemas/campaign';
import { cn } from '@/lib/utils';
const GoodiesTab = () => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'items'>('rewards');
  const form = useFormContext<CampaignForm>();
  const { rewards, rewardItems } = useCampaignReward();

  return (
    <div className="gf-space-y-2">
      <div
        className={cn(
          'gf-bg-background-surface-tertiary gf-rounded-lg gf-pt-2 gf-px-4 gf-pb-4 gf-border gf-border-transparent',
          form.getFieldState('rewards').error &&
            'gf-border-border-critical gf-bg-background-fill-critical-secondary',
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'rewards' | 'items');
          }}
        >
          <div className="gf-h-[3.125rem] gf-flex gf-flex-1 gf-items-center gf-justify-between gf-relative">
            <TabsList>
              <TabsTrigger value="rewards">
                <div className="gf-flex gf-items-center gf-gap-4 gf-typo-small gf-font-medium">
                  <PackageOpen className="gf-text-inherit gf-flex-shrink-0 gf-w-4 gf-h-4" />
                  <span>{__('Rewards', 'growfund')}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="items">
                <div className="gf-flex gf-items-center gf-gap-4 gf-typo-small gf-font-medium">
                  <ListBulletIcon className="gf-text-inherit gf-flex-shrink-0 gf-w-4 gf-h-4" />
                  <span>{__('Items', 'growfund')}</span>
                </div>
              </TabsTrigger>
            </TabsList>
            <div className="gf-absolute gf-right-0 gf-top-0">
              {activeTab === 'rewards' ? (
                <FeatureGuard
                  feature="campaign.rewards"
                  consumedLimit={rewards.length}
                  fallback={
                    <CampaignRewardFallback
                      title={__('Unlock Unlimited Rewards', 'growfund')}
                      description={__(
                        "Maximize your campaign's appeal with more rewards. Upgrade to Pro for unlimited reward slots and attract more backers.",
                        'growfund',
                      )}
                    >
                      <Button variant="outline">
                        <Plus className="gf-text-icon-primary gf-w-4 gf-h-4" />
                        {__('Add Reward', 'growfund')}
                      </Button>
                    </CampaignRewardFallback>
                  }
                >
                  <ManageRewardDialog>
                    <Button variant="outline">
                      <Plus className="gf-text-icon-primary gf-w-4 gf-h-4" />
                      {__('Add Reward', 'growfund')}
                    </Button>
                  </ManageRewardDialog>
                </FeatureGuard>
              ) : (
                <FeatureGuard
                  feature="campaign.reward_items"
                  consumedLimit={rewardItems.length}
                  fallback={
                    <CampaignRewardFallback
                      title={__('Unlock Unlimited Items', 'growfund')}
                      description={__(
                        "Maximize your campaign's appeal with more items in rewards. Upgrade to Pro for unlimited items attract more backers.",
                        'growfund',
                      )}
                    >
                      <Button variant="outline">
                        <Plus />
                        {__('Add Item', 'growfund')}
                      </Button>
                    </CampaignRewardFallback>
                  }
                >
                  <ManageRewardItemDialog>
                    <Button variant="outline">
                      <Plus />
                      {__('Add Item', 'growfund')}
                    </Button>
                  </ManageRewardItemDialog>
                </FeatureGuard>
              )}
            </div>
          </div>
          <TabsContent value="rewards">
            <CampaignRewards />
          </TabsContent>
          <TabsContent value="items">
            <RewardItems />
          </TabsContent>
        </Tabs>
      </div>
      {form.getFieldState('rewards').error && (
        <p className="gf-typo-small gf-text-fg-critical">
          {form.getFieldState('rewards').error?.message?.[0]}
        </p>
      )}
    </div>
  );
};

export default GoodiesTab;
