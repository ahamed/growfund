import { cva, type VariantProps } from 'class-variance-authority';
import { MinusIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

import { ProBadge } from '@/components/ui/pro-badge';
import { InfoTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const metricsCardVariants = cva(
  'gf-p-6 gf-rounded-md gf-w-full gf-flex gf-flex-col gf-gap-2 gf-group/metric-card',
  {
    variants: {
      variant: {
        default: 'gf-bg-background-fill',
        primary: 'gf-bg-[#E3F5FF]',
        secondary: 'gf-bg-background-fill-secondary',
        success: 'gf-bg-[#DFF4E9]',
        warning: 'gf-bg-[#FFF4C2]',
        critical: 'gf-bg-[#FFEBE2]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface MetricsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricsCardVariants> {
  data: {
    label: string;
    amount: string;
    growth?: number;
    tooltip?: string | React.ReactNode;
  };
  isPro?: boolean;
}

const GrowthIcon = ({ growth }: { growth: number }) => {
  if (growth === 0) {
    return <MinusIcon className="gf-text-icon-secondary gf-size-6" />;
  }
  if (growth > 0) {
    return <TrendingUp className="gf-text-icon-success gf-size-6" />;
  }
  return <TrendingDown className="gf-text-icon-critical gf-size-6" />;
};

const MetricsCard = React.forwardRef<HTMLDivElement, MetricsCardProps>(
  ({ className, variant, data, isPro = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(metricsCardVariants({ variant }), className)} {...props}>
        <p
          className="gf-typo-small gf-font-medium gf-text-fg-secondary gf-flex gf-items-center gf-gap-2 [&>[data-type=tooltip]]:gf-opacity-0 group-hover/metric-card:[&>[data-type=tooltip]]:gf-opacity-100 gf-transition-opacity"
          title={data.label}
        >
          <span className="gf-truncate">
            {data.label} {isPro && <ProBadge />}
          </span>
          {data.tooltip && <InfoTooltip>{data.tooltip}</InfoTooltip>}
        </p>
        <div className="gf-flex gf-items-center gf-gap-2">
          <div
            className={cn(
              'gf-typo-h3 gf-font-medium gf-text-fg-primary',
              isPro &&
                'gf-bg-gradient-to-b gf-from-black gf-to-white gf-bg-clip-text gf-text-transparent gf-opacity-10',
            )}
          >
            {data.amount}
          </div>

          {isDefined(data.growth) && (
            <div
              className={cn(
                'gf-typo-tiny gf-text-fg-secondary gf-flex gf-items-center gf-gap-2',
                isPro && 'gf-opacity-20',
              )}
            >
              <span>
                {data.growth > 0 ? '+' : ''}
                {data.growth}%
              </span>
              <GrowthIcon growth={data.growth} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

MetricsCard.displayName = 'MetricsCard';
type MetricsCardVariants = VariantProps<typeof metricsCardVariants>;

export { MetricsCard, type MetricsCardVariants };
