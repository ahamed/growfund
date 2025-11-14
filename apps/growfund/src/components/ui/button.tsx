import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'gf-inline-flex gf-items-center gf-justify-center gf-gap-2 gf-typo-small gf-font-medium  gf-whitespace-nowrap gf-rounded-md gf-transition-colors focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2 disabled:gf-pointer-events-none disabled:gf-opacity-50 [&_svg]:gf-pointer-events-none [&_svg]:gf-size-4 [&_svg]:gf-shrink-0 gf-relative',
  {
    variants: {
      variant: {
        primary:
          'gf-bg-background-fill-brand-var gf-text-fg-light-var gf-border-border hover:gf-bg-background-fill-brand-hover-var',
        destructive:
          'gf-bg-background-fill-critical gf-text-fg-light hover:gf-bg-background-fill-critical/90',
        'primary-soft': 'gf-bg-background-fill-success-secondary gf-text-fg-success',
        'destructive-soft': 'gf-bg-background-fill-critical-secondary gf-text-fg-critical',
        outline:
          'gf-border gf-border-border gf-bg-background-fill hover:gf-bg-background-fill-hover hover:gf-text-fg-primary',
        secondary:
          'gf-bg-background-fill-secondary gf-text-fg-primary hover:gf-bg-background-fill-secondary-hover',
        ghost: 'gf-text-fg-primary hover:gf-bg-background-fill-hover',
        link: 'gf-text-fg-primary gf-underline-offset-4 hover:gf-underline',
      },
      size: {
        default: 'gf-h-9 gf-px-4 gf-py-2',
        sm: 'gf-h-8 gf-rounded-md gf-px-3 gf-typo-tiny',
        lg: 'gf-h-10 gf-rounded-md gf-px-8',
        icon: 'gf-h-9 gf-w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>['variant'];

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      type = 'button',
      asChild = false,
      children,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        {...props}
      >
        {loading && (
          <span className="gf-absolute gf-left-[50%] gf-top-[50%] gf-translate-x-[-50%] gf-translate-y-[-50%] gf-w-full gf-h-full gf-backdrop-blur-2xl gf-flex gf-items-center gf-justify-center gf-rounded-md">
            <Loader2 className="gf-size-4 gf-animate-spin" />
          </span>
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
