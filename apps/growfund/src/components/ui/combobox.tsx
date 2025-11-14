import { CheckIcon } from '@radix-ui/react-icons';
import { useVirtualizer } from '@tanstack/react-virtual';
import { __ } from '@wordpress/i18n';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { type Option } from '@/types';

interface ComboboxOptionsListProps {
  searchPlaceholder: string;
  emptyMessage: string;
  options: Option<string>[];
  onSelect?: (value: string) => void;
  value: string;
  setValue: (value: string) => void;
  setOpen: (open: boolean) => void;
  onAddNewItem?: (value: string) => Promise<boolean>;
  addItemLabel?: string;
  showAddItemButton?: boolean;
}

function ComboboxOptionsList({
  searchPlaceholder,
  emptyMessage,
  options,
  onSelect,
  value,
  setValue,
  setOpen,
  onAddNewItem,
  addItemLabel,
  showAddItemButton,
}: ComboboxOptionsListProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!input.trim()) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(input.toLowerCase()));
  }, [input, options]);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder={searchPlaceholder}
        wrapperClassName="gf-border-b gf-border-b-border"
        value={input}
        onValueChange={setInput}
      />
      {showAddItemButton && !!input ? (
        <CommandEmpty className="gf-pt-2">
          <Button
            variant="link"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLoading(true);
              void onAddNewItem?.(input)
                .then((status) => {
                  setOpen(!status);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : <PlusCircle />}
            {addItemLabel}
          </Button>
        </CommandEmpty>
      ) : (
        <CommandEmpty>{emptyMessage}</CommandEmpty>
      )}
      <CommandGroup>
        <div ref={parentRef} style={{ maxHeight: '25rem', overflow: 'auto' }}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const option = filteredOptions[virtualItem.index];
              return (
                <CommandItem
                  key={virtualItem.key}
                  value={option.value}
                  keywords={[option.label]}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    onSelect?.(currentValue);
                  }}
                  className="gf-absolute gf-top-0 gf-left-0 gf-w-full"
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {option.icon && <span>{option.icon}</span>}

                  <span className="gf-truncate">{option.label}</span>
                  <CheckIcon
                    className={cn(
                      'gf-ml-auto gf-h-4 gf-w-4',
                      value === option.value ? 'gf-opacity-100' : 'gf-opacity-0',
                    )}
                  />
                </CommandItem>
              );
            })}
          </div>
        </div>
      </CommandGroup>
    </Command>
  );
}

interface ComboboxProps {
  options: Option<string>[];
  onSelect?: (value: string) => void;
  hasError?: boolean;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onAddNewItem?: (value: string) => Promise<boolean>;
  addItemLabel?: string;
  showAddItemButton?: boolean;
}

const Combobox = ({
  options,
  onSelect,
  hasError = false,
  className,
  disabled = false,
  defaultValue,
  placeholder = __('Select an option', 'growfund'),
  searchPlaceholder = __('Search...', 'growfund'),
  emptyMessage = __('No results found.', 'growfund'),
  onAddNewItem,
  addItemLabel = __('Add item', 'growfund'),
  showAddItemButton = false,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? '');
  const isMobile = useIsMobile();

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  if (isMobile) {
    return (
      <Drawer open={disabled ? false : open} onOpenChange={setOpen}>
        <DrawerTitle />
        <DrawerDescription />
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'gf-min-w-[12.5rem] gf-bg-background-white gf-justify-between gf-w-full hover:gf-bg-gray-50 gf-overflow-hidden',
              hasError &&
                'gf-border-border-critical gf-bg-background-fill-critical-secondary hover:gf-bg-background-fill-critical-secondary',
              disabled && 'gf-opacity-50',
              className,
            )}
          >
            {value ? options.find((option) => option.value === value)?.label : placeholder}
            <ChevronsUpDown className="gf-ml-2 gf-h-4 gf-w-4 gf-shrink-0 gf-opacity-50" />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="gf-z-highest">
          <ComboboxOptionsList
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            options={options}
            onSelect={onSelect}
            value={value}
            setValue={setValue}
            setOpen={setOpen}
            onAddNewItem={onAddNewItem}
            addItemLabel={addItemLabel}
            showAddItemButton={showAddItemButton}
          />
        </DrawerContent>
      </Drawer>
    );
  }
  const renderSelectedValue = () => {
    if (!value) {
      return <span className="gf-text-fg-subdued hover:gf-text-fg-subdued">{placeholder}</span>;
    }
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      return (
        <span>
          {!!selectedOption.icon && <span className="gf-mr-2">{selectedOption.icon}</span>}
          <span>{selectedOption.label}</span>
        </span>
      );
    }
    return <span className="gf-text-fg-subdued hover:gf-text-fg-subdued">{placeholder}</span>;
  };

  return (
    <Popover open={disabled ? false : open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'gf-min-w-[12.5rem] gf-justify-between gf-w-full gf-pe-[0.625rem] hover:gf-bg-background-white gf-typo-small gf-text-fg-primary gf-font-regular [&>span]:gf-line-clamp-1',
            hasError &&
              'gf-border-border-critical gf-bg-background-fill-critical-secondary hover:gf-bg-background-fill-critical-secondary',
            disabled && 'gf-opacity-50',
            className,
          )}
        >
          {renderSelectedValue()}
          <ChevronsUpDown className="gf-ml-2 gf-h-4 gf-w-4 gf-shrink-0 gf-opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        onWheel={(event) => {
          event.stopPropagation();
        }}
        className="gf-min-w-[12.5rem] gf-p-0 gf-w-[var(--radix-popover-trigger-width)]"
      >
        <ComboboxOptionsList
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          options={options}
          onSelect={onSelect}
          value={value}
          setValue={setValue}
          setOpen={setOpen}
          onAddNewItem={onAddNewItem}
          addItemLabel={addItemLabel}
          showAddItemButton={showAddItemButton}
        />
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
