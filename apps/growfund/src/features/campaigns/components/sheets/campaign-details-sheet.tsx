import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { FileHeart } from 'lucide-react';
import { useForm } from 'react-hook-form';

import FeatureGuard from '@/components/feature-guard';
import { DatePickerField } from '@/components/form/date-picker-field';
import { Container } from '@/components/layouts/container';
import CampaignDetailsFallback from '@/components/pro-fallbacks/campaign/campaign-details-fallback';
import { Form } from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import InformationMetrics from '@/features/analytics/components/shared/information-metrics';
import {
  type AnalyticsFilter,
  AnalyticsFilterSchema,
} from '@/features/analytics/schemas/analytics';
import { CampaignProvider } from '@/features/campaigns/contexts/campaign-context';
import { type Campaign } from '@/features/campaigns/schemas/campaign';
import { registry } from '@/lib/registry';
import { getDefaults } from '@/lib/zod';

interface CampaignDetailsSheetProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CampaignDetailsSheet = ({ campaign, open, onOpenChange }: CampaignDetailsSheetProps) => {
  const form = useForm<AnalyticsFilter>({
    resolver: zodResolver(AnalyticsFilterSchema),
    defaultValues: getDefaults(AnalyticsFilterSchema),
  });

  const CampaignOverviewAnalytics = registry.get('CampaignOverviewAnalytics');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gf-h-[90svh] gf-grid">
        <SheetHeader>
          <SheetTitle>
            <FileHeart className="gf-size-6" />
            {__('Campaign Overview', 'growfund')}
          </SheetTitle>
          <SheetDescription className="gf-sr-only">
            {__('Campaign Overview', 'growfund')}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea>
          <Container className="gf-my-7 gf-space-y-5 gf-min-h-[calc(100svh-10rem)]">
            <Form {...form}>
              <div className="gf-flex gf-items-center gf-justify-between">
                <h4 className="gf-typo-h4 gf-text-fg-brand ">{campaign.title}</h4>
                <div>
                  <DatePickerField
                    control={form.control}
                    name="date_range"
                    placeholder={__('Date: Last 30 days', 'growfund')}
                    type="range"
                    showRangePresets
                    clearable
                    className="gf-w-64"
                  />
                </div>
              </div>
              <InformationMetrics
                hasNoColor={true}
                invisibleGrowth={true}
                campaignId={campaign.id}
              />
              <FeatureGuard feature="campaign.overview" fallback={<CampaignDetailsFallback />}>
                {CampaignOverviewAnalytics && (
                  <CampaignProvider campaign={campaign}>
                    <CampaignOverviewAnalytics />
                  </CampaignProvider>
                )}
              </FeatureGuard>
            </Form>
          </Container>
          <ScrollBar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CampaignDetailsSheet;
