import { __ } from '@wordpress/i18n';

import { ProSwitchInput } from '@/components/pro-fallbacks/form/pro-switch-input';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProBadge } from '@/components/ui/pro-badge';

const PdfReceiptSettingsAnnualReceiptFallback = () => {
  return (
    <Card>
      <CardHeader className="gf-p-5">
        <div className="gf-flex gf-items-center gf-justify-between">
          <CardTitle>
            {__('Annual Receipt', 'growfund')} <ProBadge />
          </CardTitle>
          <ProSwitchInput />
        </div>
        <CardDescription>
          {__(
            'Enable this option to allow donors to download their annual donation receipts from their dashboard.',
            'growfund',
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default PdfReceiptSettingsAnnualReceiptFallback;
