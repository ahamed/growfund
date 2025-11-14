import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Shuffle } from 'lucide-react';
import { parseAsString } from 'nuqs';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { DatePickerField } from '@/components/form/date-picker-field';
import { Container } from '@/components/layouts/container';
import { Page, PageContent, PageHeader, PageSubHeader } from '@/components/layouts/page';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { growfundConfig } from '@/config/growfund';
import { useAppConfig } from '@/contexts/app-config';
import {
  type AnalyticsFilter,
  AnalyticsFilterSchema,
} from '@/features/analytics/schemas/analytics';
import { CampaignIdProvider } from '@/features/campaigns/contexts/campaignId-context';
import DonationModeOverview from '@/features/overview/components/donation-mode-overview';
import RewardModeOverview from '@/features/overview/components/reward-mode-overview';
import { useFormQuerySync } from '@/hooks/use-form-query-sync';
import { toQueryParamSafe } from '@/lib/date';

const HomePage = () => {
  const { isDonationMode } = useAppConfig();
  const navigate = useNavigate();

  const form = useForm<AnalyticsFilter>({
    resolver: zodResolver(AnalyticsFilterSchema),
  });

  useFormQuerySync({
    keyMap: {
      start_date: parseAsString,
      end_date: parseAsString,
    },
    form,
    paramsToForm: (params) => ({
      date_range: {
        from: params.start_date ? new Date(params.start_date) : null,
        to: params.end_date ? new Date(params.end_date) : null,
      },
    }),
    formToParams: (formData) => ({
      start_date: formData.date_range?.from ? toQueryParamSafe(formData.date_range.from) : null,
      end_date: formData.date_range?.to ? toQueryParamSafe(formData.date_range.to) : null,
    }),
    watchFields: ['date_range'],
  });

  return (
    <Page>
      <PageHeader name={__('Home', 'growfund')} />
      <PageContent>
        <Container className="gf-my-6">
          {growfundConfig.is_migration_available_from_crowdfunding && (
            <div className="gf-grid gf-grid-cols-3 gf-h-28 gf-mb-6 gf-rounded-md">
              <Image
                src="/images/migration-top-banner.webp"
                fit="cover"
                className="gf-border-none gf-bg-transparent gf-size-full gf-rounded-none gf-rounded-l-md"
              />
              <div className="gf-col-span-2 gf-flex gf-items-center gf-justify-between gf-w-full gf-border gf-border-border gf-border-l-0 gf-py-5 gf-px-12 gf-bg-white gf-rounded-r-md">
                <div className="gf-flex gf-flex-col gf-gap-1 gf-w-80">
                  <div className="gf-typo-h6 gf-text-fg-primary">
                    {__('Migrate to Growfund', 'growfund')}
                  </div>
                  <div className="gf-typo-small gf-text-fg-secondary">
                    {__(
                      'Move to Growfund for the best crowdfunding experience in WordPress.',
                      'growfund',
                    )}
                  </div>
                </div>
                <div className="gf-flex gf-items-center gf-gap-3">
                  <Button
                    variant="primary"
                    onClick={(event) => {
                      event.preventDefault();
                      void navigate('/migrate-from-crowdfunding');
                    }}
                  >
                    <Shuffle />
                    {__('Migrate Now', 'growfund')}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <Form {...form}>
            <PageSubHeader
              title={__('Overview', 'growfund')}
              action={
                <div>
                  <DatePickerField
                    control={form.control}
                    name="date_range"
                    placeholder={__('Date: Last 30 days', 'growfund')}
                    type="range"
                    showRangePresets
                    clearable
                  />
                </div>
              }
            />
            <CampaignIdProvider>
              {isDonationMode ? <DonationModeOverview /> : <RewardModeOverview />}
            </CampaignIdProvider>
          </Form>
        </Container>
      </PageContent>
    </Page>
  );
};

export default HomePage;
