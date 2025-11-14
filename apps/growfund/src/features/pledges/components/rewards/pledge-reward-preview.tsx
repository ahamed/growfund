import { UpdateIcon } from '@radix-ui/react-icons';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from 'react';

import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import PreviewCard from '@/components/ui/preview-card';
import { type Reward } from '@/features/campaigns/schemas/reward';
import RewardSelectionDialog, {
  RewardSelectionDialogTrigger,
} from '@/features/pledges/components/dialogs/reward-selection-dialog';
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';

const PledgeRewardPreview = ({
  reward,
  mode = 'edit',
  onSelect,
  showError = false,
  errorMessage,
}: {
  reward: Reward;
  showError?: boolean;
  errorMessage?: string;
  mode?: 'view' | 'edit';
  onSelect?: (reward: Reward) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { toCurrency } = useCurrency();

  return (
    <Box
      className={cn(
        'gf-mt-3',
        showError && 'gf-border gf-border-border-critical gf-bg-background-fill-critical-secondary',
      )}
    >
      <BoxContent className="gf-p-4 gf-grid gf-gap-3">
        <Box className="gf-bg-background-surface-secondary">
          <BoxContent className="gf-p-4 gf-grid gf-grid-cols-[5.5rem_1fr_3rem] gf-gap-3">
            <Image
              src={reward.image?.url ?? null}
              alt={reward.title}
              aspectRatio="square"
              className="gf-rounded-md"
            />
            <div className="gf-flex gf-flex-col gf-gap-4">
              <div className="gf-typo-small gf-font-medium gf-text-fg-primary">{reward.title}</div>
              <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-secondary">
                {toCurrency(reward.amount)}
              </h6>
            </div>
            {mode === 'edit' && (
              <div className="gf-justify-self-end gf-h-full gf-flex gf-items-center">
                <RewardSelectionDialog open={open} onOpenChange={setOpen} onSelect={onSelect}>
                  <RewardSelectionDialogTrigger>
                    <Button variant="outline" size="icon">
                      <UpdateIcon />
                    </Button>
                  </RewardSelectionDialogTrigger>
                </RewardSelectionDialog>
              </div>
            )}
          </BoxContent>
        </Box>
        <div className="gf-grid gf-gap-2">
          <div className="gf-typo-small gf-font-medium gf-text-fg-secondary">
            {/* translator: %s: number of items */}
            {sprintf(__('%s items included', 'growfund'), reward.items.length)}
          </div>
          <div>
            {reward.items.map((item, index) => {
              return (
                <PreviewCard
                  key={index}
                  title={item.title}
                  /* translator: %s: quantity */
                  subtitle={sprintf(__('Quantity: %s', 'growfund'), 1)}
                  image={item.image?.url}
                  className="gf-px-0 gf-shadow-none"
                />
              );
            })}
          </div>
        </div>
        {showError && errorMessage && (
          <p className="gf-text-[0.8rem] gf-font-small gf-text-fg-critical">
            {__(errorMessage, 'growfund')}
          </p>
        )}
      </BoxContent>
    </Box>
  );
};

export default PledgeRewardPreview;
