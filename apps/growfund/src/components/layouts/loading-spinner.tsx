import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

const LoadingSpinner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <LoaderCircle className="gf-w-5 gf-h-5 gf-text-icon-secondary gf-animate-spin" />
      </div>
    );
  },
);

const LoadingSpinnerOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return createPortal(
    <div
      ref={ref}
      className={cn(
        'gf-fixed gf-inset-0 gf-bg-transparent gf-w-full gf-h-full gf-z-highest gf-flex gf-flex-1 gf-items-center gf-justify-center',
        className,
      )}
      {...props}
    >
      <LoaderCircle className="gf-w-5 gf-h-5 gf-text-icon-secondary gf-animate-spin" />
    </div>,
    document.getElementById('growfund-root') ?? document.body,
  );
});

LoadingSpinnerOverlay.displayName = 'LoadingSpinnerOverlay';
LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner, LoadingSpinnerOverlay };
