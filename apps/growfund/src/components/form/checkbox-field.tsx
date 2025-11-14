import { type FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface CheckboxFieldProps<T extends FieldValues>
  extends Omit<ControllerField<T>, 'readOnly' | 'placeholder' | 'inline'> {
  readOnly?: boolean;
}

function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  description,
  className,
}: CheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem
            className={cn(
              'gf-w-full gf-flex gf-gap-2',
              isDefined(description) || !!fieldState.error ? 'gf-items-start' : 'gf-items-center',
            )}
          >
            <FormControl>
              <Checkbox
                {...field}
                disabled={disabled}
                className={className}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                aria-readonly
                value={field.value ?? ''}
              />
            </FormControl>
            <div
              className={cn('gf-flex gf-flex-col gf-gap-2', isDefined(description) && 'gf-pt-0.5')}
            >
              {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    ></FormField>
  );
}

export { CheckboxField };
