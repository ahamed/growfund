import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value ref={ref} className={cn('gf-truncate', className)} {...props} />
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'gf-flex gf-w-full gf-items-center gf-justify-between gf-whitespace-nowrap gf-rounded-md gf-border gf-border-border gf-bg-transparent gf-px-3 gf-py-2 gf-typo-small gf-ring-offset-background [&[data-placeholder]]:gf-text-fg-subdued focus:gf-outline-none focus:gf-ring-2 focus:gf-ring-ring focus:gf-ring-offset-2 disabled:gf-cursor-not-allowed disabled:gf-opacity-50 gf-h-9 [&>span]:gf-line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="gf-size-4 gf-opacity-50 gf-ms-2" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('gf-flex gf-cursor-default gf-items-center gf-justify-center gf-py-1', className)}
    {...props}
  >
    <ChevronUp className="gf-h-4 gf-w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('gf-flex gf-cursor-default gf-items-center gf-justify-center gf-py-1', className)}
    {...props}
  >
    <ChevronDown className="gf-h-4 gf-w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal container={document.getElementById('growfund-root')}>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'gf-relative gf-z-dialog gf-max-h-96 gf-min-w-[8rem] gf-overflow-hidden gf-rounded-md gf-border gf-bg-popover gf-text-popover-fg gf-shadow-md data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0 data-[state=closed]:gf-zoom-out-95 data-[state=open]:gf-zoom-in-95 data-[side=bottom]:gf-slide-in-from-top-2 data-[side=left]:gf-slide-in-from-right-2 data-[side=right]:gf-slide-in-from-left-2 data-[side=top]:gf-slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:gf-translate-y-1 data-[side=left]:-gf-translate-x-1 data-[side=right]:gf-translate-x-1 data-[side=top]:-gf-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'gf-p-1',
          position === 'popper' &&
            'gf-h-[var(--radix-select-trigger-height)] gf-w-full gf-min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('gf-px-2 gf-py-1.5 gf-typo-small gf-font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'gf-relative gf-flex gf-w-full gf-cursor-default gf-select-none gf-items-center gf-rounded-sm gf-py-1.5 gf-pl-2 gf-pr-8 gf-typo-small gf-outline-none focus:gf-bg-accent focus:gf-text-fg-accent data-[disabled]:gf-pointer-events-none data-[disabled]:gf-opacity-50',
      className,
    )}
    {...props}
  >
    <span className="gf-absolute gf-right-2 gf-flex gf-h-3.5 gf-w-3.5 gf-items-center gf-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="gf-h-4 gf-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('gf--mx-1 gf-my-1 gf-h-px gf-bg-border', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
