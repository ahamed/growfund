import { InfoCircledIcon } from '@radix-ui/react-icons';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const Arrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal container={document.getElementById('growfund-root')}>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'gf-z-dialog gf-overflow-hidden gf-rounded-md gf-bg-background-dark gf-px-3 gf-py-1.5 gf-typo-tiny gf-text-white gf-animate-in gf-fade-in-0 gf-zoom-in-95 data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=closed]:gf-zoom-out-95 data-[side=bottom]:gf-slide-in-from-top-2 data-[side=left]:gf-slide-in-from-right-2 data-[side=right]:gf-slide-in-from-left-2 data-[side=top]:gf-slide-in-from-bottom-2',
        'gf-max-h-[var(--radix-tooltip-content-available-height)]',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const InfoTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip {...props} delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="gf-size-6" data-type="tooltip">
              <InfoCircledIcon className="gf-text-icon-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div ref={ref} className={cn('gf-max-w-64', className)} {...props}>
              {children}
            </div>
            <Arrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

InfoTooltip.displayName = 'InfoTooltip';

export { InfoTooltip, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
