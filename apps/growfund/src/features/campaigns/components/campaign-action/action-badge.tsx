import { BadgeCheck, EyeOff, PartyPopper } from 'lucide-react';

import { EndFlagIcon } from '@/app/icons';
import { type ActionVariant } from '@/features/campaigns/components/campaign-action/campaign-action-types';
import { cn } from '@/lib/utils';

const ActionBadge = ({ variant }: { variant?: ActionVariant }) => {
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
    case 'secondary':
      return (
        <div className="gf-size-4 gf-rounded-full gf-bg-background-fill-secondary-hover gf-flex gf-items-center gf-justify-center">
          <span className={cn('gf-size-[6px] gf-rounded-full gf-bg-background-fill-disabled')} />
        </div>
      );
    case 'ended':
      return <EndFlagIcon className="gf-size-4" />;
    case 'completed':
      return <BadgeCheck className="gf-text-white gf-fill-fg-brand gf-size-4" />;
    case 'funded':
      return <PartyPopper className="gf-text-icon-brand gf-size-4" />;
    case 'hidden':
      return <EyeOff className="gf-text-icon-primary gf-size-4" />;
  }
};

export { ActionBadge };
