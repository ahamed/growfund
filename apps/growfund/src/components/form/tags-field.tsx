import { __ } from '@wordpress/i18n';
import { Check, ChevronsUpDown, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';

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
import { useCreateTagMutation, useGetTagsQuery } from '@/features/tags/services/tag';
import { useQueryToOption } from '@/hooks/use-query-to-option';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface TagsFieldProps<T extends FieldValues> extends Omit<ControllerField<T>, 'readOnly'> {
  addItemLabel?: string;
}

function TagsField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
  placeholder = __('Type to add items...', 'growfund'),
  addItemLabel = __('Add item', 'growfund'),
}: TagsFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const tagsQuery = useGetTagsQuery();
  const options = useQueryToOption(tagsQuery, 'id', 'name');
  const createTagMutation = useCreateTagMutation();

  const createNewTag = (title: string, field: ControllerRenderProps<T, Path<T>>) => {
    createTagMutation.mutate(
      { name: title, description: null, slug: null },
      {
        onSuccess(data) {
          field.onChange([...field.value, data.id]);
        },
      },
    );

    setValue('');
    setOpen(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldValue = (field.value ?? []) as string[];
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
                          'gf-w-full gf-justify-start gf-py-1 gf-px-3 gf-text-fg-secondary gf-font-regular gf-cursor-text hover:gf-bg-transparent gf-border-none focus-visible:gf-ring-0 focus-visible:gf-ring-offset-0',
                          fieldState.error && 'gf-bg-background-fill-critical-secondary',
                        )}
                        disabled={disabled}
                      >
                        {placeholder}
                        <ChevronsUpDown className="gf-ml-auto gf-opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    {isDefined(fieldValue) && fieldValue.length > 0 && (
                      <Separator
                        className={cn(fieldState.error && 'gf-bg-background-fill-critical')}
                      />
                    )}

                    <PopoverContent className="gf-w-[var(--radix-popover-trigger-width)] gf-p-0">
                      <Command className="gf-w-full">
                        <CommandInput
                          placeholder={placeholder}
                          onValueChange={setValue}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              event.stopPropagation();
                              createNewTag(value, field);
                            }
                          }}
                        />
                        <CommandList>
                          <CommandEmpty className="gf-py-2">
                            <Button
                              variant="link"
                              onClick={() => {
                                createNewTag(value, field);
                              }}
                            >
                              {createTagMutation.isPending ? <LoadingSpinner /> : <PlusCircle />}
                              {addItemLabel}
                            </Button>
                          </CommandEmpty>
                          <CommandGroup>
                            {options.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={String(option.value)}
                                keywords={[option.label]}
                                onSelect={(currentValue) => {
                                  field.onChange(
                                    fieldValue.includes(currentValue)
                                      ? fieldValue.filter((value) => value !== currentValue)
                                      : [...fieldValue, currentValue],
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    'gf-size-4 gf-transition-opacity',
                                    fieldValue.includes(option.value)
                                      ? 'gf-opacity-100'
                                      : 'gf-opacity-0',
                                  )}
                                />
                                {option.label}
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
                        .filter((option) => fieldValue.includes(option.value))
                        .map((option, index) => (
                          <Badge key={index} variant="secondary">
                            {option.label}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="gf-size-4 gf-ml-1"
                              onClick={() => {
                                field.onChange(
                                  fieldValue.filter((value) => value !== option.value),
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

export { TagsField };
