import { __ } from '@wordpress/i18n';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProBadge } from '@/components/ui/pro-badge';
import { DATE_FORMATS } from '@/lib/date';
import { isDefined } from '@/utils';

const CampaignLaunchDateFallback = ({ defaultValue }: { defaultValue?: Date | null }) => {
  return (
    <div className="gf-space-y-1 gf-w-full">
      <div className="gf-typo-small gf-font-medium gf-text-fg-primary gf-flex gf-items-center gf-gap-1">
        {__('Launch Date', 'growfund')} <ProBadge />
      </div>
      <Button
        variant="outline"
        className="gf-w-full gf-justify-start gf-text-left gf-font-normal gf-px-3 hover:gf-bg-background-surface gf-bg-background-white gf-opacity-50"
      >
        <CalendarIcon />
        {isDefined(defaultValue)
          ? format(defaultValue, DATE_FORMATS.DATE_FIELD)
          : __('Pick a date', 'growfund')}
      </Button>
    </div>
  );
};

export default CampaignLaunchDateFallback;
