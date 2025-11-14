import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'gf-px-5 gf-py-3 gf-border-l-4 gf-rounded-sm gf-shadow-sm gf-typo-small gf-space-y-2 [&_[data-alert-title]]:gf-typo-paragraph [&_[data-alert-title]]:gf-font-medium',
  {
    variants: {
      variant: {
        default: 'gf-bg-background-surface-secondary gf-border-l-border-ring gf-text-fg-primary',
        warning:
          'gf-bg-background-fill-warning-secondary gf-border-l-border-warning gf-text-fg-caution',
        destructive:
          'gf-bg-background-fill-critical-secondary gf-border-l-icon-critical gf-text-fg-critical',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type AlertVariants = VariantProps<typeof alertVariants>['variant'];

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('gf-border-border-ring', alertVariants({ variant, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} data-alert-title className={className} {...props}>
        {children}
      </div>
    );
  },
);

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} data-alert-description className={className} {...props}>
        {children}
      </div>
    );
  },
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle, type AlertVariants };
