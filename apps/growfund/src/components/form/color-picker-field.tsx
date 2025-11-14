import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { type FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import ColorPicker from '@/components/ui/color-picker';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface ColorPickerFieldProps<T extends FieldValues> extends ControllerField<T> {
  placeholder?: string;
  description?: string;
  defaultValue?: string;
}
function ColorPickerField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = __('Pick a color', 'growfund'),
  description,
  disabled = false,
  className,
  defaultValue,
}: ColorPickerFieldProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const getDisplayText = () => {
          if (!field.value) {
            return <span>{placeholder}</span>;
          }
          return <span className="gf-text-fg-secondary gf-typo-small">{field.value}</span>;
        };

        return (
          <FormItem className="gf-w-full gf-space-y-2 gf-select-none">
            {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}

            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'gf-w-full gf-justify-start gf-text-left gf-font-normal gf-px-3',
                      !field.value && 'gf-text-muted-foreground',
                      fieldState.error && 'gf-border-border-critical',
                      disabled && 'gf-opacity-50',
                      className,
                    )}
                  >
                    <div
                      className="gf-w-4 gf-h-4 gf-rounded-full gf-border"
                      style={{
                        backgroundColor: typeof field.value === 'string' ? field.value : '#FFFFFF',
                      }}
                    />
                    {getDisplayText()}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-4" align="start">
                  <div className="gf-flex gf-items-center gf-gap-2">
                    <ColorPicker
                      defaultValue={defaultValue}
                      color={field.value}
                      onChange={field.onChange}
                      closePopover={() => {
                        setOpen(false);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>

            {isDefined(description) && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export { ColorPickerField };
