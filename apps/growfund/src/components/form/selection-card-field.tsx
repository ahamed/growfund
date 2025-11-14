import { Check } from 'lucide-react';
import { type FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { type Option } from '@/types';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

type SelectionCardField<T extends FieldValues, V> = Omit<
  ControllerField<T>,
  'readonly' | 'placeholder' | 'inline'
> & {
  options: Option<V>[];
};

const SelectionCardField = <T extends FieldValues, V>({
  control,
  name,
  label,
  description,
  options,
  disabled = false,
  className,
}: SelectionCardField<T, V>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={cn('gf-w-full')}>
            <div className="gf-space-y-1">
              {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
            <FormControl className="gf-mt-3">
              <div className={cn('gf-flex gf-items-center gf-gap-4', className)}>
                {options.map((option, index) => {
                  const isActive = field.value === option.value;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        'gf-flex gf-flex-col gf-items-center gf-justify-center gf-w-full gf-gap-3 gf-py-6 gf-border-2 gf-border-border-tertiary gf-bg-background-white gf-rounded-md gf-cursor-pointer gf-relative',
                        'hover:gf-border-border-hover',
                        'focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2',
                        '[&[data-active="true"]]:gf-border-icon-brand',
                      )}
                      onClick={() => {
                        field.onChange(option.value);
                      }}
                      disabled={disabled}
                      data-active={isActive}
                    >
                      {option.icon}
                      <FormLabel
                        className={cn(
                          'gf-cursor-pointer',
                          fieldState.error && 'gf-text-fg-critical',
                        )}
                      >
                        {option.label}
                      </FormLabel>
                      {isActive && (
                        <div className="gf-absolute gf-top-2 gf-left-2 gf-size-5 gf-bg-background-fill-brand gf-rounded-full gf-flex gf-items-center gf-justify-center">
                          <Check className="gf-size-3 gf-text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default SelectionCardField;
