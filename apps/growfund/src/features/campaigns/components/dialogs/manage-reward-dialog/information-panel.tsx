import { DashIcon } from '@radix-ui/react-icons';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Car, MapPin, ShoppingBag, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SmartImage } from '@/components/ui/smart-image';
import { useCampaignReward } from '@/features/campaigns/contexts/campaign-reward';
import { type RewardForm } from '@/features/campaigns/schemas/reward';
import { useCurrency } from '@/hooks/use-currency';
import { DATE_FORMATS, formatDate } from '@/lib/date';

const InformationPanel = ({
  rewardLeft,
  numberOfContributors,
}: {
  rewardLeft?: number | null;
  numberOfContributors?: number | null;
}) => {
  const form = useFormContext<RewardForm>();
  const { rewardItems } = useCampaignReward();

  const { toCurrency } = useCurrency();

  const rewardType = useWatch({ control: form.control, name: 'reward_type' });
  const itemsValue = useWatch({ control: form.control, name: 'items' });
  const itemIds = itemsValue.map((item) => item.id);
  const itemQuantities = itemsValue.reduce<Record<string, number>>((result, item) => {
    result[item.id] = item.quantity;
    return result;
  }, {});
  const itemsData = rewardItems
    .filter((item) => itemIds.includes(item.id))
    .map((item) => ({
      ...item,
      quantity: itemQuantities[item.id],
    }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shippingCosts = useWatch({ control: form.control, name: 'shipping_costs' }) ?? [];

  const shippingAddress = useMemo(() => {
    if (shippingCosts.length === 0) {
      return null;
    }
    if (shippingCosts.some((cost) => cost.location === 'rest-of-the-world')) {
      return __('Anywhere of the world', 'growfund');
    }
    return sprintf(
      /* translators: %d: number of countries */
      _n('%d country', '%d countries', shippingCosts.length, 'growfund'),
      shippingCosts.length,
    );
  }, [shippingCosts]);

  const formData = {
    title: useWatch({ control: form.control, name: 'title' }),
    amount: useWatch({ control: form.control, name: 'amount' }),
    description: useWatch({ control: form.control, name: 'description' }),
    image: useWatch({ control: form.control, name: 'image' }),
    shipping_address: shippingAddress,
    backer_count: numberOfContributors,
    estimated_delivery: useWatch({ control: form.control, name: 'estimated_delivery_date' }),
    quantity_limit: useWatch({ control: form.control, name: 'quantity_limit' }),
    quantity_type: useWatch({ control: form.control, name: 'quantity_type' }),
    items: itemsData,
  } as const;

  return (
    <ScrollArea className="gf-sticky">
      <Box className="gf-overflow-hidden">
        <SmartImage
          src={formData.image?.url ?? null}
          alt={formData.title}
          className="gf-rounded-none gf-h-[13.25rem] gf-w-full gf-border-none"
        />

        <div className="gf-px-4 gf-py-2 gf-pb-4 gf-space-y-4">
          <div className="gf-grid gf-grid-cols-[2.5fr_1fr] gf-gap-2">
            {formData.title ? (
              <h4 className="gf-typo-h4 gf-font-normal gf-text-fg-primary">{formData.title}</h4>
            ) : (
              <Skeleton className="gf-h-3 gf-w-full" />
            )}
            {formData.amount ? (
              <h4 className="gf-typo-h4 gf-text-fg-primary">
                {toCurrency(form.getValues('amount'))}
              </h4>
            ) : (
              <Skeleton className="gf-h-3 gf-w-full" />
            )}
          </div>

          {!!formData.description && (
            <div className="gf-typo-small gf-text-fg-secondary">{formData.description}</div>
          )}

          <div className="gf-grid gf-grid-cols-2 gf-gap-4">
            {rewardType !== 'digital-goods' && (
              <div className="gf-flex gf-gap-2 gf-items-start">
                <MapPin className="gf-text-icon-secondary gf-size-4" />
                <div className="gf-space-y-1 gf-w-full">
                  <p className="gf-typo-tiny gf-text-fg-secondary">{__('Ships to', 'growfund')}</p>
                  <div className="gf-typo-tiny gf-font-medium gf-text-fg-primary">
                    {formData.shipping_address ?? <DashIcon className="gf-size-4" />}
                  </div>
                </div>
              </div>
            )}
            <div className="gf-flex gf-gap-2 gf-items-start">
              <Users className="gf-text-icon-secondary gf-size-4" />
              <div className="gf-space-y-1 gf-w-full">
                <p className="gf-typo-tiny gf-text-fg-secondary">{__('Backers', 'growfund')}</p>
                <p className="gf-typo-tiny gf-font-medium gf-text-fg-primary">
                  {formData.backer_count ?? <DashIcon className="gf-size-4" />}
                </p>
              </div>
            </div>
            <div className="gf-flex gf-gap-2 gf-items-start">
              <Car className="gf-text-icon-secondary gf-size-4" />
              <div className="gf-space-y-1">
                <p className="gf-typo-tiny gf-text-fg-secondary">
                  {__('Estimated Delivery', 'growfund')}
                </p>
                <p className="gf-typo-tiny gf-font-medium gf-text-fg-primary">
                  {(formData.estimated_delivery &&
                    formatDate(new Date(formData.estimated_delivery), DATE_FORMATS.DATE_FIELD)) ?? (
                    <DashIcon className="gf-size-4" />
                  )}
                </p>
              </div>
            </div>
            <div className="gf-flex gf-gap-2 gf-items-start">
              <ShoppingBag className="gf-text-icon-secondary gf-size-4" />
              <div className="gf-space-y-1">
                <p className="gf-typo-tiny gf-text-fg-secondary">
                  {__('Limited Quantity', 'growfund')}
                </p>
                <p className="gf-typo-tiny gf-font-medium gf-text-fg-primary">
                  {formData.quantity_type === 'limited' ? (
                    sprintf(
                      /* translators: 1: reward left, 2: reward quantity limit */
                      __('%1$s left of %2$s', 'growfund'),
                      rewardLeft ?? 0,
                      formData.quantity_limit,
                    )
                  ) : (
                    <DashIcon className="gf-size-4" />
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="gf-space-y-2">
            <p className="gf-text-fg-primary gf-font-medium gf-typo-small">
              {/* translators: %s: number of items */}
              {sprintf(__('%s items included', 'growfund'), formData.items.length)}
            </p>

            {formData.items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="gf-bg-background-surface gf-border gf-border-border gf-rounded-md gf-p-2 gf-flex gf-items-center gf-gap-4"
                >
                  <Image
                    src={item.image?.url ?? null}
                    alt={item.title}
                    className="gf-rounded-md gf-w-12 gf-shrink-0"
                    aspectRatio="square"
                  />
                  <div>
                    <p className="gf-typo-small gf-font-medium gf-text-fg-primary">{item.title}</p>
                    <span className="gf-typo-tiny gf-text-fg-muted">
                      {/* translators: %s: item quantity */}
                      {sprintf(__('Quantity: %s', 'growfund'), item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Box>
    </ScrollArea>
  );
};

export default InformationPanel;
