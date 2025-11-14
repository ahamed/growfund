import { __ } from '@wordpress/i18n';
import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Box, BoxContent } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { type Donation } from '@/features/donations/schemas/donation';
import { useCurrency } from '@/hooks/use-currency';

const PaymentBadge = ({ status }: { status: 'paid' | 'unpaid' | 'failed' }) => {
  switch (status) {
    case 'paid':
      return <Badge variant="primary">{__('PAID', 'growfund')}</Badge>;
    case 'unpaid':
      return <Badge variant="warning">{__('UNPAID', 'growfund')}</Badge>;
    case 'failed':
      return <Badge variant="destructive">{__('FAILED', 'growfund')}</Badge>;
    default:
      return null;
  }
};

const PaymentView = ({
  amount,
  donationStatus,
  payment_method,
}: {
  amount: number;
  donationStatus: Donation['status'];
  payment_method?: Donation['payment_method'];
}) => {
  const { toCurrency } = useCurrency();

  const getPaymentStatus = useCallback(() => {
    switch (donationStatus) {
      case 'completed':
        return 'paid';
      case 'pending':
        return 'unpaid';
      case 'failed':
      case 'cancelled':
        return 'failed';
      default:
        return 'unpaid';
    }
  }, [donationStatus]);

  return (
    <Box>
      <BoxContent>
        <div className="gf-flex gf-items-center gf-justify-between">
          <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary gf-flex gf-items-center gf-gap-2">
            {__('Payment', 'growfund')}
            {!!payment_method && (
              <div className="gf-flex gf-items-center gf-gap-1">
                <span className="gf-typo-tiny gf-text-fg-secondary">{__('via', 'growfund')}</span>
                <Image
                  src={payment_method.logo}
                  alt={payment_method.label}
                  className="gf-size-4 gf-border-none gf-bg-transparent"
                  fit="contain"
                  aspectRatio="square"
                />
                <span className="gf-typo-small gf-font-medium gf-text-fg-primary">
                  {payment_method.label}
                </span>
              </div>
            )}
          </h6>
          <PaymentBadge status={getPaymentStatus()} />
        </div>

        <Box className="gf-mt-3">
          <BoxContent className="gf-p-3">
            <div className="gf-flex gf-items-center gf-justify-between gf-typo-small gf-text-fg-primary gf-min-h-7">
              <span>{__('Donation', 'growfund')}</span>
              <span className="gf-font-medium">{toCurrency(amount)}</span>
            </div>

            <div className="gf-flex gf-items-center gf-justify-between gf-typo-small gf-font-medium gf-text-fg-primary gf-min-h-9">
              <span>{__('Total', 'growfund')}</span>
              <span>{toCurrency(amount)}</span>
            </div>
          </BoxContent>
        </Box>
      </BoxContent>
    </Box>
  );
};

export default PaymentView;
