import { PDFDownloadLink } from '@react-pdf/renderer';
import { __, sprintf } from '@wordpress/i18n';
import { format } from 'date-fns';
import { DownloadIcon, HeartHandshake } from 'lucide-react';
import React, { useMemo } from 'react';

import { SpecialTributeIcon } from '@/app/icons';
import DonationStatusBadge from '@/components/donation-status-badge';
import PaymentStatusBadge from '@/components/payment-status-badge';
import PdfDonationContent from '@/components/pdf/contents/pdf-donation-content';
import PdfReceiptDocument from '@/components/pdf/pdf-receipt-document';
import { Badge } from '@/components/ui/badge';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { OptionKeys } from '@/constants/option-keys';
import { useAppConfig } from '@/contexts/app-config';
import { type Donation } from '@/features/donations/schemas/donation';
import { AppConfigKeys } from '@/features/settings/context/settings-context';
import { type PdfReceiptTemplate } from '@/features/settings/schemas/pdf-receipt';
import { useCurrency } from '@/hooks/use-currency';
import { DATE_FORMATS } from '@/lib/date';
import { cn, shortcodeReplacement } from '@/lib/utils';
import { useGetOptionQuery } from '@/services/app-config';
import { emptyCell, isDefined } from '@/utils';

const DonationDetailsDialog = ({
  children,
  open,
  onOpenChange,
  donation,
}: React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: Donation;
}>) => {
  const { toCurrency } = useCurrency();
  const { appConfig } = useAppConfig();

  const pdfReceiptTemplateQuery = useGetOptionQuery(OptionKeys.PDF_DONATION_RECEIPT_TEMPLATE);
  const defaultPdfTemplate = useMemo(() => {
    if (!isDefined(pdfReceiptTemplateQuery.data) || !isDefined(donation)) {
      return undefined;
    }

    const pdfReceiptTemplate = pdfReceiptTemplateQuery.data as PdfReceiptTemplate;

    const replacement = {
      campaign_name: donation.campaign.title,
      fund_name: donation.fund?.title ?? emptyCell(2),
      donor_name: sprintf('%s %s', donation.donor.first_name, donation.donor.last_name),
      donation_amount: toCurrency(donation.amount),
      payment_method: donation.payment_method.label,
      donation_date_time: format(donation.created_at, DATE_FORMATS.DATE_TIME),
    };

    pdfReceiptTemplate.content.greetings = shortcodeReplacement(
      pdfReceiptTemplate.short_codes?.filter((shortcode) => {
        if (shortcode.value === '{fund_name}') {
          return appConfig[AppConfigKeys.Campaign]?.allow_fund;
        }
        return true;
      }) ?? [],
      pdfReceiptTemplate.content.greetings,
      replacement,
    );

    return pdfReceiptTemplate;
  }, [pdfReceiptTemplateQuery.data, donation, toCurrency, appConfig]);

  const paymentData: { label: string; value: number; className?: string }[] = [
    {
      label: __('Donation Amount', 'growfund'),
      value: donation.amount,
    },
    {
      label: __('Total', 'growfund'),
      value: donation.amount,
      className: 'gf-font-bold gf-text-fg-primary gf-pt-1',
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gf-max-w-[33rem] gf-max-h-[90svh] gf-mb-4 gf-flex gf-flex-col">
        <DialogHeader>
          <DialogTitle className="gf-flex gf-items-center gf-gap-2">
            <HeartHandshake className="gf-size-6 gf-text-icon-primary" />
            {__('Donation Details', 'growfund')}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="gf-p-4 gf-pt-0 gf-space-y-2 gf-overflow-y-auto gf-flex-1 gf-hide-scrollbar">
          <div className="gf-flex gf-items-center gf-justify-between">
            <div className="gf-typo-tiny gf-text-fg-primary gf-flex gf-items-center gf-gap-1">
              <span>{__('Created on', 'growfund')}</span>
              <span className="gf-text-fg-muted-foreground">
                {format(donation.created_at, DATE_FORMATS.HUMAN_READABLE_DATE_WITH_TIME)}
              </span>
            </div>
            <DonationStatusBadge status={donation.status} />
          </div>
          <div className="gf-space-y-4">
            {/* Campaign card */}
            <Box className="gf-border-border-secondary gf-shadow-none">
              <BoxContent className="gf-p-2 gf-grid gf-grid-cols-[3.5rem_auto] gf-gap-3">
                <Image
                  src={donation.campaign.images?.[0]?.url ?? null}
                  alt={donation.campaign.title}
                  className="gf-w-full"
                  fit="cover"
                  aspectRatio="square"
                />
                <div className="gf-space-y-2">
                  <p className="gf-typo-small gf-font-medium gf-text-fg-primary">
                    {donation.campaign.title}
                  </p>
                  <div className="gf-typo-tiny gf-text-fg-secondary gf-flex gf-items-center gf-gap-1">
                    {__('by', 'growfund')}
                    <span className="gf-text-fg-brand gf-capitalize">
                      {donation.campaign.created_by}
                    </span>
                  </div>
                </div>
              </BoxContent>
            </Box>

            {/* Donation card */}
            <Box className="gf-border-border-secondary gf-shadow-none">
              <BoxContent className="gf-p-4 gf-flex gf-items-center gf-justify-between gf-gap-3">
                <div className="gf-space-y-2">
                  <p className="gf-typo-small gf-text-fg-secondary">
                    {__('Donation Amount', 'growfund')}
                  </p>
                  <div className="gf-typo-h3 gf-text-fg-primary">{toCurrency(donation.amount)}</div>
                  {isDefined(donation.tribute_type) && (
                    <div className="gf-w-full gf-flex gf-items-center gf-gap-1">
                      <SpecialTributeIcon className="gf-size-4" />
                      <span className="gf-typo-tiny gf-text-fg-special">
                        {sprintf(
                          /* translators: 1: Tribute type 2: Tribute salutation 3: Tribute to */
                          __('Tribute %1$s %2$s %3$s', 'growfund'),
                          donation.tribute_type,
                          donation.tribute_salutation,
                          donation.tribute_to,
                        )}
                      </span>
                    </div>
                  )}
                </div>
                {isDefined(donation.tribute_notification_type) && (
                  <div className="gf-space-y-2">
                    <p className="gf-typo-small gf-text-fg-secondary">
                      {__('Tribute Card Recipient', 'growfund')}
                    </p>
                    <div className="gf-type-h6">{donation.tribute_notification_recipient_name}</div>
                    <div className="gf-flex gf-items-center gf-gap-1">
                      <div>{__('via', 'growfund')}</div>
                      {(donation.tribute_notification_type === 'send-ecard' ||
                        donation.tribute_notification_type === 'send-ecard-and-post-mail') && (
                        <Badge variant={'secondary'} className="gf-bg-background-fill-secondary">
                          {__('e-card', 'growfund')}
                        </Badge>
                      )}

                      {(donation.tribute_notification_type === 'send-post-mail' ||
                        donation.tribute_notification_type === 'send-ecard-and-post-mail') && (
                        <Badge variant={'secondary'} className="gf-bg-background-fill-secondary">
                          {__('post mail', 'growfund')}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </BoxContent>
            </Box>

            <Box className="gf-border-border-secondary gf-shadow-none gf-mb-10">
              <BoxContent className="gf-space-y-3">
                <div className="gf-flex gf-items-center gf-justify-between">
                  <h6 className="gf-typo-h6 gf-text-fg-primary">{__('Payment', 'growfund')}</h6>
                  <PaymentStatusBadge status={donation.payment_status ?? 'unpaid'} />
                </div>

                <Box>
                  <BoxContent className="gf-space-y-2 gf-p-3">
                    {paymentData.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className={cn(
                            'gf-flex gf-items-center gf-justify-between gf-typo-small gf-font-medium gf-text-fg-secondary',
                            data.className,
                          )}
                        >
                          <p>{data.label}</p>
                          <p>{toCurrency(data.value)}</p>
                        </div>
                      );
                    })}
                  </BoxContent>
                </Box>
              </BoxContent>
            </Box>
          </div>
        </div>
        {donation.status === 'completed' && (
          <DialogFooter className="gf-bg-background-surface-secondary">
            <PDFDownloadLink
              document={
                <PdfReceiptDocument
                  pdfReceiptTemplate={defaultPdfTemplate}
                  toCurrency={toCurrency}
                  appConfig={appConfig}
                >
                  <PdfDonationContent donation={donation} />
                </PdfReceiptDocument>
              }
              fileName={sprintf(
                /* translators: 1: Donation ID 2: current time */
                'donation-receipt-%1$s-%2$s.pdf',
                donation.id,
                format(new Date(), DATE_FORMATS.TIME),
              )}
            >
              <Button
                variant="ghost"
                className="gf-bg-background-fill gf-border-border gf-py-2 gf-px-4 gf-h-9"
              >
                <DownloadIcon />
                {__('Download PDF Receipt', 'growfund')}
              </Button>
            </PDFDownloadLink>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationDetailsDialog;
