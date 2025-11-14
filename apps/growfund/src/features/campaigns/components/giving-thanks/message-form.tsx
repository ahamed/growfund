import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TextField } from '@/components/form/text-field';
import { TextareaField } from '@/components/form/textarea-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const MessageFormSchema = z
  .object({
    from: z.number({
      message: __('Pledge From is required', 'growfund'),
    }),
    to: z.number({
      message: __('Pledge To is required', 'growfund'),
    }),
    message: z.string({
      message: __('Appreciation Message is required', 'growfund'),
    }),
  })
  .superRefine(({ from, to }, ctx) => {
    if (from > to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: __('Min value must be lesser than maximum', 'growfund'),
        path: ['from'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: __('Max value must be greater than minimum', 'growfund'),
        path: ['to'],
      });
    }
  });
export type MessageForm = z.infer<typeof MessageFormSchema>;

interface MessageFormProps {
  onRemove?: () => void;
  onSave: (data: MessageForm) => void;
  onCancel: () => void;
  defaultData?: MessageForm;
}

export const MessageForm = ({ defaultData, onRemove, onSave, onCancel }: MessageFormProps) => {
  const form = useForm<MessageForm>({
    resolver: zodResolver(MessageFormSchema),
    defaultValues: defaultData,
  });

  const isEdit = isDefined(defaultData);

  const onSubmit = (values: MessageForm) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <div className="gf-flex gf-flex-col gf-gap-3">
        <div className="gf-flex gf-gap-2 gf-items-center gf-justify-center">
          <TextField
            className="gf-mt-4"
            control={form.control}
            name="from"
            label={__('Pledge Range', 'growfund')}
            placeholder={__('e.g. 5.00', 'growfund')}
            type="number"
            description={__('Min Value', 'growfund')}
          />
          <span className="gf-text-fg-secondary gf-items-center">{__('-', 'growfund')}</span>
          <TextField
            className="gf-mt-8"
            control={form.control}
            name="to"
            placeholder={__('e.g. 50.00', 'growfund')}
            type="number"
            description={__('Max Value', 'growfund')}
          />
        </div>
        <TextareaField
          control={form.control}
          name="message"
          label={__('Appreciation Message', 'growfund')}
          placeholder={__('Enter your appreciation message...', 'growfund')}
        />
        <div
          className={cn(
            'gf-flex gf-w-full gf-gap-2 gf-mt-1 gf-justify-end',
            isEdit && 'gf-justify-between',
          )}
        >
          {isEdit && (
            <Button variant="secondary" onClick={onRemove} className="gf-text-fg-critical">
              {__('Delete', 'growfund')}
            </Button>
          )}

          <div className="gf-flex gf-gap-2">
            <Button variant="outline" onClick={onCancel}>
              {__('Cancel', 'growfund')}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit, (errors) => {
                console.error(errors);
              })}
            >
              {__('Save', 'growfund')}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
