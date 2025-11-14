import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'gf-fixed gf-inset-0 gf-z-overlay gf-bg-black/80 gf-backdrop-blur-sm data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'gf-fixed gf-z-dialog gf-overflow-hidden gf-bg-background-surface-secondary gf-shadow-lg gf-rounded-tl-xl gf-rounded-tr-xl gf-mx-auto gf-transition gf-ease-in-out data-[state=closed]:gf-duration-300 data-[state=open]:gf-duration-500 data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out',
  {
    variants: {
      side: {
        top: 'gf-inset-x-0 gf-top-0 gf-border-b data-[state=closed]:gf-slide-out-to-top data-[state=open]:gf-slide-in-from-top',
        bottom:
          'gf-inset-x-0 gf-bottom-0 gf-border-t data-[state=closed]:gf-slide-out-to-bottom data-[state=open]:gf-slide-in-from-bottom',
        left: 'gf-inset-y-0 gf-left-0 gf-h-full gf-w-3/4 gf-border-r data-[state=closed]:gf-slide-out-to-left data-[state=open]:gf-slide-in-from-left sm:gf-max-w-sm',
        right:
          'gf-inset-y-0 gf-right-0 gf-h-full gf-w-3/4 gf-border-l data-[state=closed]:gf-slide-out-to-right data-[state=open]:gf-slide-in-from-right sm:gf-max-w-sm',
      },
      size: {
        regular: 'gf-max-w-[var(--gf-container-width-lg)]',
        md: 'gf-max-w-[var(--gf-container-width)]',
        sm: 'gf-max-w-[var(--gf-container-width-sm)]',
        xs: 'gf-max-w-[var(--gf-container-width-xs)]',
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'regular',
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal container={document.getElementById('growfund-root')}>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close asChild>
        <Button
          variant="secondary"
          size="icon"
          className="gf-absolute gf-z-popover gf-right-6 gf-top-3"
        >
          <X className="gf-h-4 gf-w-4" />
          <span className="gf-sr-only">Close</span>
        </Button>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'gf-flex gf-flex-col gf-space-y-2 gf-text-center sm:gf-text-left gf-border-b gf-border-b-border gf-min-h-[3.75rem] gf-h-fit gf-px-6 gf-py-4 gf-bg-background-surface',
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'gf-flex gf-flex-col-reverse sm:gf-flex-row sm:gf-justify-end sm:gf-space-x-2',
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      'gf-flex gf-items-center gf-gap-3 gf-typo-h6 gf-text-fg-primary gf-font-semibold [&>svg]:gf-size-6 [&>svg]:gf-text-icon-primary',
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('gf-typo-small gf-text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
