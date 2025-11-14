import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal container={document.getElementById('growfund-root')}>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'gf-z-popover gf-w-72 gf-rounded-md gf-border gf-bg-background-surface gf-p-4 gf-text-fg-primary gf-shadow-md gf-outline-none data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0 data-[state=closed]:gf-zoom-out-95 data-[state=open]:gf-zoom-in-95 data-[side=bottom]:gf-slide-in-from-top-2 data-[side=left]:gf-slide-in-from-right-2 data-[side=right]:gf-slide-in-from-left-2 data-[side=top]:gf-slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverPortal, PopoverTrigger };
