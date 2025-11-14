import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'gf-flex gf-cursor-default gf-select-none gf-items-center gf-gap-2 gf-rounded-sm gf-px-2 gf-py-1.5 gf-typo-small gf-outline-none focus:gf-bg-accent data-[state=open]:gf-bg-accent [&_svg]:gf-pointer-events-none [&_svg]:gf-size-4 [&_svg]:gf-shrink-0',
      inset && 'gf-pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="gf-ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'gf-z-50 gf-min-w-[8rem] gf-overflow-hidden gf-rounded-md gf-border gf-bg-popover gf-p-1 gf-text-fg-primary gf-shadow-lg data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0 data-[state=closed]:gf-zoom-out-95 data-[state=open]:gf-zoom-in-95 data-[side=bottom]:gf-slide-in-from-top-2 data-[side=left]:gf-slide-in-from-right-2 data-[side=right]:gf-slide-in-from-left-2 data-[side=top]:gf-slide-in-from-bottom-2 gf-origin-[--radix-dropdown-menu-content-transform-origin]',
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal container={document.getElementById('growfund-root')}>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'gf-z-50 gf-max-h-[var(--radix-dropdown-menu-content-available-height)] gf-min-w-[8rem] gf-overflow-y-auto gf-overflow-x-hidden gf-rounded-md gf-border gf-bg-popover gf-p-1 gf-text-popover-foreground gf-shadow-md',
        'data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0 data-[state=closed]:gf-zoom-out-95 data-[state=open]:gf-zoom-in-95 data-[side=bottom]:gf-slide-in-from-top-2 data-[side=left]:gf-slide-in-from-right-2 data-[side=right]:gf-slide-in-from-left-2 data-[side=top]:gf-slide-in-from-bottom-2 gf-origin-[--radix-dropdown-menu-content-transform-origin]',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'gf-relative gf-flex gf-cursor-default gf-select-none gf-items-center gf-gap-2 gf-rounded-sm gf-px-2 gf-py-1.5 gf-typo-small gf-outline-none gf-transition-colors focus:gf-bg-accent focus:gf-text-accent-foreground   data-[disabled]:gf-pointer-events-none data-[disabled]:gf-opacity-50 [&>svg]:gf-size-4 [&>svg]:gf-shrink-0',
      inset && 'gf-pl-8',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'gf-relative gf-flex gf-cursor-default gf-select-none gf-items-center gf-rounded-sm gf-py-1.5 gf-pl-8 gf-pr-2 gf-typo-small gf-outline-none gf-transition-colors gf-focus:gf-bg-accent gf-focus:gf-text-accent-foreground data-[disabled]:gf-pointer-events-none data-[disabled]:gf-opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="gf-absolute gf-left-2 gf-flex gf-h-3.5 gf-w-3.5 gf-items-center gf-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="gf-h-4 gf-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'gf-relative gf-flex gf-cursor-default gf-select-none gf-items-center gf-rounded-sm gf-py-1.5 gf-pl-8 gf-pr-2 gf-typo-small gf-outline-none gf-transition-colors gf-focus:gf-bg-accent gf-focus:gf-text-accent-foreground data-[disabled]:gf-pointer-events-none data-[disabled]:gf-opacity-50',
      className,
    )}
    {...props}
  >
    <span className="gf-absolute gf-left-2 gf-flex gf-h-3.5 gf-w-3.5 gf-items-center gf-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="gf-h-2 gf-w-2 gf-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'gf-px-2 gf-py-1.5 gf-typo-small gf-font-semibold',
      inset && 'gf-pl-8',
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('gf--mx-1 gf-my-1 gf-h-px gf-bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('gf-ml-auto gf-text-xs gf-tracking-widest gf-opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
