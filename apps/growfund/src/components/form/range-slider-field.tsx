import { type FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface RangeSliderFieldProps<T extends FieldValues>
  extends Omit<ControllerField<T>, 'min' | 'max' | 'placeholder'> {
  min?: number;
  max?: number;
  step?: number;
}

const RangeSliderField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
  min = 0,
  max = 100,
  step = 1,
}: RangeSliderFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn(
              'gf-w-full gf-flex gf-flex-col gf-items-start gf-justify-between gf-gap-2',
            )}
          >
            <div className="gf-w-full gf-space-y-2">
              <div className="gf-w-full gf-flex gf-items-center gf-justify-between gf-gap-4">
                {isDefined(label) && <FormLabel className="gf-shrink-0">{label}</FormLabel>}
                <Input
                  value={isDefined(field.value) ? field.value : ''}
                  onChange={field.onChange}
                  className="gf-w-full gf-px-2 gf-py-0"
                  postfixText="px"
                  rootClassName="gf-w-[4rem]"
                  placeholder="0"
                />
              </div>
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
            <FormControl>
              <div className="gf-w-full gf-gap-4 gf-items-center">
                <Slider
                  {...field}
                  defaultValue={isDefined(field.value) ? [field.value] : undefined}
                  value={isDefined(field.value) ? [field.value] : undefined}
                  onValueChange={(values) => {
                    field.onChange(values[0]);
                  }}
                  disabled={disabled}
                  className={className}
                  min={min}
                  max={max}
                  step={step}
                />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    ></FormField>
  );
};

export default RangeSliderField;
