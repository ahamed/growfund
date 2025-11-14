import { __ } from '@wordpress/i18n';
import { FileText } from 'lucide-react';

import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { processSrc } from '@/components/ui/image';
import { ProBadge } from '@/components/ui/pro-badge';

const ActivityLogFallback = () => {
  return (
    <Box className="gf-border-none">
      <BoxContent className="gf-p-5">
        <div className="gf-flex gf-items-center gf-justify-between">
          <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary">
            {__('Activity Logs', 'growfund')} <ProBadge />
          </h6>
          <Button
            variant="ghost"
            size="sm"
          >
            <FileText />
            {__('See All Logs', 'growfund')}
          </Button>
        </div>
        <div
          className="gf-relative gf-min-h-52 gf-bg-no-repeat gf-bg-contain gf-mt-4"
          style={{
            backgroundImage: `url('${processSrc('/images/activity-log-overlay.webp')}')`,
          }}
        ></div>
      </BoxContent>
    </Box>
  );
};

export default ActivityLogFallback;
