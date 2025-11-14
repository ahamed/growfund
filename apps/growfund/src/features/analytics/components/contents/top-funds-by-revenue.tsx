import { __ } from '@wordpress/i18n';
import { FileText } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { EmptySearchIcon2 } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { LoadingSkeleton } from '@/components/layouts/loading-skeleton';
import { Box, BoxContent, BoxTitle } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RouteConfig } from '@/config/route-config';
import {
  type AnalyticsFilter,
  AnalyticType,
  type TopFunds,
} from '@/features/analytics/schemas/analytics';
import { useAnalyticsQuery } from '@/features/analytics/services/analytics';
import { useCurrency } from '@/hooks/use-currency';
import { useDebounce } from '@/hooks/use-debounce';
import { toQueryParamSafe } from '@/lib/date';

const TopFundsByRevenue = () => {
  const { toCurrency } = useCurrency();
  const navigate = useNavigate();
  const form = useFormContext<AnalyticsFilter>();

  const dateRange = useDebounce(useWatch({ control: form.control, name: 'date_range' }));

  const topFunds = useAnalyticsQuery<TopFunds[]>(AnalyticType.TopFunds, {
    start_date: dateRange?.from ? toQueryParamSafe(dateRange.from) : undefined,
    end_date: dateRange?.to ? toQueryParamSafe(dateRange.to) : undefined,
  });

  const funds = useMemo(() => {
    if (!topFunds.data) return [];

    return topFunds.data;
  }, [topFunds.data]);

  const highestRaisedFund = useMemo(() => {
    if (!topFunds.data) return 0;

    return Math.max(...topFunds.data.map((fund) => fund.fund_raised));
  }, [topFunds.data]);

  const progressPercentage = useCallback(
    (raised_amount: number) => {
      return (raised_amount / highestRaisedFund) * 100;
    },
    [highestRaisedFund],
  );

  if (funds.length === 0) {
    return (
      <Box className="gf-rounded-3xl">
        <BoxContent className="gf-px-6 gf-py-4 gf-h-full gf-overflow-hidden">
          <BoxTitle>{__('Top Funds by Revenue', 'growfund')}</BoxTitle>
          <EmptyState className="gf-h-full gf-shadow-none gf-pt-0">
            <EmptySearchIcon2 />
            <EmptyStateDescription>{__('No data found.', 'growfund')}</EmptyStateDescription>
          </EmptyState>
        </BoxContent>
      </Box>
    );
  }

  return (
    <Box className="gf-rounded-3xl">
      <BoxContent className="gf-px-6 gf-py-4">
        <BoxTitle className="gf-justify-between">
          <span>{__('Top Funds by Revenue', 'growfund')}</span>
          <Button
            variant="ghost"
            size="sm"
            className="gf-opacity-0 group-hover/box:gf-opacity-100"
            onClick={() => {
              void navigate(RouteConfig.Funds.buildLink());
            }}
          >
            <FileText className="gf-size-4" />
            {__('See All Funds', 'growfund')}
          </Button>
        </BoxTitle>
        <div className="gf-space-y-1 gf-mt-4">
          <LoadingSkeleton
            loading={topFunds.isFetching || topFunds.isLoading}
            className="gf-w-full"
            skeletonClassName="gf-w-56"
          >
            {funds.map((fund, index) => {
              return (
                <div key={index} className=" gf-w-full gf-space-y-0.5">
                  <div className="gf-flex gf-items-center gf-justify-between gf-gap-8">
                    <div className="gf-typo-tiny gf-break-all gf-line-clamp-1">
                      {fund.fund_title}
                    </div>
                    <div className="gf-typo-tiny">{toCurrency(fund.fund_raised)}</div>
                  </div>
                  <Progress
                    value={progressPercentage(fund.fund_raised)}
                    size="sm"
                    className="gf-h-0.5 gf-bg-background-fill-caution"
                  />
                </div>
              );
            })}
          </LoadingSkeleton>
        </div>
      </BoxContent>
    </Box>
  );
};

export default TopFundsByRevenue;
