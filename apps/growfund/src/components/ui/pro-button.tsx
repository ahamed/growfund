import { __ } from '@wordpress/i18n';
import { Crown } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ProButton = () => {
  return (
    <Button className="gf-rounded-full gf-bg-gradient-to-r gf-from-[#FFF9BF] gf-to-[#FFB413] gf-border gf-border-[#FFBC07] gf-bg-black gf-text-[#FFC105] hover:gf-bg-opacity-75">
      <Crown size={16} />
      {__('Upgrade to Pro', 'growfund')}
    </Button>
  );
};

export { ProButton };
