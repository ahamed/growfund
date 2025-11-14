import { __ } from '@wordpress/i18n';

import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { useAppConfig } from '@/contexts/app-config';
import { type PdfReceiptTemplate } from '@/features/settings/schemas/pdf-receipt';
import { useCurrency } from '@/hooks/use-currency';
import { isDefined } from '@/utils';

const DonationsTable = ({ pdfReceipt }: { pdfReceipt: PdfReceiptTemplate }) => {
  const primaryTextColor = pdfReceipt.colors?.primary_text ?? '#000000';
  const secondaryTextColor = pdfReceipt.colors?.secondary_text ?? '#636363';
  const { toCurrency } = useCurrency();
  return (
    <div className="gf-w-full gf-flex gf-flex-col gf-gap-4 gf-py-6">
      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: secondaryTextColor }}
      >
        <div className="gf-w-32">{__('Date', 'growfund')}</div>
        <div className="gf-w-24">{__('Amount', 'growfund')}</div>
        <div className="gf-w-28">{__('Donation ID', 'growfund')}</div>
        <div>{__('Payment Method', 'growfund')}</div>
      </div>

      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: primaryTextColor }}
      >
        <div className="gf-w-32">{__('Jan 5, 2025', 'growfund')}</div>
        <div className="gf-w-24">{toCurrency(100)}</div>
        <div className="gf-w-28">{564}</div>
        <div className="gf-font-light" style={{ color: secondaryTextColor }}>
          {__('Bank Transfer', 'growfund')}
        </div>
      </div>

      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: primaryTextColor }}
      >
        <div className="gf-w-32">{__('Feb 5, 2025', 'growfund')}</div>
        <div className="gf-w-24">{toCurrency(100)}</div>
        <div className="gf-w-28">{563}</div>
        <div className="gf-font-light" style={{ color: secondaryTextColor }}>
          {__('Bank Transfer', 'growfund')}
        </div>
      </div>

      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: primaryTextColor }}
      >
        <div className="gf-w-32">{__('Mar 5, 2025', 'growfund')}</div>
        <div className="gf-w-24">{toCurrency(100)}</div>
        <div className="gf-w-28">{562}</div>
        <div className="gf-font-light" style={{ color: secondaryTextColor }}>
          {__('Bank Transfer', 'growfund')}
        </div>
      </div>

      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: primaryTextColor }}
      >
        <div className="gf-w-32">{__('Apr 5, 2025', 'growfund')}</div>
        <div className="gf-w-24">{toCurrency(100)}</div>
        <div className="gf-w-28">{561}</div>
        <div className="gf-font-light" style={{ color: secondaryTextColor }}>
          {__('Bank Transfer', 'growfund')}
        </div>
      </div>

      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: primaryTextColor }}
      >
        <div className="gf-w-32">{__('May 5, 2025', 'growfund')}</div>
        <div className="gf-w-24">{toCurrency(100)}</div>
        <div className="gf-w-28">{560}</div>
        <div className="gf-font-light" style={{ color: secondaryTextColor }}>
          {__('Bank Transfer', 'growfund')}
        </div>
      </div>

      <div
        className="gf-w-full gf-flex gf-justify-stretch gf-gap-2 gf-typo-small"
        style={{ color: primaryTextColor }}
      >
        <div className="gf-w-32">{__('Jun 5, 2025', 'growfund')}</div>
        <div className="gf-w-24">{toCurrency(100)}</div>
        <div className="gf-w-28">{559}</div>
        <div className="gf-font-light" style={{ color: secondaryTextColor }}>
          {__('Bank Transfer', 'growfund')}
        </div>
      </div>
    </div>
  );
};

const PdfAnnualReceiptPreview = ({ pdfReceipt }: { pdfReceipt: PdfReceiptTemplate }) => {
  const { isDonationMode } = useAppConfig();
  const primaryTextColor = pdfReceipt.colors?.primary_text ?? '#000000';

  return (
    <Box
      className="gf-overflow-hidden gf-text-black"
      style={{ backgroundColor: pdfReceipt.colors?.background ?? '' }}
    >
      <div className="gf-w-full gf-my-8 gf-p-2 lg:gf-px-12 gf-space-y-4">
        {isDefined(pdfReceipt.media) && pdfReceipt.media.image?.url && (
          <div
            className="gf-w-full gf-flex"
            style={{
              justifyContent: pdfReceipt.media.position,
              height: pdfReceipt.media.height ? `${pdfReceipt.media.height}px` : '',
            }}
          >
            <Image
              src={pdfReceipt.media.image.url}
              alt="Logo"
              rounded="none"
              style={{ height: pdfReceipt.media.height ? `${pdfReceipt.media.height}px` : '' }}
            />
          </div>
        )}
        <div className="gf-flex gf-items-center gf-justify-center">
          <h3 className="gf-typo-h3" style={{ color: primaryTextColor }}>
            {__('ANNUAL RECEIPT', 'growfund')}
          </h3>
        </div>
      </div>
      <Separator />
      <div className="gf-my-8 gf-px-12 gf-space-y-4">
        {isDefined(pdfReceipt.content) && (
          <div dangerouslySetInnerHTML={{ __html: pdfReceipt.content.greetings }} />
        )}

        <DonationsTable pdfReceipt={pdfReceipt} />

        <div className="gf-typo-paragraph gf-pt-6" style={{ color: primaryTextColor }}>
          {__('No goods or services were exchanged for these contributions.', 'growfund')}
        </div>

        {isDonationMode &&
          isDefined(pdfReceipt.content) &&
          isDefined(pdfReceipt.content.signature) &&
          pdfReceipt.content.signature.is_available && (
            <div className="gf-space-y-2">
              <p className="gf-typo-small" style={{ color: primaryTextColor }}>
                {__('Sincerely', 'growfund')}
              </p>
              {pdfReceipt.content.signature.image?.url && (
                <div className="gf-w-full gf-flex gf-justify-start gf-my-4">
                  <Image
                    src={pdfReceipt.content.signature.image.url}
                    alt="signature"
                    rounded="none"
                    className="gf-max-h-24 gf-max-w-24 gf-bg-transparent gf-border-none"
                  />
                </div>
              )}
              {isDefined(pdfReceipt.content.signature.details) && (
                <div dangerouslySetInnerHTML={{ __html: pdfReceipt.content.signature.details }} />
              )}
            </div>
          )}
      </div>
      <Separator />
      <div className="gf-my-4 gf-p-2 lg:gf-px-12">
        {isDefined(pdfReceipt.content) && isDefined(pdfReceipt.content.footer) && (
          <div dangerouslySetInnerHTML={{ __html: pdfReceipt.content.footer }} />
        )}
      </div>
    </Box>
  );
};

export default PdfAnnualReceiptPreview;
