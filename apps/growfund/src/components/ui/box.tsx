import React from 'react';

import { cn } from '@/lib/utils';

const Box = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gf-bg-background-surface gf-rounded-md gf-shadow-sm gf-border gf-border-border gf-group/box',
          className,
        )}
        {...props}
      />
    );
  },
);

Box.displayName = 'Box';

const BoxTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h6
        ref={ref}
        className={cn(
          'gf-typo-h6 gf-font-semibold gf-text-fg-primary gf-w-full gf-flex gf-items-center gf-gap-2 [&>[data-type=tooltip]]:gf-opacity-0 group-hover/box:[&>[data-type=tooltip]]:gf-opacity-100 gf-transition-opacity',
          className,
        )}
        {...props}
      />
    );
  },
);

BoxTitle.displayName = 'BoxTitle';

const BoxContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('gf-p-4 gf-w-full', className)} {...props} />;
  },
);

BoxContent.displayName = 'BoxContent';

export { Box, BoxContent, BoxTitle };
