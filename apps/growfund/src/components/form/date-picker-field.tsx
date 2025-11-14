import { CalendarIcon } from '@radix-ui/react-icons';
import { __, sprintf } from '@wordpress/i18n';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { type FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CalendarPresets from '@/features/campaigns/components/additional/calender-presets';
import { DATE_FORMATS, isDateRange } from '@/lib/date';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface DatePickerFieldProps<T extends FieldValues> extends ControllerField<T> {
  type?: 'single' | 'range';
  clearable?: boolean;
  showRangePresets?: boolean;
}

function DatePickerField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'single',
  placeholder = __('Pick a date', 'growfund'),
  description,
  disabled = false,
  className,
  clearable = false,
  showRangePresets = false,
}: DatePickerFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeRangeItem, setActiveRangeItem] = useState<string>();

  const [month, setMonth] = useState<Date | undefined>(undefined);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const getDisplayText = () => {
          if (!field.value) {
            return <span>{placeholder}</span>;
          }

          if (isDateRange(field.value)) {
            const { from, to } = field.value as DateRange;
            if (!isDefined(from) && !isDefined(to)) {
              return <span>{placeholder}</span>;
            }

            if (isDefined(from) && isDefined(to)) {
              return sprintf(
                '%s - %s',
                formatDate(from, DATE_FORMATS.DATE_FIELD),
                formatDate(to, DATE_FORMATS.DATE_FIELD),
              );
            }

            if (isDefined(from) && !isDefined(to)) {
              return sprintf('%s - %s', formatDate(from, DATE_FORMATS.DATE_FIELD), 'YYYY/MM/DD');
            }

            return <span>{placeholder}</span>;
          }

          if (isDefined(field.value)) {
            return formatDate(field.value, DATE_FORMATS.DATE_FIELD);
          }

          return <span>{placeholder}</span>;
        };

        const isClearButtonDisabled =
          type === 'single'
            ? !isDefined(field.value)
            : !isDefined((field.value as DateRange | undefined)?.from);

        const fieldValue = isDateRange(field.value)
          ? {
              from: field.value?.from ? new Date(field.value.from as unknown as string) : undefined,
              to: field.value?.to ? new Date(field.value.to as unknown as string) : undefined,
            }
          : new Date(field.value);

        const getDefaultMonth = () => {
          if (month) return month;

          if (type === 'single' && isDefined(field.value)) {
            return new Date(field.value);
          } else if (type === 'range' && isDateRange(field.value)) {
            const { from } = field.value as DateRange;
            if (isDefined(from)) {
              return new Date(from);
            }
          }

          return new Date();
        };

        return (
          <FormItem className="gf-w-full gf-space-y-2">
            {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'gf-w-full gf-justify-start gf-text-left gf-font-normal gf-px-3 hover:gf-bg-background-surface gf-bg-background-white',
                      fieldState.error &&
                        'gf-border-border-critical gf-bg-background-fill-critical-secondary gf-text-fg-critical',
                      disabled && 'gf-opacity-50',
                      className,
                    )}
                  >
                    <CalendarIcon />
                    {getDisplayText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="gf-w-auto gf-p-0" align="center">
                  <div className="gf-flex gf-gap-1">
                    {showRangePresets && type === 'range' && (
                      <CalendarPresets
                        activeRangeItem={activeRangeItem}
                        setActiveRangeItem={setActiveRangeItem}
                        setMonth={setMonth}
                        onRangeChange={(newValue: DateRange) => {
                          field.onChange(newValue);
                        }}
                      />
                    )}

                    {type === 'range' ? (
                      <Calendar
                        mode="range"
                        month={getDefaultMonth()}
                        onMonthChange={setMonth}
                        selected={fieldValue as DateRange | undefined}
                        onSelect={(value: unknown) => {
                          const date = value as DateRange;
                          field.onChange(date);
                        }}
                        numberOfMonths={2}
                        classNames={{
                          nav: 'gf-absolute [&:has([name="previous-month"])]:gf-left-0 [&:has([name="next-month"])]:gf-right-0 gf-p-1',
                          day_range_start: '[&]:gf-text-fg-light gf-day-range-start',
                          day_range_end:
                            'gf-day-range-end [&]:gf-bg-background-fill-brand [&]:gf-text-fg-light hover:gf-bg-background-fill-brand hover:gf-text-fg-light focus:gf-bg-background-fill-brand focus:gf-text-fg-light',
                          day_range_middle:
                            'aria-selected:gf-bg-accent aria-selected:gf-text-fg-accent hover:[&]:gf-text-fg-primary',
                        }}
                        initialFocus
                      />
                    ) : (
                      <Calendar
                        mode="single"
                        month={getDefaultMonth()}
                        onMonthChange={setMonth}
                        captionLayout="dropdown"
                        selected={fieldValue as Date | undefined}
                        onSelect={(value: unknown) => {
                          const date = value as Date;
                          field.onChange(date);
                          setMonth(date);

                          if (isDefined(date)) {
                            setOpen(false);
                          }
                        }}
                        numberOfMonths={1}
                        classNames={{
                          day_range_start: '[&]:gf-text-fg-light gf-day-range-start',
                          day_range_end: '[&]:gf-text-fg-light',
                          day_range_middle:
                            '[&]:gf-text-fg-light aria-selected:gf-bg-accent aria-selected:gf-text-fg-accent hover:[&]:gf-text-fg-primary',
                          day_selected: '[&]:gf-bg-background-fill-brand [&]:gf-text-fg-light',
                          nav: 'gf-w-full gf-flex gf-gap-2 gf-items-center gf-justify-end',
                        }}
                        initialFocus
                      />
                    )}
                  </div>

                  {clearable && (
                    <div className="gf-w-full gf-flex gf-items-center gf-justify-center gf-my-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          field.onChange(type === 'single' ? null : { from: null, to: null });
                          setOpen(false);
                        }}
                        disabled={isClearButtonDisabled}
                      >
                        {__('Clear Selection', 'growfund')}
                      </Button>
                    </div>
                  )}
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

export { DatePickerField };
