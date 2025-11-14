import { __ } from '@wordpress/i18n';

import ProBanner from '@/components/pro-fallbacks/pro-banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { processSrc } from '@/components/ui/image';
import { InfoTooltip } from '@/components/ui/tooltip';

const RevenueBreakdownFallback = () => {
  return (
    <Card className="gf-group/donation-breakdown gf-rounded-3xl">
      <CardHeader className="gf-px-6">
        <CardTitle>
          {__('Revenue Breakdown', 'growfund')}
          <InfoTooltip>
            {__(
              'View detailed revenue breakdown data organized by date for the selected time period. This table provides insights into daily revenue patterns and trends.',
              'growfund',
            )}
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="gf-px-6">
        <div
          className="gf-relative gf-min-h-[28rem] gf-bg-no-repeat gf-bg-cover"
          style={{
            backgroundImage: `url('${processSrc('/images/revenue-breakdown-overlay.webp')}')`,
          }}
        >
          <div className="gf-z-10 gf-flex gf-items-center gf-justify-center gf-min-h-[28rem]">
            <ProBanner
              title={__('Turn insights into growth', 'growfund')}
              description={__(
                'Pro gives you deeper revenue breakdown to help you maximize performance and scale faster.',
                'growfund',
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownFallback;
