import { __ } from '@wordpress/i18n';

import ProBanner from '@/components/pro-fallbacks/pro-banner';
import { processSrc } from '@/components/ui/image';

const DonationListFallback = () => {
  return (
    <div className="gf-relative gf-min-h-[34rem] gf-bg-no-repeat gf-bg-contain gf-bg-center overflow-hidden">
      <div
        className="gf-absolute gf-inset-0 gf-bg-no-repeat gf-bg-contain gf-bg-center gf-min-h-[34rem]"
        style={{
          backgroundImage: `url('${processSrc('/images/table-overlay.webp')}')`,
          opacity: 0.2,
        }}
      ></div>
      <div className="gf-relative gf-z-10 gf-flex gf-items-center gf-justify-center gf-min-h-[34rem]">
        <ProBanner
          title={__('Turn insights into growth', 'growfund')}
          description={__(
            'Pro gives you deeper donor overview to help you maximize performance and scale faster.',
            'growfund',
          )}
        />
      </div>
    </div>
  );
};

export default DonationListFallback;
