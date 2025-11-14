import { __ } from '@wordpress/i18n';
import { LayoutTemplate } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box } from '@/components/ui/box';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { type Campaign } from '@/features/campaigns/schemas/campaign';
import SelectCampaignDialog from '@/features/pledges/components/dialogs/campaign-selection-dialog';
import { type PledgeForm } from '@/features/pledges/schemas/pledge-form';
import { cn } from '@/lib/utils';

const AddCampaignEmptyState = ({
  onSelectCampaign,
}: {
  onSelectCampaign: (campaign: Campaign) => void;
}) => {
  const [open, setOpen] = useState(false);

  const form = useFormContext<PledgeForm>();

  return (
    <FormField
      control={form.control}
      name={'campaign_id'}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            <FormControl>
              <Box
                className={cn(
                  'gf-grid gf-place-items-center gf-gap-4 gf-p-6',
                  fieldState.error &&
                    'gf-border-border-critical gf-bg-background-fill-critical-secondary',
                )}
              >
                <LayoutTemplate className="gf-size-6 gf-text-icon-primary" />
                <SelectCampaignDialog
                  open={open}
                  onOpenChange={setOpen}
                  onSelect={(campaign) => {
                    field.onChange(campaign.id);
                    onSelectCampaign(campaign);
                    setOpen(false);
                    form.clearErrors();
                  }}
                />
                {fieldState.error && (
                  <p className="gf-text-[0.8rem] gf-font-small gf-text-fg-critical">
                    {__('Please select a campaign.', 'growfund')}
                  </p>
                )}
              </Box>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default AddCampaignEmptyState;
