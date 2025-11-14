import { __ } from '@wordpress/i18n';

import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { type Reward } from '@/features/campaigns/schemas/reward';
import { useCurrency } from '@/hooks/use-currency';

interface RewardItemProps {
  reward: Reward;
  onSelect: (reward: Reward) => void;
}

const RewardItem = ({ reward, onSelect }: RewardItemProps) => {
  const { toCurrency } = useCurrency();

  return (
    <Box className="gf-group/reward-item gf-min-h-[8rem]">
      <BoxContent className="gf-p-4 gf-grid gf-grid-cols-[1fr_2fr_2fr_1fr] gf-gap-4 gf-h-full">
        <h6 className="gf-typo-h6 gf-font-semibold">{toCurrency(reward.amount)}</h6>
        <div className="gf-typo-small gf-font-medium">{reward.title}</div>
        <div className="gf-typo-tiny gf-text-fg-secondary">
          <div className="gf-mb-2">{__('Item includes', 'growfund')}</div>
          <div className="gf-grid gf-gap-2">
            {reward.items.map((item, index) => {
              return (
                <div key={index} className="gf-flex gf-items-start gf-gap-1">
                  <span>{index + 1}.</span>
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="gf-max-w-[5.5rem] gf-justify-self-end gf-place-self-center">
          <Image
            src={reward.image?.url ?? null}
            alt={reward.title}
            aspectRatio="square"
            className="group-hover/reward-item:gf-hidden"
          />
          <Button
            className="gf-hidden group-hover/reward-item:gf-inline-flex gf-place-self-center"
            onClick={() => {
              onSelect(reward);
            }}
          >
            {__('Select', 'growfund')}
          </Button>
        </div>
      </BoxContent>
    </Box>
  );
};

export default RewardItem;
