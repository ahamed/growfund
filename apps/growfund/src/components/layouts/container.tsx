import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

const containerVariants = cva('gf-w-full gf-mx-auto gf-h-full gf-px-4 @5xl/main:gf-px-0', {
  variants: {
    size: {
      default: 'gf-max-w-[var(--gf-container-width)]',
      lg: 'gf-max-w-[var(--gf-container-width-lg)]',
      sm: 'gf-max-w-[var(--gf-container-width-sm)]',
      xs: 'gf-max-w-[var(--gf-container-width-xs)]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof containerVariants>;

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size, className, ...props }, ref) => {
    return (
      <div className="gf-@container/main gf-w-full gf-h-full">
        <div className={cn(containerVariants({ size, className }))} ref={ref} {...props}>
          {children}
        </div>
      </div>
    );
  },
);

Container.displayName = 'Container';
export { Container };
