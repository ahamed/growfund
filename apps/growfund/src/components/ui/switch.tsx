import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, value, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer gf-inline-flex gf-h-5 gf-w-9 gf-shrink-0 gf-cursor-pointer gf-items-center gf-rounded-full gf-border-2 gf-border-transparent gf-transition-colors disabled:gf-cursor-not-allowed disabled:gf-opacity-50',
      'focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2',
      'data-[state=checked]:gf-bg-background-fill-brand data-[state=unchecked]:gf-bg-background-fill-tertiary',
      className,
    )}
    {...props}
    value={value ?? undefined}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'gf-pointer-events-none gf-block gf-h-4 gf-w-4 gf-rounded-full gf-bg-white gf-ring-0 gf-transition-transform data-[state=checked]:gf-translate-x-4 data-[state=unchecked]:gf-translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
