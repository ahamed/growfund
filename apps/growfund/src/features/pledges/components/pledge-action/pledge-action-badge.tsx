import { BadgeCheck, CircleDashed, CircleDollarSignIcon } from 'lucide-react';

import { type ActionVariant } from '@/features/pledges/components/pledge-action/pledge-action-types';
import { cn } from '@/lib/utils';

const PledgeActionBadge = ({ variant }: { variant?: ActionVariant }) => {
  if (!variant) {
    return null;
  }
  switch (variant) {
    case 'success':
      return (
        <div className="gf-size-4 gf-rounded-full gf-bg-background-fill-success-secondary gf-flex gf-items-center gf-justify-center">
          <span className={cn('gf-size-[6px] gf-rounded-full gf-bg-background-fill-brand')} />
        </div>
      );
    case 'backed':
      return <CircleDollarSignIcon className="gf-size-4 gf-text-icon-success" />;
    case 'completed':
      return <BadgeCheck className="gf-text-white gf-fill-fg-brand gf-size-4" />;
    case 'in-progress':
      return <CircleDashed className="gf-size-4 gf-text-border-warning" />;
    case 'critical':
      return (
        <div className="gf-size-4 gf-rounded-full gf-bg-background-fill-critical-secondary gf-flex gf-items-center gf-justify-center">
          <span className={cn('gf-size-[6px] gf-rounded-full gf-bg-background-fill-critical')} />
        </div>
      );
  }
};

export { PledgeActionBadge };
