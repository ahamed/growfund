import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';

import CampaignCard from '@/components/campaigns/campaign-card';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { ErrorState, ErrorStateDescription } from '@/components/error-state';
import { LoadingSpinnerOverlay } from '@/components/layouts/loading-spinner';
import { Box, BoxContent } from '@/components/ui/box';
import { Form } from '@/components/ui/form';
import UserPreviewCard from '@/components/users/user-preview-card';
import { useCampaignDetailsQuery } from '@/features/campaigns/services/campaign';
import DonationAction from '@/features/donations/components/donation-action/donation-action';
import DonationPaymentViewCard from '@/features/donations/components/donation-payment-view-card';
import DonationTributeCard from '@/features/donations/components/donation-tribute';
import PaymentView from '@/features/donations/components/payment-view';
import DonationTimeline from '@/features/donations/components/timeline/donation-timeline';
import { type Donation, type DonationStatus } from '@/features/donations/schemas/donation';
import { isDefined } from '@/utils';
import { matchQueryStatus } from '@/utils/match-query-status';

const DonationView = ({ donation }: { donation: Donation }) => {
  const form = useForm<{ status: DonationStatus }>({
    defaultValues: {
      status: donation.status,
    },
  });

  const campaignDetailQuery = useCampaignDetailsQuery(donation.campaign.id);

  const hasTribute = isDefined(donation.tribute_type);

  return matchQueryStatus(campaignDetailQuery, {
    Loading: <LoadingSpinnerOverlay />,
    Error: (
      <ErrorState className="gf-mt-10">
        <ErrorStateDescription>
          {__('Error loading donation details', 'growfund')}
        </ErrorStateDescription>
      </ErrorState>
    ),
    Empty: (
      <EmptyState className="gf-mt-10">
        <EmptyStateDescription className="gf-flex gf-flex-col gf-items-center">
          {__('No donation found.', 'growfund')}
        </EmptyStateDescription>
      </EmptyState>
    ),
    Success: ({ data: campaign }) => {
      return (
        <Form {...form}>
          <div className="gf-grid gf-grid-cols-[auto_20rem] gf-gap-4">
            <div>
              <CampaignCard campaign={campaign} mode="view" />
              <div className="gf-flex gf-flex-col gf-gap-4 gf-mt-4">
                <DonationPaymentViewCard donation={donation} />
                <PaymentView
                  amount={donation.amount}
                  donationStatus={donation.status}
                  payment_method={donation.payment_method}
                />
                <DonationTimeline donationId={donation.id} />
              </div>
            </div>

            <div className="gf-space-y-4">
              <DonationAction donation={donation} />
              <UserPreviewCard user={donation.donor} title={__('Donor', 'growfund')} />

              {hasTribute && (
                <Box>
                  <BoxContent>
                    <DonationTributeCard donation={donation} />
                  </BoxContent>
                </Box>
              )}

              <Box>
                <BoxContent>
                  <h6 className="gf-typo-h6 gf-text-fg-primary">{__('Notes', 'growfund')}</h6>
                  <div className="gf-typo-small gf-text-fg-secondary gf-mt-3">
                    {donation.notes ?? __('No notes', 'growfund')}
                  </div>
                </BoxContent>
              </Box>
            </div>
          </div>
        </Form>
      );
    },
  });
};

export default DonationView;
