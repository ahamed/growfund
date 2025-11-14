import { __ } from '@wordpress/i18n';

import { MetricsCard } from '@/features/overview/components/ui/metrics-card';
import { useCurrency } from '@/hooks/use-currency';

const DonorMetricsFallback = () => {
  const { toCurrencyCompact } = useCurrency();
  return (
    <div className="gf-space-y-4 gf-mt-4">
      <div className="gf-grid gf-gap-4">
        <div className="gf-flex gf-items-center gf-gap-4">
          <MetricsCard
            data={{
              label: __('Total Donated', 'growfund'),
              amount: toCurrencyCompact(721000),
            }}
            isPro
          />
          <MetricsCard
            data={{
              label: __('Average Donation', 'growfund'),
              amount: toCurrencyCompact(300000),
            }}
            isPro
          />
          <MetricsCard
            data={{
              label: __('Donated Campaigns', 'growfund'),
              amount: '20',
            }}
            isPro
          />
          <MetricsCard
            data={{
              label: __('Total Donation', 'growfund'),
              amount: '1156',
            }}
            isPro
          />
        </div>
      </div>
    </div>
  );
};

export default DonorMetricsFallback;
