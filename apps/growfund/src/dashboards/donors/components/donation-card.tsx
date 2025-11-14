import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { __, sprintf } from '@wordpress/i18n';
import { format } from 'date-fns';
import { Clock4Icon, FileText, X } from 'lucide-react';
import { useState } from 'react';

import { SpecialTributeIcon } from '@/app/icons';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Image } from '@/components/ui/image';
import DonationDetailsDialog from '@/dashboards/donors/features/donations/components/dialogs/donation-details-dialog';
import { useConsentDialog } from '@/features/campaigns/contexts/consent-dialog-context';
import { type Donation, type DonationStatus } from '@/features/donations/schemas/donation';
import { useUpdateDonationStatusMutation } from '@/features/donations/services/donations';
import { useCurrency } from '@/hooks/use-currency';
import { DATE_FORMATS } from '@/lib/date';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const DonationCard = ({ donation }: { donation: Donation }) => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toCurrency } = useCurrency();
  const { openDialog } = useConsentDialog();
  const variants = new Map<DonationStatus, BadgeProps['variant']>([
    ['completed', 'primary'],
    ['pending', 'secondary'],
    ['cancelled', 'destructive'],
    ['failed', 'destructive'],
    ['refunded', 'special'],
  ]);
  const statusTexts = new Map<DonationStatus, string>([
    ['completed', __('Completed', 'growfund')],
    ['pending', __('Pending', 'growfund')],
    ['failed', __('Failed', 'growfund')],
    ['cancelled', __('Cancelled', 'growfund')],
    ['refunded', __('Refunded', 'growfund')],
  ]);

  const updateDonationStatusMutation = useUpdateDonationStatusMutation();

  const isCancellable = ['pending'].includes(donation.status);

  return (
    <Card>
      <CardContent className="gf-pt-4">
        <div className="gf-grid gf-grid-cols-[35rem_auto] gf-w-full gf-gap-3">
          <div className="gf-w-full gf-flex gf-items-center gf-gap-3">
            <Image
              src={donation.campaign.images?.[0]?.url ?? null}
              alt={'image'}
              fit="cover"
              aspectRatio="square"
              className="gf-h-24 gf-w-24 gf-rounded"
            />
            <div className="gf-space-y-1">
              {isDefined(donation.tribute_type) && (
                <div className="gf-w-full gf-flex gf-items-center gf-gap-1">
                  <SpecialTributeIcon className="gf-size-4 gf-text-fg-special" />
                  <span className="gf-typo-tiny gf-text-fg-special">
                    {sprintf(
                      /* translators: 1: Tribute Type, 2: Tribute Salutation, 3: Tribute To */
                      __('Tribute %1$s %2$s %3$s', 'growfund'),
                      donation.tribute_type,
                      donation.tribute_salutation,
                      donation.tribute_to,
                    )}
                  </span>
                </div>
              )}

              <div className="gf-space-y-2">
                <div className="gf-flex gf-w-full gf-items-center gf-gap-2">
                  <div className="gf-typo-h4 gf-font-semibold gf-text-primary">
                    {toCurrency(donation.amount)}
                  </div>
                  <Badge
                    variant={
                      variants.has(donation.status) ? variants.get(donation.status) : 'outline'
                    }
                    className="gf-capitalize"
                  >
                    {statusTexts.has(donation.status)
                      ? statusTexts.get(donation.status)
                      : donation.status}
                  </Badge>
                </div>
                <div className="gf-w-full gf-flex gf-items-center">
                  <div className="gf-typo-small gf-font-medium gf-text-primary">
                    {donation.campaign.title}
                  </div>
                  <DotFilledIcon className="gf-w-4 gf-h-4" />
                  <div className="gf-typo-small gf-font-medium gf-text-fg-emphasis">
                    {/* translators: %s: Fund title */}
                    {sprintf(__('Fund: %s', 'growfund'), donation.fund?.title)}
                  </div>
                </div>
                <div className="gf-flex gf-gap-1 gf-items-center">
                  <Clock4Icon className="gf-text-icon-primary gf-h-4 gf-w-4" />
                  <span className="gf-typo-small gf-text-muted-foreground">
                    {format(
                      new Date(donation.created_at),
                      DATE_FORMATS.HUMAN_READABLE_FULL_DATE_TIME,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="gf-flex gf-flex-col gf-justify-between gf-items-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="gf-shrink-0 gf-size-8">
                  <DotsVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDetailsDialog(true);
                  }}
                >
                  <FileText />
                  {__('View Details', 'growfund')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn('gf-text-fg-critical', !isCancellable && 'gf-text-fg-subdued')}
                  disabled={!isCancellable}
                  onClick={() => {
                    openDialog({
                      title: __('Cancel Donation', 'growfund'),
                      content: __(
                        'Are you sure you want to cancel this donation? This action cannot be undone.',
                        'growfund',
                      ),
                      confirmButtonVariant: 'destructive',
                      confirmText: __('Yes, cancel the donation', 'growfund'),
                      declineText: __('Keep as it is', 'growfund'),
                      onConfirm: async (closeDialog) => {
                        await updateDonationStatusMutation.mutateAsync({
                          id: donation.id,
                          status: 'cancelled',
                        });
                        closeDialog();
                      },
                    });
                  }}
                >
                  <X />
                  {__('Cancel Donation', 'growfund')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="gf-typo-tiny gf-text-fg-muted">
              {/* translators: %s: Donation ID */}
              {sprintf(__('ID: %s', 'growfund'), donation.id)}
            </span>
          </div>
        </div>
        <DonationDetailsDialog
          open={openDetailsDialog}
          onOpenChange={setOpenDetailsDialog}
          donation={donation}
        />
      </CardContent>
    </Card>
  );
};

export default DonationCard;
