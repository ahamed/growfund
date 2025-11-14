import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'gf-relative gf-flex gf-w-full gf-touch-none gf-select-none gf-items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="gf-relative gf-h-1.5 gf-w-full gf-grow gf-overflow-hidden gf-rounded-full gf-bg-background-fill-tertiary">
      <SliderPrimitive.Range className="gf-absolute gf-h-full gf-bg-background-fill-brand" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="gf-block gf-h-4 gf-w-4 gf-rounded-full gf-border gf-border-border-hover gf-bg-background-surface gf-transition-colors focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-offset-2 focus-visible:gf-ring-ring disabled:gf-pointer-events-none disabled:gf-opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
