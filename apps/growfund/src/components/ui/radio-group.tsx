import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root className={cn('gf-grid gf-gap-2', className)} {...props} ref={ref} />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'gf-aspect-square gf-h-4 gf-w-4 gf-rounded-full gf-border gf-border-icon-primary gf-text-fg-primary focus:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2 disabled:gf-cursor-not-allowed disabled:gf-opacity-50 data-[state=checked]:gf-border-background-fill-brand',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="gf-flex gf-items-center gf-justify-center">
        <Circle className="gf-h-3 gf-w-3 gf-border-0 gf-fill-background-fill-brand gf-stroke-none" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
