import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'gf-fixed gf-inset-0 gf-z-overlay gf-bg-background-dark/80 data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [isWPMediaOpen, setIsWPMediaOpen] = React.useState(false);

  React.useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<{ isOpen: boolean }>).detail;
      setIsWPMediaOpen(detail.isOpen);
    };
    window.addEventListener('wp-media-open', handle);

    return () => {
      window.removeEventListener('wp-media-open', handle);
    };
  });

  return (
    <DialogPortal container={document.getElementById('growfund-root')}>
      {!isWPMediaOpen && <DialogOverlay className="gf-bg-background-dark/80 gf-backdrop-blur-sm" />}

      <DialogPrimitive.Content
        ref={ref}
        aria-describedby=""
        className={cn(
          'gf-fixed gf-left-[50%] gf-top-[50%] gf-grid gf-w-full gf-max-w-lg gf-translate-x-[-50%] gf-translate-y-[-50%] gf-gap-4 gf-border gf-bg-background-secondary gf-overflow-hidden gf-z-dialog gf-shadow-lg gf-duration-200 data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-fade-out-0 data-[state=open]:gf-fade-in-0 data-[state=closed]:gf-zoom-out-95 data-[state=open]:gf-zoom-in-95 data-[state=closed]:gf-slide-out-to-left-1/2 data-[state=closed]:gf-slide-out-to-top-[48%] data-[state=open]:gf-slide-in-from-left-1/2 data-[state=open]:gf-slide-in-from-top-[48%] sm:gf-rounded-lg',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogCloseButton = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Close
      ref={ref}
      className={cn(
        'gf-absolute gf-right-4 gf-top-3 gf-rounded-sm gf-opacity-70 gf-size-8 gf-flex gf-items-center gf-justify-center gf-ring-offset-background !gf-bg-background-fill-secondary gf-transition-opacity hover:gf-opacity-100 focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2 disabled:gf-pointer-events-none data-[state=open]:gf-bg-accent data-[state=open]:gf-text-fg-muted',
        className,
      )}
      {...props}
    >
      <X className="gf-size-4" />
      <span className="gf-sr-only">Close</span>
    </DialogPrimitive.Close>
  );
});
DialogCloseButton.displayName = 'DialogCloseButton';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'gf-flex gf-py-3 gf-px-4 gf-text-center gf-min-h-[3.75rem] gf-items-center gf-bg-background-white gf-border-b gf-border-b-border sm:gf-text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'gf-flex gf-flex-col-reverse gf-bg-background-white sm:gf-flex-row sm:gf-justify-end sm:gf-space-x-2 gf-px-4 gf-py-3 gf-border-t gf-border-t-border gf-relative gf-z-highest',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'gf-typo-h6 gf-font-medium gf-leading-none gf-tracking-tight gf-text-fg-primary',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('gf-typo-small gf-text-fg-muted', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
