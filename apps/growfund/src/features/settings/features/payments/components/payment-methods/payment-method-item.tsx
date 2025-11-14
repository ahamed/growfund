import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import { Edit } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { SwitchField } from '@/components/form/switch-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import EditPaymentConfig from '@/features/settings/features/payments/components/edit-payment-config';
import { type Payment } from '@/features/settings/features/payments/schemas/payment';
import { type PaymentSettingsForm } from '@/features/settings/schemas/settings';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';
import { isMediaObject } from '@/utils/media';

interface PaymentMethodItemProps {
  index: number;
  editingIndex: number | null;
  field: Payment;
  onApply?: (value: Record<string, unknown>) => void;
  onEdit?: () => void;
  onCancel?: () => void;
  isOverlay?: boolean;
  onRemove?: () => void;
}

const PaymentMethodItem = ({
  index,
  editingIndex,
  field,
  isOverlay,
  onApply,
  onEdit,
  onCancel,
  onRemove,
}: PaymentMethodItemProps) => {
  const form = useFormContext<PaymentSettingsForm>();
  const isEditing = editingIndex === index;

  const logoSrc = isMediaObject(field.config.logo) ? field.config.logo.url : field.config.logo;

  if (!isEditing) {
    return (
      <div
        className={cn(
          'gf-p-4 gf-group gf-flex gf-items-center gf-rounded-lg gf-border gf-bg-background-surface gf-text-fg-primary',
          isOverlay && 'gf-shadow-lg',
        )}
      >
        <div className="gf-flex gf-items-center gf-justify-between gf-w-full">
          <div className="gf-flex gf-items-center gf-gap-2">
            <DragHandleDots2Icon className="gf-size-5 gf-text-fg-secondary gf-hidden group-hover:gf-flex" />
            <Image
              src={logoSrc}
              alt={field.config.label}
              className="gf-size-5 group-hover:gf-hidden gf-border-none gf-bg-transparent"
              fit="cover"
            />
            <span>{field.config.label}</span>
            {field.type === 'manual-payment' && (
              <Badge variant="secondary">{__('Manual Payment', 'growfund')}</Badge>
            )}
          </div>
          <div className="gf-flex gf-items-center gf-gap-2 gf-h-6">
            <div className="gf-hidden group-hover:gf-flex">
              <Button
                variant="ghost"
                size="icon"
                className="gf-cursor-pointer"
                onClick={onEdit}
                disabled={isDefined(editingIndex)}
              >
                <Edit />
              </Button>
            </div>
            <SwitchField control={form.control} name={`payments.${index}.is_enabled`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={index}
      className="gf-p-4 gf-group gf-flex gf-items-center gf-rounded-lg gf-border gf-bg-background-surface gf-text-fg-primary"
    >
      <EditPaymentConfig
        index={index}
        onCancel={onCancel}
        field={field}
        onSave={onApply}
        onRemove={onRemove}
      />
    </div>
  );
};

export default PaymentMethodItem;
