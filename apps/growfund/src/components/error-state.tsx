import { __ } from '@wordpress/i18n';
import React from 'react';

import { ErrorIcon } from '@/app/icons';
import { Container } from '@/components/layouts/container';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ErrorState = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Container size="sm">
        <Box
          className={cn(
            'gf-shadow-sm gf-border-none gf-flex gf-flex-col gf-items-center gf-justify-center gf-gap-2 gf-p-6',
            className,
          )}
          ref={ref}
          {...props}
        >
          <ErrorIcon />
          {children}
        </Box>
      </Container>
    );
  },
);

ErrorState.displayName = 'ErrorState';

const ErrorStateDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'gf-typo-small gf-text-fg-secondary gf-text-center gf-flex gf-flex-col gf-items-center gf-space-y-4',
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
      <Button
        className="gf-mt-4"
        onClick={() => {
          window.history.back();
        }}
        variant="outline"
      >
        {__('Go Back', 'growfund')}
      </Button>
    </div>
  );
});

ErrorStateDescription.displayName = 'ErrorStateDescription';

export { ErrorState, ErrorStateDescription };
