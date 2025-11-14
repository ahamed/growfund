import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const progressVariants = cva(
  'gf-relative gf-h-2 gf-w-full gf-overflow-hidden gf-rounded-full gf-bg-background-fill-tertiary',
  {
    variants: {
      size: {
        default: 'gf-h-2',
        sm: 'gf-h-1',
        lg: 'gf-h-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>
>(({ className, value, size = 'default', ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="gf-h-full gf-w-full gf-flex-1 gf-bg-background-fill-brand gf-transition-all gf-rounded-full"
      style={{ transform: `translateX(-${String(100 - (value ?? 0))}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
