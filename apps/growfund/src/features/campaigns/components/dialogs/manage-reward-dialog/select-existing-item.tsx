import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SelectField } from '@/components/form/select-field';
import { TextField } from '@/components/form/text-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCampaignReward } from '@/features/campaigns/contexts/campaign-reward';

const FormSchema = z.object({
  id: z.string({ message: __('Reward item is required', 'growfund') }),
  quantity: z.number({ message: __('Item quantity is required', 'growfund') }),
});

const SelectExistingItem = ({
  selectedItems,
  onSave,
  onCancel,
}: {
  selectedItems: { id: string; quantity: number }[];
  onSave: (value: { id: string; quantity: number }) => void;
  onCancel: () => void;
}) => {
  const { rewardItems } = useCampaignReward();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const options = rewardItems
    .filter((item) => !selectedItems.find((value) => value.id === item.id))
    .map((item) => ({
      label: item.title,
      value: item.id,
    }));

  return (
    <Form {...form}>
      <SelectField
        control={form.control}
        name="id"
        placeholder={__('Select an item', 'growfund')}
        options={options}
        className="gf-w-[414px] gf-overflow-hidden"
      />
      <TextField
        control={form.control}
        name="quantity"
        type="number"
        label={__('Quantity', 'growfund')}
        placeholder={__('Enter quantity', 'growfund')}
      />
      <div className="gf-flex gf-justify-end gf-gap-4 gf-pt-2">
        <Button variant="ghost" onClick={onCancel}>
          {__('Cancel', 'growfund')}
        </Button>
        <Button
          variant="primary"
          disabled={!form.formState.isDirty}
          onClick={form.handleSubmit(
            (values) => {
              onSave({ id: values.id, quantity: values.quantity });
            },
            (errors) => {
              console.error(errors);
            },
          )}
        >
          {__('Save', 'growfund')}
        </Button>
      </div>
    </Form>
  );
};

export default SelectExistingItem;
