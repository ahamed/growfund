import { __ } from '@wordpress/i18n';

import ProBanner from '@/components/pro-fallbacks/pro-banner';
import { processSrc } from '@/components/ui/image';

const CampaignDetailsFallback = () => {
  return (
    <div
      className="gf-relative gf-min-h-[28rem] gf-bg-no-repeat gf-bg-cover"
      style={{
        backgroundImage: `url('${processSrc('/images/campaign-overview-overlay.webp')}')`,
      }}
    >
      <div className="gf-z-10 gf-flex gf-items-center gf-justify-center gf-min-h-[28rem]">
        <ProBanner
          title={__('Turn insights into growth', 'growfund')}
          description={__(
            'Pro gives you deeper campaign overview to help you maximize performance and scale faster.',
            'growfund',
          )}
        />
      </div>
    </div>
  );
};

export default CampaignDetailsFallback;
