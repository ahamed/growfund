import { __ } from '@wordpress/i18n';
import { Check, ChevronsUpDown, PlusCircle, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { type FieldValues } from 'react-hook-form';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type Option } from '@/types';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface SelectFieldProps<T extends FieldValues, V extends string | number>
  extends Omit<ControllerField<T>, 'readOnly'> {
  options: Option<V>[];
  allowCreate?: boolean;
  onCreateOption?: (value: string, triggerComplete: () => void) => void;
  allowDelete?: boolean;
  onDeleteOption?: (option: Option<V>) => void;
  loading?: boolean;
}

function purifyValue(value: string[], options: Option<string>[]) {
  return value.filter((item) => !!options.find((option) => option.value === item));
}

function MultiSelectField<T extends FieldValues, V extends string | number>({
  control,
  name,
  label,
  description,
  options,
  disabled = false,
  className,
  placeholder = __('Select an option', 'growfund'),
  allowCreate = false,
  onCreateOption,
  allowDelete = false,
  onDeleteOption,
  loading = false,
}: SelectFieldProps<T, V>) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const optionsToDisplay = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue, options]);

  const handleValueChange = useCallback((previous: string[], current: string) => {
    return previous.includes(current)
      ? previous.filter((value) => String(value) !== String(current))
      : [...previous, current];
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldValue = field.value
          ? purifyValue(field.value as string[], options as Option<string>[])
          : [];
        const showCreateButton =
          allowCreate && inputValue.length > 0 && optionsToDisplay.length === 0;

        return (
          <FormItem className="gf-w-full gf-space-y-2">
            {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}

            <div className={cn('gf-space-y-2', className)}>
              <FormControl>
                <div
                  className={cn(
                    'gf-border gf-border-border gf-rounded-md',
                    'focus-within:gf-outline-none focus-within:gf-ring-2 focus-within:gf-ring-ring focus-within:gf-ring-offset-2',
                    fieldState.error &&
                      'gf-border-border-critical gf-bg-background-fill-critical-secondary',
                  )}
                >
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'gf-w-full gf-justify-start gf-py-1 gf-px-3 gf-text-fg-subdued hover:gf-text-fg-subdued gf-font-regular gf-cursor-text hover:gf-bg-transparent gf-border-none focus-visible:gf-ring-0 focus-visible:gf-ring-offset-0',
                          fieldState.error && 'gf-bg-background-fill-critical-secondary',
                        )}
                        disabled={disabled}
                      >
                        {placeholder}
                        <ChevronsUpDown className="gf-ml-auto gf-opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    {fieldValue.length > 0 && (
                      <Separator
                        className={cn(fieldState.error && 'gf-bg-background-fill-critical')}
                      />
                    )}

                    <PopoverContent className="gf-w-[var(--radix-popover-trigger-width)] gf-p-0">
                      <Command className="gf-w-full">
                        <CommandInput
                          placeholder={placeholder}
                          value={inputValue}
                          onValueChange={setInputValue}
                          onKeyDown={(event) => {
                            if (allowCreate && event.key === 'Enter') {
                              event.preventDefault();
                              event.stopPropagation();
                              onCreateOption?.(inputValue, () => {
                                setInputValue('');
                                field.onChange(handleValueChange(fieldValue, inputValue));
                                setOpen(false);
                              });
                            }
                          }}
                        />
                        <CommandList>
                          <CommandEmpty className="gf-py-2">
                            {showCreateButton ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  onCreateOption?.(inputValue, () => {
                                    setInputValue('');
                                    field.onChange(handleValueChange(fieldValue, inputValue));
                                    setOpen(false);
                                  });
                                }}
                              >
                                {loading ? <LoadingSpinner /> : <PlusCircle />}
                                {__('Add item', 'growfund')}
                              </Button>
                            ) : (
                              <div className="gf-w-full gf-flex gf-items-center gf-justify-center">
                                {__('No results found', 'growfund')}
                              </div>
                            )}
                          </CommandEmpty>

                          <CommandGroup>
                            {optionsToDisplay.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={String(option.value)}
                                keywords={[option.label]}
                                onSelect={(currentValue) => {
                                  field.onChange(handleValueChange(fieldValue, currentValue));
                                }}
                                className="gf-group/item"
                              >
                                <Check
                                  className={cn(
                                    'gf-size-4 gf-transition-opacity',
                                    fieldValue.includes(String(option.value))
                                      ? 'gf-opacity-100'
                                      : 'gf-opacity-0',
                                  )}
                                />
                                {option.label}

                                {allowDelete && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="gf-size-3 gf-text-icon-secondary gf-ms-auto hover:gf-text-icon-secondary-hover gf-transition-opacity gf-opacity-0 group-hover/item:gf-opacity-100"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onDeleteOption?.(option);
                                    }}
                                  >
                                    <X />
                                  </Button>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldValue.length > 0 && (
                    <div className="gf-flex gf-flex-wrap gf-gap-2 gf-m-3">
                      {options
                        .filter((option) => fieldValue.includes(String(option.value)))
                        .map((option, index) => (
                          <Badge key={index} variant="secondary">
                            {option.label}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="gf-size-4 gf-ml-1"
                              onClick={() => {
                                field.onChange(
                                  fieldValue.filter(
                                    (value) => String(value) !== String(option.value),
                                  ),
                                );
                              }}
                            >
                              <X className="gf-text-icon-primary" />
                            </Button>
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              </FormControl>
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}

export { MultiSelectField };
