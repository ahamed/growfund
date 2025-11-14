import { PDFDownloadLink } from '@react-pdf/renderer';
import { __, _n, sprintf } from '@wordpress/i18n';
import { format } from 'date-fns';
import { DownloadIcon, HeartHandshake } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import PaymentStatusBadge from '@/components/payment-status-badge';
import PDFPledgeWithRewardContent from '@/components/pdf/contents/pdf-pledge-with-reward-content';
import PdfPledgeWithoutRewardContent from '@/components/pdf/contents/pdf-pledge-without-reward-content';
import PdfReceiptDocument from '@/components/pdf/pdf-receipt-document';
import PledgeStatusBadge from '@/components/pledge-status-badge';
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
import { type Pledge } from '@/features/pledges/schemas/pledge';
import { type PdfReceiptTemplate } from '@/features/settings/schemas/pdf-receipt';
import { useCurrency } from '@/hooks/use-currency';
import { DATE_FORMATS } from '@/lib/date';
import { cn, shortcodeReplacement } from '@/lib/utils';
import { useGetOptionQuery } from '@/services/app-config';
import { emptyCell, isDefined } from '@/utils';

const MAX_ITEMS_TO_SHOW = 2;

const PledgeDetailsDialog = ({
  children,
  open,
  onOpenChange,
  pledge,
}: React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pledge: Pledge;
}>) => {
  const { appConfig } = useAppConfig();
  const [showMore, setShowMore] = useState(false);
  const { toCurrency } = useCurrency();

  const pdfReceiptTemplateQuery = useGetOptionQuery(OptionKeys.PDF_PLEDGE_RECEIPT_TEMPLATE);
  const defaultPdfTemplate = useMemo(() => {
    if (!isDefined(pdfReceiptTemplateQuery.data) || !isDefined(pledge)) {
      return undefined;
    }

    const pdfReceiptTemplate = pdfReceiptTemplateQuery.data as PdfReceiptTemplate;

    const replacement = {
      campaign_name: pledge.campaign.title,
      backer_name: sprintf('%s %s', pledge.backer.first_name, pledge.backer.last_name),
      pledge_amount: isDefined(pledge.payment.total)
        ? toCurrency(pledge.payment.total)
        : emptyCell(2),
      payment_method: pledge.payment.payment_method.label,
      pledge_date_time: isDefined(pledge.created_at)
        ? format(pledge.created_at, DATE_FORMATS.HUMAN_READABLE_FULL_DATE_TIME)
        : emptyCell(2),
    };

    pdfReceiptTemplate.content.greetings = shortcodeReplacement(
      pdfReceiptTemplate.short_codes ?? [],
      pdfReceiptTemplate.content.greetings,
      replacement,
    );

    return pdfReceiptTemplate;
  }, [pdfReceiptTemplateQuery.data, pledge, toCurrency]);

  const paymentData: { label: string; value: number; className?: string; hidden?: boolean }[] = [
    {
      label: __('Pledge Amount', 'growfund'),
      value: pledge.payment.amount ?? 0,
    },
    {
      label: __('Shipping', 'growfund'),
      value: pledge.payment.shipping_cost ?? 0,
      hidden:
        pledge.pledge_option === 'with-rewards' && pledge.reward?.reward_type === 'digital-goods',
    },
    {
      label: __('Bonus', 'growfund'),
      value: pledge.payment.bonus_support_amount ?? 0,
      hidden: !!pledge.payment.bonus_support_amount && pledge.pledge_option !== 'without-rewards',
    },
    {
      label: __('Recovery Fee', 'growfund'),
      value: pledge.payment.recovery_fee ?? 0,
      hidden: true,
    },
    {
      label: __('Total', 'growfund'),
      value: pledge.payment.total ?? 0,
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
            {__('Pledge Details', 'growfund')}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="gf-p-4 gf-pt-0 gf-space-y-2 gf-overflow-y-auto gf-flex-1 gf-hide-scrollbar">
          <div className="gf-flex gf-items-center gf-justify-between">
            <div className="gf-typo-tiny gf-text-fg-primary gf-flex gf-items-center gf-gap-1">
              <span>{__('Pledged on', 'growfund')}</span>
              <span className="gf-text-fg-muted-foreground">
                {format(pledge.created_at, DATE_FORMATS.HUMAN_READABLE_DATE_WITH_TIME)}
              </span>
            </div>
            <PledgeStatusBadge status={pledge.status} />
          </div>
          <div className="gf-space-y-4">
            {/* Campaign card */}
            <Box className="gf-border-border-secondary gf-shadow-none">
              <BoxContent className="gf-p-2 gf-grid gf-grid-cols-[3.5rem_auto] gf-gap-3">
                <Image
                  src={pledge.campaign.images?.[0]?.url ?? null}
                  alt={pledge.campaign.title}
                  className="gf-w-full"
                  fit="cover"
                  aspectRatio="square"
                />
                <div className="gf-space-y-2">
                  <p className="gf-typo-small gf-font-medium gf-text-fg-primary">
                    {pledge.campaign.title}
                  </p>
                  <div className="gf-typo-tiny gf-text-fg-secondary gf-flex gf-items-center gf-gap-1">
                    {__('by', 'growfund')}
                    <span className="gf-text-fg-brand gf-capitalize">
                      {pledge.campaign.created_by}
                    </span>
                  </div>
                </div>
              </BoxContent>
            </Box>

            {/* Reward card */}
            {isDefined(pledge.reward) && (
              <Box className="gf-border-border-secondary gf-shadow-none">
                <BoxContent className="gf-space-y-3">
                  <h6 className="gf-typo-h6 gf-text-fg-primary">{__('Reward', 'growfund')}</h6>

                  <Box className="gf-border-none gf-shadow-none gf-bg-background-surface-secondary">
                    <BoxContent className="gf-p-3 gf-grid gf-grid-cols-[5.5rem_auto] gf-gap-3">
                      <Image
                        src={pledge.reward.image?.url ?? null}
                        alt={pledge.reward.title}
                        className="gf-w-full"
                        fit="cover"
                        aspectRatio="square"
                      />
                      <div className="gf-space-y-1 gf-flex gf-flex-col gf-gap-3 gf-mt-1">
                        <p
                          className="gf-typo-small gf-font-medium gf-text-fg-primary gf-truncate-2-lines"
                          title={pledge.reward.title}
                        >
                          {pledge.reward.title}
                        </p>
                        <h6 className="gf-typo-h6 gf-text-fg-secondary">
                          {toCurrency(pledge.reward.amount)}
                        </h6>
                      </div>
                    </BoxContent>
                  </Box>

                  <div className="gf-space-y-2">
                    <p className="gf-typo-small gf-font-medium gf-text-fg-secondary">
                      {sprintf(
                        /* translators: %s: number of reward items */
                        _n(
                          '%s item included',
                          '%s items included',
                          pledge.reward.items.length,
                          'growfund',
                        ),
                        pledge.reward.items.length,
                      )}
                    </p>

                    <div className="gf-space-y-2">
                      {pledge.reward.items
                        .slice(0, showMore ? pledge.reward.items.length : MAX_ITEMS_TO_SHOW)
                        .map((item, index) => {
                          return (
                            <Box key={index} className="gf-shadow-none">
                              <BoxContent className="gf-p-3 gf-grid gf-grid-cols-[3rem_auto] gf-gap-3">
                                <Image
                                  src={item.image?.url ?? null}
                                  alt={item.title}
                                  className="gf-w-full"
                                  fit="cover"
                                  aspectRatio="square"
                                />
                                <div className="gf-space-y-1">
                                  <p className="gf-typo-small gf-text-fg-primary">{item.title}</p>
                                  <p className="gf-typo-tiny gf-text-fg-secondary">
                                    {/* translators: %s: reward quantity */}
                                    {sprintf(__('Quantity: %s', 'growfund'), item.quantity)}
                                  </p>
                                </div>
                              </BoxContent>
                            </Box>
                          );
                        })}

                      {pledge.reward.items.length > MAX_ITEMS_TO_SHOW && (
                        <Button
                          variant="link"
                          size="sm"
                          className="hover:gf-bg-transparent gf-px-0 gf-text-fg-subdued hover:gf-text-fg-secondary"
                          onClick={() => {
                            setShowMore(!showMore);
                          }}
                        >
                          {!showMore
                            ? sprintf(
                                /* translators: %s: number of reward items */
                                _n(
                                  '+%s more item',
                                  '+%s more items',
                                  pledge.reward.items.length - MAX_ITEMS_TO_SHOW,
                                  'growfund',
                                ),
                                pledge.reward.items.length - MAX_ITEMS_TO_SHOW,
                              )
                            : __('Show less', 'growfund')}
                        </Button>
                      )}
                    </div>
                  </div>
                </BoxContent>
              </Box>
            )}

            <Box className="gf-border-border-secondary gf-shadow-none gf-mb-10">
              <BoxContent className="gf-space-y-3">
                <div className="gf-flex gf-items-center gf-justify-between">
                  <h6 className="gf-typo-h6 gf-text-fg-primary">{__('Payment', 'growfund')}</h6>
                  <PaymentStatusBadge status={pledge.payment.payment_status ?? 'pending'} />
                </div>

                <Box>
                  <BoxContent className="gf-space-y-2 gf-p-3">
                    {paymentData
                      .filter((data) => !isDefined(data.hidden) || !data.hidden)
                      .map((data, index) => {
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
        {(pledge.status === 'backed' || pledge.status === 'completed') && (
          <DialogFooter className="gf-bg-background-surface-secondary">
            <PDFDownloadLink
              document={
                <PdfReceiptDocument
                  pdfReceiptTemplate={defaultPdfTemplate}
                  toCurrency={toCurrency}
                  appConfig={appConfig}
                >
                  {isDefined(pledge.reward) ? (
                    <PDFPledgeWithRewardContent pledge={pledge} />
                  ) : (
                    <PdfPledgeWithoutRewardContent pledge={pledge} />
                  )}
                </PdfReceiptDocument>
              }
              fileName={sprintf(
                /* translators: 1: pledge id, 2: current date */
                'pledge-receipt-%1$s-%2$s.pdf',
                pledge.id,
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

export default PledgeDetailsDialog;
