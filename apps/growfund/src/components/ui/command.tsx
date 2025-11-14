import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import * as React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'gf-flex gf-h-full gf-w-full gf-flex-col gf-overflow-hidden gf-rounded-md gf-bg-background-surface gf-text-fg-primary',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="gf-overflow-hidden gf-p-0">
        <Command className="[&_[cmdk-group-heading]]:gf-px-2 [&_[cmdk-group-heading]]:gf-font-medium [&_[cmdk-group-heading]]:gf-text-fg-muted [&_[cmdk-group]:gf-not([hidden])_~[cmdk-group]]:gf-pt-0 [&_[cmdk-group]]:gf-px-2 [&_[cmdk-input-wrapper]_svg]:gf-h-5 [&_[cmdk-input-wrapper]_svg]:gf-w-5 [&_[cmdk-input]]:gf-h-12 [&_[cmdk-item]]:gf-px-2 [&_[cmdk-item]]:gf-py-3 [&_[cmdk-item]_svg]:gf-h-5 [&_[cmdk-item]_svg]:gf-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    showSearchIcon?: boolean;
    wrapperClassName?: string;
  }
>(({ className, showSearchIcon = true, wrapperClassName, ...props }, ref) => (
  <div className={cn('gf-flex gf-items-center gf-px-3', wrapperClassName)} cmdk-input-wrapper="">
    {showSearchIcon && <Search className="gf-mr-2 gf-h-4 gf-w-4 gf-shrink-0 gf-opacity-50" />}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'gf-flex gf-h-9 gf-w-full gf-rounded-md gf-bg-transparent gf-border-0 gf-px-0 focus:gf-shadow-none focus-visible:gf-shadow-none gf-py-3 gf-typo-small gf-outline-none placeholder:gf-text-fg-secondary disabled:gf-cursor-not-allowed disabled:gf-opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <div className="gf-max-h-[18.75rem] gf-flex gf-flex-1 gf-flex-col gf-overflow-y-auto" ref={ref}>
    <CommandPrimitive.List className={cn('', className)} {...props} />
  </div>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="gf-py-6 gf-text-center gf-typo-small" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'gf-overflow-y-auto gf-p-1 gf-text-fg-secondary [&_[cmdk-group-heading]]:gf-px-2 [&_[cmdk-group-heading]]:gf-py-1.5 [&_[cmdk-group-heading]]:gf-text-xs [&_[cmdk-group-heading]]:gf-font-medium [&_[cmdk-group-heading]]:gf-text-fg-secondary',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-gf-mx-1 gf-h-px gf-bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'gf-relative gf-flex gf-cursor-default gf-gap-2 gf-select-none gf-items-center gf-rounded-sm gf-px-2 gf-py-1.5 gf-typo-small gf-text-fg-primary gf-outline-none data-[disabled=true]:gf-pointer-events-none data-[selected=true]:gf-bg-accent data-[selected=true]:gf-text-fg-accent data-[disabled=true]:gf-opacity-50 [&_svg]:gf-pointer-events-none [&_svg]:gf-size-4 [&_svg]:gf-shrink-0',
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('gf-ml-auto gf-typo-tiny gf-tracking-widest gf-text-fg-secondary', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
