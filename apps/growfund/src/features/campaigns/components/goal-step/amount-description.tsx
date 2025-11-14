import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import { Check, Circle, CircleDot, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { TextField } from '@/components/form/text-field';
import { TextareaField } from '@/components/form/textarea-field';
import { Button } from '@/components/ui/button';
import { SortableContainer, SortableItem } from '@/contexts/sortable';
import { type CampaignBuilderForm } from '@/features/campaigns/schemas/campaign';
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const PresetItem = ({
  preset,
  isOverlay = false,
  index,
  onRemove,
  onSetDefault,
  isEditing,
  onSetEditing,
}: {
  preset: NonNullable<CampaignBuilderForm['suggested_options']>[number];
  isOverlay?: boolean;
  index: number;
  onRemove?: () => void;
  onSetDefault?: () => void;
  isEditing?: boolean;
  onSetEditing?: (value: boolean) => void;
}) => {
  const form = useFormContext<CampaignBuilderForm>();
  const [isOpen, setIsOpen] = useState(false);

  const suggestionType = useWatch({ control: form.control, name: 'suggested_option_type' });
  const { toCurrency } = useCurrency();

  const errors = form.getFieldState(`suggested_options.${index}`).error;

  useEffect(() => {
    if (errors) {
      setIsOpen(true);
    }
  }, [errors]);

  return (
    <div>
      <div
        className={cn(
          'gf-relative gf-border gf-border-border gf-rounded-md gf-bg-background-white gf-py-3 gf-px-4 gf-flex gf-gap-3 gf-items-center gf-group gf-min-h-16',
          isOverlay && 'gf-shadow-lg',
          !!errors && 'gf-border-border-critical',
        )}
      >
        <DragHandleDots2Icon className="gf-shrink-0" />

        {!isEditing && !isOpen ? (
          <div className="gf-h-full gf-ms-1">
            <div className="gf-w-full gf-space-y-2">
              <div className="gf-w-full gf-font-semibold gf-text-fg-primary gf-items-center gf-flex gf-gap-1">
                {toCurrency(preset.amount)}
                {preset.is_default && (
                  <span className="gf-font-regular gf-text-fg-secondary">
                    {__(' (Default)', 'growfund')}
                  </span>
                )}
              </div>

              {suggestionType === 'amount-description' && !!preset.description && (
                <div className="gf-typo-small gf-text-fg-secondary gf-items-center gf-flex">
                  {preset.description}
                </div>
              )}
            </div>
            <div className="gf-absolute gf-top-3 gf-right-4 gf-h-9 gf-w-[5.25rem] gf-items-center gf-justify-center gf-p-1 gf-shadow-md gf-border gf-rounded-md gf-hidden group-hover:gf-flex">
              <Button
                variant="ghost"
                size="icon"
                className="gf-size-6 gf-cursor-pointer"
                onClick={() => {
                  onSetEditing?.(true);
                }}
              >
                <Edit />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="gf-size-6 gf-cursor-pointer"
                onClick={() => {
                  onSetDefault?.();
                }}
              >
                {preset.is_default ? <CircleDot /> : <Circle />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="gf-size-6 gf-cursor-pointer hover:gf-text-icon-critical"
                onClick={() => {
                  onRemove?.();
                  setIsOpen(false);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ) : (
          <div className="gf-flex gf-w-full gf-flex-col gf-gap-2">
            <div className="gf-w-ful gf-flex gf-justify-between gf-gap-2">
              <TextField
                control={form.control}
                type="number"
                name={`suggested_options.${index}.amount` as 'suggested_options.0.amount'}
                placeholder={__('5.00', 'growfund')}
                autoFocusVisible
              />
              <div className="gf-flex gf-top-2 gf-right-2 gf-h-9 gf-w-[5.25rem] gf-items-center gf-justify-center gf-p-1 gf-border gf-rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="gf-size-6 gf-cursor-pointer"
                  onClick={() => {
                    onSetEditing?.(false);
                    setIsOpen(false);
                  }}
                >
                  <Check />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="gf-size-6 gf-cursor-pointer"
                  onClick={() => {
                    onSetDefault?.();
                  }}
                >
                  {preset.is_default ? <CircleDot /> : <Circle />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="gf-size-6 gf-cursor-pointer hover:gf-text-icon-critical"
                  onClick={() => {
                    onRemove?.();
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            {suggestionType === 'amount-description' && (
              <TextareaField
                control={form.control}
                name={`suggested_options.${index}.description` as 'suggested_options.0.description'}
                placeholder={__(
                  'We truly appreciate your generous support! Your contributions make...',
                  'growfund',
                )}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AmountDescription = () => {
  const form = useFormContext<CampaignBuilderForm>();
  const fieldArray = useFieldArray({ control: form.control, name: 'suggested_options' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { replace, fields } = fieldArray;
  const options =
    useWatch({
      control: form.control,
      name: 'suggested_options',
    }) ?? [];

  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...options[index],
  }));

  const hasFieldError = form.getFieldState('suggested_options').error;

  return (
    <div className="gf-space-y-2">
      <SortableContainer
        items={controlledFields}
        onSortCompleted={(items) => {
          const updatedItems = items.map((item) => ({
            id: item.id,
            amount: item.amount,
            description: item.description,
            is_default: item.is_default,
          }));

          replace(updatedItems);
        }}
        overlay={(item) => (
          <PresetItem
            preset={{
              amount: item.amount,
              description: item.description,
              is_default: item.is_default,
            }}
            isOverlay
            index={0}
          />
        )}
      >
        {controlledFields.map((field, index) => (
          <SortableItem id={field.id} key={field.id}>
            <PresetItem
              key={field.id}
              preset={{
                amount: field.amount,
                description: field.description,
                is_default: field.is_default,
              }}
              index={index}
              onRemove={() => {
                fieldArray.remove(index);
                setEditingIndex(null);
              }}
              onSetDefault={() => {
                fieldArray.replace(
                  controlledFields.map((value, idx) => ({
                    ...value,
                    is_default: index === idx,
                  })),
                );
              }}
              isEditing={editingIndex === index}
              onSetEditing={(value) => {
                setEditingIndex(value ? index : null);
              }}
            />
          </SortableItem>
        ))}
      </SortableContainer>

      <Button
        variant="secondary"
        className={cn(
          'gf-w-full',
          hasFieldError && 'gf-border-border-critical gf-bg-background-fill-critical-secondary',
        )}
        disabled={isDefined(editingIndex)}
        onClick={() => {
          fieldArray.append({
            amount: 0,
            description: '',
            is_default: false,
          });
          setEditingIndex(fields.length);
        }}
      >
        <Plus />
        {__('Add Amount', 'growfund')}
      </Button>
      {hasFieldError && (
        <p className="gf-text-[0.8rem] gf-font-small gf-text-fg-critical">
          {__('Suggestion is required.', 'growfund')}
        </p>
      )}
    </div>
  );
};
