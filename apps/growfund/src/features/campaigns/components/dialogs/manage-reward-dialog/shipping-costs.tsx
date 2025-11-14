import { __ } from '@wordpress/i18n';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { ComboBoxField } from '@/components/form/combobox-field';
import { TextField } from '@/components/form/text-field';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShippingRestOfTheWorld } from '@/config/price-calculator';
import { useCampaignBuilderContext } from '@/features/campaigns/contexts/campaign-builder';
import { type RewardForm } from '@/features/campaigns/schemas/reward';
import { useCampaignRewardsQuery } from '@/features/campaigns/services/reward';
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import { countriesAsOptions } from '@/utils/countries';

const ShippingCosts = () => {
  const { campaignId } = useCampaignBuilderContext();
  const form = useFormContext<RewardForm>();
  const rewardsQuery = useCampaignRewardsQuery(campaignId);
  const shippingCosts = useWatch({ control: form.control, name: 'shipping_costs' }) ?? [];

  const firstRewardShippingCost = useMemo(() => {
    if (!rewardsQuery.data || rewardsQuery.data.length === 0) {
      return null;
    }

    return rewardsQuery.data[0].shipping_costs;
  }, [rewardsQuery.data]);

  useEffect(() => {
    if (shippingCosts.length === 0 && firstRewardShippingCost) {
      form.setValue('shipping_costs', firstRewardShippingCost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRewardShippingCost, form.setValue]);

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'shipping_costs',
  });

  const { toCurrency } = useCurrency();

  const fields = fieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...shippingCosts[index],
    };
  });

  const shippingErrors = form.getFieldState('shipping_costs').error;

  return (
    <div className="gf-space-y-2">
      <Box
        className={cn(
          !!shippingErrors && 'gf-border-border-critical gf-bg-background-fill-critical-secondary',
        )}
      >
        <Table wrapperClassname="gf-overflow-visible">
          <TableHeader>
            <TableRow>
              <TableHead className="gf-border-r gf-border-r-border">
                {__('Location', 'growfund')}
              </TableHead>
              <TableHead>{__('Cost', 'growfund')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              return (
                <TableRow key={field.id}>
                  <TableCell className="gf-border-r gf-border-r-border gf-w-[12.125rem]">
                    <div className="gf-flex gf-items-center gf-gap-2">
                      <ComboBoxField
                        control={form.control}
                        name={`shipping_costs.${index}.location` as 'shipping_costs.0.location'}
                        className={
                          'gf-border-transparent hover:gf-border-border focus-visible:gf-border-border'
                        }
                        options={[
                          {
                            label: __('Rest of the world', 'growfund'),
                            value: ShippingRestOfTheWorld,
                            icon: '🌐',
                          },
                          ...countriesAsOptions({ with_flag: true }),
                        ]}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="gf-w-[12.125rem] gf-group">
                    <TextField
                      control={form.control}
                      name={`shipping_costs.${index}.cost` as `shipping_costs.0.cost`}
                      type="number"
                      placeholder={__('e.g. 50.00', 'growfund')}
                      data-name="input"
                      className="gf-hidden group-hover:gf-flex"
                    />
                    <span
                      className="gf-typo-small gf-text-fg-primary gf-font-medium gf-ms-2 group-hover:gf-hidden"
                      data-name="label"
                    >
                      {field.cost ? toCurrency(field.cost) : __('Free', 'growfund')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        fieldArray.remove(index);
                      }}
                      className="hover:gf-text-icon-critical"
                    >
                      <Trash2 className="gf-text-icon-primary hover:gf-text-icon-critical" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="gf-border-t gf-border-t-border gf-h-12 gf-flex gf-items-center">
          <Button
            variant="ghost"
            className="hover:gf-bg-transparent hover:gf-text-fg-brand"
            onClick={() => {
              fieldArray.append({ location: '', cost: 0 });
            }}
          >
            <Plus />
            {__('Add Another Destination', 'growfund')}
          </Button>
        </div>
      </Box>
      {!!shippingErrors && (
        <p className="gf-typo-small gf-text-fg-critical">{shippingErrors.message?.[0]}</p>
      )}
    </div>
  );
};

export default ShippingCosts;
