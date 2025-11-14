import React from 'react';

import { cn } from '@/lib/utils';

const DotSeparator = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        {...props}
        className={cn('gf-size-1 gf-bg-icon-disabled gf-rounded-full', className)}
      />
    );
  },
);

DotSeparator.displayName = 'DotSeparator';

export { DotSeparator };
