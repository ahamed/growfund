import { __ } from '@wordpress/i18n';

import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { ErrorState, ErrorStateDescription } from '@/components/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useBackerGivingStatsQuery } from '@/features/backers/services/backer';
import { MetricsCard } from '@/features/overview/components/ui/metrics-card';
import { useCurrency } from '@/hooks/use-currency';
import { matchQueryStatus } from '@/utils/match-query-status';

const BackerGivingStats = ({ backerId }: { backerId?: string }) => {
  const { toCurrencyCompact } = useCurrency();
  const backerGivingStatsQuery = useBackerGivingStatsQuery(backerId);

  return matchQueryStatus(backerGivingStatsQuery, {
    Loading: (
      <div className="gf-grid gf-grid-cols-4 gf-gap-4">
        <Skeleton className="gf-h-[6.75rem] gf-w-full gf-rounded-sm" animate />
        <Skeleton className="gf-h-[6.75rem] gf-w-full gf-rounded-sm" animate />
        <Skeleton className="gf-h-[6.75rem] gf-w-full gf-rounded-sm" animate />
        <Skeleton className="gf-h-[6.75rem] gf-w-full gf-rounded-sm" animate />
      </div>
    ),
    Error: (
      <ErrorState className="gf-mt-10">
        <ErrorStateDescription>
          {__('Error loading backer giving stats', 'growfund')}
        </ErrorStateDescription>
      </ErrorState>
    ),
    Empty: (
      <EmptyState className="gf-mt-10">
        <EmptyStateDescription className="gf-flex gf-flex-col gf-items-center">
          {__('No backer giving stats', 'growfund')}
        </EmptyStateDescription>
      </EmptyState>
    ),
    Success: ({ data }) => {
      return (
        <div className="gf-space-y-4">
          <h5 className="gf-typo-h5 gf-text-fg-primary">{__('My giving stats', 'growfund')}</h5>
          <div className="gf-grid gf-grid-cols-4 gf-gap-4">
            <MetricsCard
              data={{
                label: __('Pledged Amount', 'growfund'),
                amount: toCurrencyCompact(data.pledged_amount),
              }}
            />
            <MetricsCard
              data={{
                label: __('Total Pledges', 'growfund'),
                amount: data.total_pledges.toString(),
              }}
            />
            <MetricsCard
              data={{
                label: __('Backed Amount', 'growfund'),
                amount: toCurrencyCompact(data.backed_amount),
              }}
            />
            <MetricsCard
              data={{
                label: __('Backed Campaigns', 'growfund'),
                amount: data.backed_campaigns.toString(),
              }}
            />
          </div>
        </div>
      );
    },
  });
};

export default BackerGivingStats;
