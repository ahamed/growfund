import { type FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ProBadge } from '@/components/ui/pro-badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { type Option } from '@/types';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface RadioFieldProps<T extends FieldValues>
  extends Omit<ControllerField<T>, 'readOnly' | 'placeholder'> {
  options: Option<string>[];
  featureOptions?: string[];
}

function RadioField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  disabled = false,
  className,
  inline = false,
  featureOptions,
}: RadioFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={cn('gf-w-full', inline && 'gf-flex gf-flex-col gf-gap-1')}>
            <div className="gf-space-y-1">
              {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
            <FormControl className={cn('gf-mt-2', inline && 'gf-flex gf-items-center gf-gap-4')}>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value ?? ''}
                disabled={disabled}
                className={className}
              >
                {options.map((option, index) => {
                  return (
                    <FormItem key={index} className="gf-flex gf-items-center gf-space-x-2">
                      <FormControl>
                        <RadioGroupItem
                          value={option.value}
                          className={cn(fieldState.error && 'gf-border-border-critical')}
                        />
                      </FormControl>
                      <FormLabel className={cn(fieldState.error && 'gf-text-fg-critical')}>
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                })}
                {isDefined(featureOptions) &&
                  featureOptions.map((label, index) => {
                    return (
                      <div key={index} className="gf-flex gf-items-center gf-space-x-2">
                        <RadioGroupItem disabled value="" checked={false} />
                        <span className="gf-text-fg-subdued gf-typo-small gf-font-medium gf-min-h-4 gf-flex gf-items-center gf-gap-1">
                          {label} <ProBadge />
                        </span>
                      </div>
                    );
                  })}
              </RadioGroup>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

export { RadioField };
