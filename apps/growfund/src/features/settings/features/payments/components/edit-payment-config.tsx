import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import Renderer from '@/features/settings/features/payments/components/fields/renderer';
import { type Payment } from '@/features/settings/features/payments/schemas/payment';
import { isDefined } from '@/utils';
import { isMediaObject } from '@/utils/media';

interface EditPaymentConfigProps {
  field: Payment;
  index: number;
  onCancel?: () => void;
  onSave?: (value: Record<string, unknown>) => void;
  onRemove?: () => void;
}

const EditPaymentConfig = ({ field, onCancel, onSave, onRemove }: EditPaymentConfigProps) => {
  const form = useForm();

  useEffect(() => {
    if (isDefined(field.config)) {
      form.reset.call(null, field.config);
    }
  }, [field.config, form.reset]);

  const logoSrc = isMediaObject(field.config.logo) ? field.config.logo.url : field.config.logo;

  return (
    <div className="gf-flex gf-gap-2 gf-items-center gf-w-full">
      <div className="gf-space-y-6 gf-w-full">
        <div className="gf-flex gf-items-center gf-justify-between">
          <div className="gf-flex gf-items-center gf-gap-2">
            <Image
              src={logoSrc}
              alt={field.config.label}
              className="gf-size-5 gf-border-none gf-bg-transparent"
              fit="cover"
            />
            <span>{field.config.label}</span>
          </div>
        </div>
        <Form {...form}>
          <Renderer fields={field.fields} />
        </Form>
        <div className="gf-flex gf-justify-between">
          {field.type === 'manual-payment' && (
            <Button variant="secondary" onClick={onRemove} className="hover:gf-text-fg-critical">
              {__('Remove', 'growfund')}
            </Button>
          )}
          <div className="gf-flex gf-gap-2 gf-ms-auto">
            <Button variant="outline" onClick={onCancel}>
              {__('Cancel', 'growfund')}
            </Button>
            <Button
              onClick={() => {
                onSave?.(form.getValues());
              }}
            >
              {__('Save', 'growfund')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditPaymentConfig;
