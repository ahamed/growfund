import { __ } from '@wordpress/i18n';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { type Payment } from '@/features/settings/features/payments/schemas/payment';
import {
  useInstallPaymentGateway,
  useStorePaymentGateway,
} from '@/features/settings/features/payments/services/payment';
import { isMediaObject } from '@/utils/media';

interface PaymentCardProps {
  payment: Payment;
}

export const PaymentCard = ({ payment }: PaymentCardProps) => {
  const installPaymentGatewayMutation = useInstallPaymentGateway();
  const storePaymentGatewayMutation = useStorePaymentGateway();

  const logoSrc = isMediaObject(payment.config.logo)
    ? payment.config.logo.url
    : payment.config.logo;

  return (
    <Card className="gf-cursor-pointer hover:gf-bg-background-surface-alt">
      <div className="gf-flex gf-justify-between gf-items-center gf-p-4">
        <div className="gf-flex gf-gap-2">
          <Image
            src={logoSrc}
            alt={payment.config.label}
            className="gf-size-5 gf-border-none gf-bg-transparent"
            fit="contain"
            aspectRatio="square"
          />
          <span className="gf-font-medium gf-text-base">{payment.config.label}</span>
        </div>
        {payment.is_installed ? (
          <div className="gf-flex gf-gap-2 gf-h-9 gf-items-center">
            <CheckCircle className="gf-text-fg-success gf-size-4" />
            <span className="gf-text-fg-success gf-font-medium gf-typo-small">
              {__('Installed', 'growfund')}
            </span>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={async () => {
              await installPaymentGatewayMutation.mutateAsync(payment.download_url);
              await storePaymentGatewayMutation.mutateAsync({
                name: payment.name,
                payload: payment,
              });
            }}
            loading={
              installPaymentGatewayMutation.isPending || storePaymentGatewayMutation.isPending
            }
            disabled={
              installPaymentGatewayMutation.isPending || storePaymentGatewayMutation.isPending
            }
          >
            {__('Install', 'growfund')}
          </Button>
        )}
      </div>
    </Card>
  );
};
