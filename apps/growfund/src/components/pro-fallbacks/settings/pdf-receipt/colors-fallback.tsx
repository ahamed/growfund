import { __ } from '@wordpress/i18n';

import { ProColorPickerInput } from '@/components/pro-fallbacks/form/pro-color-picker-input';
import { Box, BoxContent, BoxTitle } from '@/components/ui/box';
import { ProBadge } from '@/components/ui/pro-badge';

const PdfReceiptSettingsColorsFallback = () => {
  return (
    <Box className="gf-p-4">
      <BoxTitle>
        {__('Colors', 'growfund')} <ProBadge />
      </BoxTitle>
      <p className="gf-typo-small gf-text-fg-secondary gf-mt-1">
        {__('Style how the pdf will look', 'growfund')}
      </p>
      <BoxContent className="gf-p-0 gf-mt-4 gf-space-y-4">
        {[
          __('Background', 'growfund'),
          __('Primary Text', 'growfund'),
          __('Secondary Text', 'growfund'),
        ].map((color, index) => (
          <ProColorPickerInput key={index} label={color} />
        ))}
      </BoxContent>
    </Box>
  );
};

export default PdfReceiptSettingsColorsFallback;
