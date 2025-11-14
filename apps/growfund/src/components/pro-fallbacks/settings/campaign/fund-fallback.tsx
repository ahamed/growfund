import { __ } from '@wordpress/i18n';

import { ProSwitchInput } from '@/components/pro-fallbacks/form/pro-switch-input';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProBadge } from '@/components/ui/pro-badge';

const CampaignSettingsFundFallback = () => {
  return (
    <Card>
      <CardHeader>
        <div className="gf-flex gf-items-center gf-justify-between">
          <CardTitle>
            {__('Fund', 'growfund')} <ProBadge />
          </CardTitle>
          <ProSwitchInput />
        </div>
        <CardDescription>
          {__(
            'Choose whether fund functionality will be available on all campaigns by default.',
            'growfund',
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CampaignSettingsFundFallback;
