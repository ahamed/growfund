import React from 'react';

import { cn } from '@/lib/utils';

const DecisionBox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gf-relative gf-w-full gf-bg-background-surface gf-p-8 gf-rounded-3xl gf-shadow-xl gf-overflow-hidden',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export default DecisionBox;
