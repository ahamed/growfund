import { __ } from '@wordpress/i18n';
import { format } from 'date-fns';

import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { useAppConfig } from '@/contexts/app-config';
import { type PdfReceiptTemplate } from '@/features/settings/schemas/pdf-receipt';
import { useCurrency } from '@/hooks/use-currency';
import { DATE_FORMATS } from '@/lib/date';
import { isDefined } from '@/utils';

const PdfReceiptPreview = ({ pdfReceipt }: { pdfReceipt: PdfReceiptTemplate }) => {
  const { isDonationMode } = useAppConfig();
  const { toCurrency } = useCurrency();

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
              className="gf-border-none gf-bg-transparent"
            />
          </div>
        )}
        <div className="gf-flex gf-items-center gf-justify-center">
          <h3 className="gf-typo-h3" style={{ color: pdfReceipt.colors?.primary_text ?? '' }}>
            {__('DONATION RECEIPT', 'growfund')}
          </h3>
        </div>
      </div>
      <Separator />
      <div className="gf-my-8 gf-px-12 gf-space-y-4">
        {isDefined(pdfReceipt.content) && (
          <div dangerouslySetInnerHTML={{ __html: pdfReceipt.content.greetings }} />
        )}
        <div className="gf-bg-secondary gf-rounded-lg gf-p-4 gf-flex gf-items-center gf-justify-between">
          <div>
            <p className="gf-typo-tiny" style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}>
              {__('Donation Amount', 'growfund')}
            </p>
            <h3 className="gf-typo-h3" style={{ color: pdfReceipt.colors?.primary_text ?? '' }}>
              {toCurrency(300)}
            </h3>
          </div>
          <div>
            <p className="gf-typo-tiny" style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}>
              {__('Date & Time', 'growfund')}
            </p>
            <p className="gf-typo-small" style={{ color: pdfReceipt.colors?.primary_text ?? '' }}>
              {format(new Date(), DATE_FORMATS.LOCALIZED_DATE_TIME)}
            </p>
          </div>
        </div>
        <div className="gf-space-y-4">
          <p className="gf-typo-small" style={{ color: pdfReceipt.colors?.primary_text ?? '' }}>
            {__('Donation Details', 'growfund')}
          </p>
          <div className="gf-space-y-1">
            <p className="gf-typo-small" style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}>
              {__('Donar Name', 'growfund')}
            </p>
            <p
              className="gf-typo-small gf-font-semibold"
              style={{ color: pdfReceipt.colors?.primary_text ?? '' }}
            >
              Alex Jhonson
            </p>
          </div>
          <div className="gf-space-y-1">
            <p className="gf-typo-small" style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}>
              {__('Donation To', 'growfund')}
            </p>
            <p
              className="gf-typo-small gf-font-semibold"
              style={{ color: pdfReceipt.colors?.primary_text ?? '' }}
            >
              Wildfire Relief Fund 2024
            </p>
          </div>
          <div className="gf-items-center gf-grid gf-grid-cols-2">
            <div className="gf-space-y-1">
              <p
                className="gf-typo-small"
                style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}
              >
                {__('Transaction ID', 'growfund')}
              </p>
              <p
                className="gf-typo-small gf-font-semibold"
                style={{ color: pdfReceipt.colors?.primary_text ?? '' }}
              >
                TXN-987654321
              </p>
            </div>
            <div className="gf-space-y-1">
              <p
                className="gf-typo-small"
                style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}
              >
                {__('Payment Method', 'growfund')}
              </p>
              <p
                className="gf-typo-small gf-font-semibold"
                style={{ color: pdfReceipt.colors?.primary_text ?? '' }}
              >
                Credit Card
              </p>
            </div>
          </div>
        </div>
        {isDefined(pdfReceipt.content) && pdfReceipt.content.tax_information?.is_available && (
          <div>
            <blockquote className="gf-p-4 gf-my-8 gf-rounded-r-lg gf-border-s-4 gf-border-background-fill-brand gf-bg-secondary">
              <p
                className="gf-typo-tiny"
                style={{ color: pdfReceipt.colors?.secondary_text ?? '' }}
              >
                {__('Tax Information', 'growfund')}
              </p>
              <div
                className="gf-mt-4"
                style={{ color: pdfReceipt.colors?.primary_text ?? '' }}
                dangerouslySetInnerHTML={{
                  __html: pdfReceipt.content.tax_information.details ?? '',
                }}
              />
            </blockquote>
          </div>
        )}

        {isDonationMode &&
          isDefined(pdfReceipt.content) &&
          isDefined(pdfReceipt.content.signature) &&
          pdfReceipt.content.signature.is_available && (
            <div className="gf-space-y-2">
              <p className="gf-typo-small" style={{ color: pdfReceipt.colors?.primary_text ?? '' }}>
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

export default PdfReceiptPreview;
