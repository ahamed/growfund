import { __ } from '@wordpress/i18n';
import { useMemo } from 'react';

import { LoadingSkeleton } from '@/components/layouts/loading-skeleton';
import { useGetDonorStats } from '@/dashboards/donors/features/donations/services/donor-stats';
import { MetricsCard } from '@/features/overview/components/ui/metrics-card';
import { useCurrency } from '@/hooks/use-currency';

const DonorInformationMetrics = () => {
  const { toCurrencyCompact } = useCurrency();

  const donorStatsQuery = useGetDonorStats();

  const metrics = useMemo(() => {
    const data = donorStatsQuery.data;

    if (!data) return [];

    return [
      {
        label: __('Donated Amount', 'growfund'),
        amount: toCurrencyCompact(data.total_contributions.toFixed(2)),
      },
      {
        label: __('Campaigns Donated', 'growfund'),
        amount: data.total_supported_campaigns.toString(),
      },
      {
        label: __('Total Donations', 'growfund'),
        amount: data.total_number_of_donations.toString(),
      },
      {
        label: __('Average Donation', 'growfund'),
        amount: toCurrencyCompact(data.average_contributions.toFixed(2)),
      },
    ];
  }, [toCurrencyCompact, donorStatsQuery.data]);

  return (
    <div className="gf-grid gf-grid-cols-4 gf-gap-4">
      {metrics.map((metric, index) => {
        return (
          <LoadingSkeleton
            key={index}
            loading={donorStatsQuery.isLoading || donorStatsQuery.isFetching}
            className="gf-w-full gf-rounded-3xl gf-shadow-sm gf-p-0 gf-min-w-48 gf-h-28"
            skeletonClassName="gf-w-full gf-flex gf-rounded-3xl gf-min-w-48 gf-h-28 "
          >
            <MetricsCard data={metric} className="gf-rounded-md" variant="default" />
          </LoadingSkeleton>
        );
      })}
    </div>
  );
};

export default DonorInformationMetrics;
