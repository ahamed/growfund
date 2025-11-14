import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TabsRoot = TabsPrimitive.Root;

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsRoot ref={ref} className={cn('gf-w-full', className)} {...props} />
));

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'gf-inline-flex gf-h-9 gf-items-center gf-justify-start gf-rounded-none gf-bg-transparent gf-p-0 gf-border-b gf-border-b-border gf-w-full',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'gf-inline-flex gf-items-center gf-justify-center gf-whitespace-nowrap gf-text-fg-secondary gf-relative gf-p-1 gf-typo-small gf-font-medium gf-ring-offset-background gf-transition-all focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2 disabled:gf-pointer-events-none disabled:gf-opacity-50 gf-h-9 gf-rounded-none gf-border-b-2 gf-border-b-transparent gf-bg-transparent gf-px-4 gf-pb-3 gf-pt-2 gf-shadow-none data-[state=active]:gf-border-b-border-inverse data-[state=active]:gf-text-fg-primary',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'gf-ring-offset-background focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring focus-visible:gf-ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
