import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'gf-relative gf-z-10 gf-flex gf-max-w-max gf-flex-1 gf-items-center gf-justify-center',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'gf-group gf-flex gf-flex-1 gf-list-none gf-items-center gf-justify-center gf-space-x-1',
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'gf-group gf-inline-flex gf-h-9 gf-w-max gf-items-center gf-justify-center gf-rounded-md gf-bg-background gf-px-4 gf-py-2 gf-typo-small gf-font-medium gf-transition-colors hover:gf-bg-accent hover:gf-text-fg-accent focus:gf-bg-accent focus:gf-text-fg-accent focus:gf-outline-none disabled:gf-pointer-events-none disabled:gf-opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
);

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="gf-relative gf-top-[1px] gf-ml-1 gf-h-3 gf-w-3 gf-transition gf-duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'gf-left-0 gf-top-0 gf-w-full data-[motion^=from-]:gf-animate-in data-[motion^=to-]:gf-animate-out data-[motion^=from-]:gf-fade-in data-[motion^=to-]:gf-fade-out data-[motion=from-end]:gf-slide-in-from-right-52 data-[motion=from-start]:gf-slide-in-from-left-52 data-[motion=to-end]:gf-slide-out-to-right-52 data-[motion=to-start]:gf-slide-out-to-left-52 md:gf-absolute md:gf-w-auto',
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('gf-absolute gf-left-0 gf-top-full gf-flex gf-justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'gf-origin-top-center gf-relative gf-mt-1.5 gf-h-[var(--radix-navigation-menu-viewport-height)] gf-w-full gf-overflow-hidden gf-rounded-md gf-border gf-bg-popover gf-text-popover-foreground gf-shadow data-[state=open]:gf-animate-in data-[state=closed]:gf-animate-out data-[state=closed]:gf-zoom-out-95 data-[state=open]:gf-zoom-in-90 md:gf-w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'gf-top-full gf-z-[1] gf-flex gf-h-1.5 gf-items-end gf-justify-center gf-overflow-hidden data-[state=visible]:gf-animate-in data-[state=hidden]:gf-animate-out data-[state=hidden]:gf-fade-out data-[state=visible]:gf-fade-in',
      className,
    )}
    {...props}
  >
    <div className="gf-relative gf-top-[60%] gf-h-2 gf-w-2 gf-rotate-45 gf-rounded-tl-sm gf-bg-border gf-shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // eslint-disable-next-line react-refresh/only-export-components
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};
