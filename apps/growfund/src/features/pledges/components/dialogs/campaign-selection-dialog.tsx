import { __, sprintf } from '@wordpress/i18n';
import { PackageOpen, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PreviewCard from '@/components/ui/preview-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getGoalInfo } from '@/config/goal-info';
import { useAppConfig } from '@/contexts/app-config';
import { type Campaign } from '@/features/campaigns/schemas/campaign';
import { useCampaignsQuery } from '@/features/campaigns/services/campaign';
import { useCurrency } from '@/hooks/use-currency';
import { useDebounce } from '@/hooks/use-debounce';
import { isDefined } from '@/utils';

interface SelectCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (campaign: Campaign) => void;
}

const SelectCampaignDialog = ({ open, onOpenChange, onSelect }: SelectCampaignDialogProps) => {
  const { toCurrency } = useCurrency();
  const { isDonationMode } = useAppConfig();
  const [search, setSearch] = useState<string>();

  const searchValue = useDebounce(search);
  const campaignsQuery = useCampaignsQuery({
    search: searchValue,
    status: 'launched-and-beyond',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus />
          {__('Select Campaign', 'growfund')}
        </Button>
      </DialogTrigger>
      <DialogContent className="gf-max-w-[32rem] gf-w-full">
        <DialogHeader>
          <DialogTitle className="gf-flex gf-items-center gf-gap-2">
            <PackageOpen className="gf-size-5 gf-text-icon-primary" />
            {__('Select Campaign', 'growfund')}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <div className="gf-p-4 gf-pt-0 gf-bg-background-surface-secondary">
          <div className="gf-flex gf-items-center gf-gap-2 gf-mb-3">
            <Input
              placeholder={__('Search campaigns...', 'growfund')}
              type="search"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </div>

          <ScrollArea>
            <div className="gf-grid gf-gap-2 gf-max-h-[36rem]">
              {campaignsQuery.data?.results.map((campaign, index) => {
                const goalInfo = getGoalInfo(campaign, isDonationMode, toCurrency);

                return (
                  <PreviewCard
                    key={index}
                    title={campaign.title}
                    subtitle={
                      campaign.has_goal && isDefined(goalInfo) ? (
                        <div className="gf-flex gf-items-center gf-gap-1 gf-typo-tiny gf-text-fg-primary">
                          <span
                            className="gf-text-fg-muted"
                            dangerouslySetInnerHTML={{ __html: goalInfo.goal_label }}
                          />
                        </div>
                      ) : (
                        <div className="gf-typo-tiny gf-text-fg-secondary gf-flex gf-items-center gf-gap-2">
                          <span className="gf-text-primary">
                            {/* translators: %s: Raised amount. */}
                            {sprintf('%s raised', toCurrency(campaign.fund_raised ?? 0))}
                          </span>
                        </div>
                      )
                    }
                    image={campaign.images?.[0]?.url}
                    action={
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelect(campaign);
                          onOpenChange(false);
                        }}
                      >
                        {__('Select', 'growfund')}
                      </Button>
                    }
                  />
                );
              })}
            </div>
            <ScrollBar orientation="vertical" hidden />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCampaignDialog;
