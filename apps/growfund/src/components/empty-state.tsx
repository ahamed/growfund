import React from 'react';

import { Box } from '@/components/ui/box';
import { cn } from '@/lib/utils';

const EmptyState = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Box
        className={cn(
          'gf-shadow-sm gf-border-none gf-flex gf-flex-col gf-items-center gf-justify-center gf-gap-2 gf-pt-6 gf-pb-12 gf-px-6',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

EmptyState.displayName = 'EmptyState';

const EmptyStateDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn('gf-typo-small gf-text-fg-secondary gf-text-center', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

EmptyStateDescription.displayName = 'EmptyStateDescription';

export { EmptyState, EmptyStateDescription };
