import { __ } from '@wordpress/i18n';

import UserPreviewCard from '@/components/users/user-preview-card';
import BackerActivityLogCard from '@/features/backers/components/backer-activity-log-card';
import { useBackerContext } from '@/features/backers/contexts/backer';
import { type Backer } from '@/features/backers/schemas/backer';
import { MetricsCard } from '@/features/overview/components/ui/metrics-card';
import { useCurrency } from '@/hooks/use-currency';

const BackerDetailsOverviewPage = () => {
  const { backer } = useBackerContext();
  const { toCurrencyCompact } = useCurrency();
  return (
    <div className="gf-space-y-4 gf-mt-4">
      <div className="gf-grid gf-gap-4">
        <div className="gf-flex gf-items-center gf-gap-4">
          <MetricsCard
            data={{
              label: __('Pledged Amount', 'growfund'),
              amount: toCurrencyCompact(backer.pledged_amount),
            }}
          />

          <MetricsCard
            data={{
              label: __('Backed Amount', 'growfund'),
              amount: toCurrencyCompact(backer.backed_amount),
            }}
          />
          <MetricsCard
            data={{
              label: __('Pledged Campaigns', 'growfund'),
              amount: backer.pledged_campaigns.toString(),
            }}
          />
          <MetricsCard
            data={{
              label: __('Backed Campaigns', 'growfund'),
              amount: backer.backed_campaigns.toString(),
            }}
          />
        </div>
      </div>

      <div className="gf-grid gf-grid-cols-[20rem_auto] gf-gap-4">
        <UserPreviewCard user={backer.backer_information as Backer} />
        <BackerActivityLogCard />
      </div>
    </div>
  );
};

export default BackerDetailsOverviewPage;
