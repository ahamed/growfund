import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'gf-flex gf-min-h-[3.75rem] gf-w-full gf-rounded-md gf-border gf-border-border gf-bg-transparent gf-px-3 gf-py-2 gf-typo-small gf-text-fg-primary placeholder:gf-text-fg-subdued placeholder:gf-font-regular gf-ring-offset-2 focus-visible:gf-ring-2 focus-visible:gf-ring-ring disabled:gf-cursor-not-allowed disabled:gf-opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
