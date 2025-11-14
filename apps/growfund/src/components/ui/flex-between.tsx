import React from 'react';

import { cn } from '@/lib/utils';

const FlexBetween = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('gf-flex gf-items-center gf-justify-between', className)}
        {...props}
      />
    );
  },
);

FlexBetween.displayName = 'FlexBetween';

export { FlexBetween };
