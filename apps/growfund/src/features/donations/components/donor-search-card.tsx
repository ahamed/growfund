import { __ } from '@wordpress/i18n';

import { Box, BoxContent } from '@/components/ui/box';
import { Input } from '@/components/ui/input';

const DonorSearchCard = () => {
  return (
    <Box className="">
      <BoxContent>
        <div className="gf-flex gf-items-center gf-justify-between gf-min-h-9">
          <h6 className="gf-typo-h6 gf-font-medium gf-text-fg-primary">
            {__('Donor', 'growfund')}
          </h6>
        </div>
        <Input type="text" placeholder={__('Search Donor', 'growfund')} />
      </BoxContent>
    </Box>
  );
};

export default DonorSearchCard;
