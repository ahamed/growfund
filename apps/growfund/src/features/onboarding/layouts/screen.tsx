import React from 'react';

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context';
import { cn } from '@/lib/utils';

const Screen = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-group/screen gf-w-full gf-h-full', className)} {...props}>
        {children}
      </div>
    );
  },
);

Screen.displayName = 'Screen';

const ScreenHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-space-y-5', className)} {...props}>
        <ScreenIndicator />
        {children}
      </div>
    );
  },
);

ScreenHeader.displayName = 'ScreenHeader';

const ScreenIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { step } = useOnboarding();
    return (
      <div ref={ref} className={cn('gf-flex gf-items-center gf-gap-1', className)} {...props}>
        <div
          className={cn(
            'gf-w-9 gf-h-1 gf-rounded-full gf-bg-exception-12/10',
            ['welcome', 'mode-selection', 'payment-selection'].includes(step) &&
              'gf-bg-background-fill-brand',
          )}
        />
        <div
          className={cn(
            'gf-w-9 gf-h-1 gf-rounded-full gf-bg-exception-12/10',
            ['mode-selection', 'payment-selection'].includes(step) && 'gf-bg-background-fill-brand',
          )}
        />
        <div
          className={cn(
            'gf-w-9 gf-h-1 gf-rounded-full gf-bg-exception-12/10',
            ['payment-selection'].includes(step) && 'gf-bg-background-fill-brand',
          )}
        />
      </div>
    );
  },
);

ScreenIndicator.displayName = 'ScreenIndicator';

const ScreenTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn('gf-typo-h4 gf-font-semibold gf-text-fg-primary', className)}
        {...props}
      >
        {children}
      </h4>
    );
  },
);

ScreenTitle.displayName = 'ScreenTitle';

const ScreenDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('gf-typo-tiny gf-font-regular gf-text-fg-secondary', className)}
      {...props}
    >
      {children}
    </p>
  );
});

ScreenDescription.displayName = 'ScreenDescription';

const ScreenContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-size-full', className)} {...props}>
        {children}
      </div>
    );
  },
);

ScreenContent.displayName = 'ScreenContent';

const ScreenFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gf-w-full gf-flex gf-items-center gf-justify-end gf-gap-6 gf-absolute gf-right-8 gf-bottom-8',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ScreenFooter.displayName = 'ScreenFooter';

export {
  Screen,
  ScreenContent,
  ScreenDescription,
  ScreenFooter,
  ScreenHeader,
  ScreenIndicator,
  ScreenTitle,
};
