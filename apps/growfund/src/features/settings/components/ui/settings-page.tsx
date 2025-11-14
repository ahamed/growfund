import React from 'react';

import { cn } from '@/lib/utils';

const SettingsPage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-max-w-600 gf-w-full', className)} {...props}>
        {children}
      </div>
    );
  },
);

SettingsPage.displayName = 'SettingsPage';

const SettingsPageHeader = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return (
    <h4
      className={cn('gf-typo-h4 gf-text-fg-primary gf-font-semibold', className)}
      ref={ref}
      {...props}
    >
      {children}
    </h4>
  );
});

SettingsPageHeader.displayName = 'SettingsPageHeader';

const SettingsPageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-w-full gf-mt-4', className)} {...props}>
        {children}
      </div>
    );
  },
);

SettingsPageContent.displayName = 'SettingsPageContent';

export { SettingsPage, SettingsPageContent, SettingsPageHeader };
