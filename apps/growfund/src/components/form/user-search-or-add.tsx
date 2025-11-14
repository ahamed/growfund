import { __, sprintf } from '@wordpress/i18n';
import { CommandEmpty, CommandList } from 'cmdk';
import { PlusCircleIcon, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { type FieldValues } from 'react-hook-form';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem } from '@/components/ui/command';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type MediaAttachment } from '@/schemas/media';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface UserOption {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: MediaAttachment | null;
}

interface FieldProps<T extends FieldValues> extends Omit<ControllerField<T>, 'readOnly'> {
  emptyString?: string;
  selectedValue?: string | null;
  onSelectChange?: (value?: string | null) => void;
  showAddButton?: boolean;
  onClickAddButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
  options: UserOption[];
  showClearBtn?: boolean;
  loading?: boolean;
}

const UserSearchOrAddField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
  placeholder = __('Search or Add donor', 'growfund'),
  emptyString = __('No Results found', 'growfund'),
  showAddButton = true,
  selectedValue,
  onSelectChange,
  onClickAddButton,
  searchValue,
  onSearchChange,
  options,
  showClearBtn,
  loading = false,
}: FieldProps<T>) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleOnSelect = (value: string | null) => {
    onSearchChange?.('');
    setOpen(false);
    onSelectChange?.(value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldValue = Array.isArray(field.value) ? (field.value as string[]) : [field.value];
        const selectedOption = options.find((option) => option.id === selectedValue);
        return (
          <FormItem className="gf-w-full gf-space-y-2">
            <div>
              {isDefined(label) && (
                <span className="gf-typo-h6 gf-font-medium gf-text-fg-primary gf-mb-3">
                  {label}
                </span>
              )}
            </div>
            <FormControl>
              <Command
                className={cn(
                  'gf-rounded-md gf-border gf-border-border gf-w-full',
                  fieldState.error && 'gf-border-border-critical',
                  className,
                )}
              >
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverAnchor>
                    <PopoverTrigger asChild>
                      {isDefined(selectedValue) && selectedValue !== '' ? (
                        <div className="gf-flex gf-py-2 gf-px-3 gf-items-center gf-justify-between">
                          <div className="gf-flex gf-items-center gf-gap-3">
                            <Avatar className="gf-w-8 gf-h-8">
                              <AvatarImage src={selectedOption?.image?.url} />
                            </Avatar>
                            <div className="gf-typo-tiny gf-flex gf-flex-col gf-gap-1">
                              <div className="gf-text-fg-primary gf-font-medium gf-max-w-96">
                                {sprintf(
                                  '%s %s',
                                  selectedOption?.first_name,
                                  selectedOption?.last_name,
                                )}
                              </div>
                              <div className="gf-text-fg-secondary gf-max-w-96 gf-truncate">
                                {selectedOption?.email}
                              </div>
                            </div>
                          </div>
                          {showClearBtn && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:gf-text-icon-critical"
                              onClick={() => {
                                handleOnSelect(null);
                              }}
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <CommandInput
                          ref={searchRef}
                          value={searchValue}
                          disabled={disabled}
                          placeholder={placeholder}
                          showSearchIcon={true}
                          onValueChange={onSearchChange}
                          onFocus={() => {
                            setOpen(true);
                          }}
                          onBlur={() => {
                            setOpen(false);
                          }}
                          onKeyDown={() => {
                            setOpen(true);
                          }}
                        />
                      )}
                    </PopoverTrigger>
                  </PopoverAnchor>
                  <PopoverContent
                    className="gf-w-[var(--radix-popover-trigger-width)] gf-p-0 gf-max-h-64 gf-overflow-auto gf-relative"
                    onWheel={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {showAddButton && (
                      <div className="gf-sticky gf-top-0 gf-z-20 gf-flex gf-border-b gf-border-border gf-gap-2 gf-typo-small gf-text-primary gf-cursor-default gf-bg-background-white">
                        <Button
                          variant="link"
                          className="gf-w-28"
                          onClick={(event) => onClickAddButton?.(event)}
                          disabled={loading}
                        >
                          {loading ? (
                            <LoadingSpinner />
                          ) : (
                            <PlusCircleIcon className="gf-size-4 gf-text-icon-primary" />
                          )}

                          {__('Add new', 'growfund')}
                        </Button>
                      </div>
                    )}
                    <CommandList>
                      <CommandEmpty className="gf-p-3">{emptyString}</CommandEmpty>
                      {options
                        .filter((option) => !fieldValue.includes(option.id))
                        .map((option) => {
                          const fullName = sprintf('%s %s', option.first_name, option.last_name);
                          return (
                            <CommandItem
                              className="gf-px-3 gf-cursor-pointer"
                              key={option.id}
                              keywords={[fullName]}
                              value={option.id}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                              onSelect={(currentValue) => {
                                handleOnSelect(currentValue);
                              }}
                            >
                              <div className="gf-flex gf-gap-3 gf-items-center">
                                <Avatar>
                                  <AvatarImage src={option.image?.url} />
                                  <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="gf-typo-tiny gf-flex gf-flex-col gf-gap-1">
                                  <div className="gf-text-fg-primary gf-font-medium gf-max-w-96">
                                    {fullName}
                                  </div>
                                  <div
                                    className="gf-text-fg-secondary gf-max-w-96 gf-truncate"
                                    title={option.email}
                                  >
                                    {option.email}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          );
                        })}
                    </CommandList>
                  </PopoverContent>
                </Popover>
              </Command>
            </FormControl>
            {isDefined(description) && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    ></FormField>
  );
};
export { UserSearchOrAddField };
