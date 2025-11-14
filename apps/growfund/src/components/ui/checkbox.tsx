import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { MinusIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer gf-h-4 gf-w-4 gf-shrink-0 gf-rounded-sm gf-border gf-border-border disabled:gf-cursor-not-allowed disabled:gf-opacity-50 gf-ring-offset-background',
        'focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2',
        'data-[state=checked]:gf-bg-background-fill-brand data-[state=checked]:gf-border-border-brand data-[state=checked]:gf-text-fg-light',
        'data-[state=indeterminate]:gf-bg-background-fill-brand data-[state=indeterminate]:gf-border-border-brand data-[state=indeterminate]:gf-text-fg-light',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('gf-flex gf-items-center gf-justify-center gf-text-current')}
      >
        {props.checked === 'indeterminate' ? (
          <MinusIcon className="gf-h-[0.875rem] gf-w-[0.875rem]" strokeWidth={3} />
        ) : (
          <CheckIcon className="gf-h-[0.875rem] gf-w-[0.875rem]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
