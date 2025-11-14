import React from 'react';

import { cn } from '@/lib/utils';

const TableCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gf-border gf-border-border gf-bg-background-white gf-rounded-md gf-overflow-hidden',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TableCard.displayName = 'TableCard';

const TableCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gf-bg-background-white gf-p-3 gf-border-b gf-border-b-border gf-flex',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TableCardHeader.displayName = 'TableCardHeader';

const TableCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-p-4', className)} {...props}>
        {children}
      </div>
    );
  },
);

TableCardContent.displayName = 'TableCardContent';

export { TableCard, TableCardContent, TableCardHeader };
