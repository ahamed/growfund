import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'gf-inline-flex gf-gap-1 gf-items-center gf-rounded-md gf-border gf-px-2 gf-py-1 gf-typo-tiny gf-transition-colors focus:gf-outline-none focus:gf-ring-2 focus:gf-ring-ring focus:gf-ring-offset-2 gf-max-h-[1.5rem]',
  {
    variants: {
      variant: {
        primary:
          'gf-border-transparent gf-bg-background-fill-success-secondary gf-text-fg-success hover:gf-bg-background-fill-success-secondary/80',
        secondary:
          'gf-border-transparent gf-bg-background-surface-secondary gf-bg-border gf-text-fg-primary hover:gf-bg-border/80',
        destructive:
          'gf-border-transparent gf-bg-background-fill-critical-secondary gf-text-fg-critical hover:gf-bg-background-fill-critical-secondary/80',
        warning:
          'gf-border-transparent gf-bg-background-fill-warning-secondary gf-text-fg-warning hover:gf-bg-background-fill-warning-secondary/80',
        info: 'gf-border-transparent gf-bg-background-fill-special-secondary gf-text-fg-special-2 hover:gf-bg-background-fill-special-secondary/80',
        special:
          'gf-border-transparent gf-bg-background-fill-special-2-secondary gf-text-fg-special-3 hover:gf-bg-background-fill-special-2-secondary/80',
        outline: 'gf-text-fg-primary',
        ghost: 'gf-border-none gf-bg-transparent gf-text-fg-primary',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} ref={ref} />;
  },
);

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants, type BadgeVariant };
