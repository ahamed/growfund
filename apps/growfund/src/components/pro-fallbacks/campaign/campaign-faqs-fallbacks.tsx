import { __ } from '@wordpress/i18n';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProBadge } from '@/components/ui/pro-badge';
import { Separator } from '@/components/ui/separator';

const CampaignFaqsFallbacks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {__('Frequently Asked Questions', 'growfund')} <ProBadge />
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="gf-mt-4 gf-space-y-3">
        <Button variant="secondary" className="gf-w-full" disabled>
          <Plus />
          {__('Add FAQ', 'growfund')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignFaqsFallbacks;
