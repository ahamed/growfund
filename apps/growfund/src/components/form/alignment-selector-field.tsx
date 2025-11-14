import { RadioGroupItem } from '@radix-ui/react-radio-group';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { type ReactNode } from 'react';
import { type FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { type Alignment } from '@/schemas/alignment';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

const options: {
  value: Alignment;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: 'left',
    label: 'Left',
    icon: <AlignLeft className="gf-size-4" />,
  },
  {
    value: 'center',
    label: 'Center',
    icon: <AlignCenter className="gf-size-4" />,
  },
  {
    value: 'right',
    label: 'Right',
    icon: <AlignRight className="gf-size-4" />,
  },
];

interface AlignmentSelectorFieldProps<T extends FieldValues>
  extends Omit<ControllerField<T>, 'placeholder'> {
  rootClassName?: string;
}

const AlignmentSelectorField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
  rootClassName,
}: AlignmentSelectorFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={cn('gf-w-full')}>
            <div className="gf-space-y-2">
              {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
            <FormControl
              className={cn(
                'gf-mt-3 gf-w-full gf-grid gf-grid-cols-3 gf-rounded-lg gf-bg-background-surface-secondary gf-p-1 gf-gap-1',
                fieldState.error && 'gf-border-border-critical',
                rootClassName,
              )}
            >
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value ?? ''}
                disabled={disabled}
                className="gf-w-full"
              >
                {options.map((option, index) => {
                  return (
                    <FormItem
                      key={index}
                      className="gf-w-full gf-flex gf-flex-col gf-justify-center gf-items-center"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          'gf-w-full gf-flex gf-justify-center gf-items-center gf-typo-small gf-font-medium gf-cursor-pointer gf-transition-all gf-py-1 gf-px-2 hover:gf-bg-background-surface hover:gf-rounded-sm hover:gf-shadow-sm',
                          field.value === option.value &&
                            'gf-bg-background-surface gf-rounded-sm gf-shadow-sm',
                          className,
                        )}
                      >
                        {option.icon}
                      </FormLabel>
                      <FormLabel className="gf-sr-only">{option.label}</FormLabel>
                    </FormItem>
                  );
                })}
              </RadioGroup>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default AlignmentSelectorField;
