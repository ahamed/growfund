import { cva, type VariantProps } from 'class-variance-authority';
import React, { Suspense } from 'react';

import { LoadingSpinnerOverlay } from '@/components/layouts/loading-spinner';
import PageTitle from '@/components/layouts/page-title';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';
import { User } from '@/utils/user';

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <Suspense fallback={<LoadingSpinnerOverlay />}>
        <div ref={ref} className={cn('gf-mb-16 gf-@container/page', className)} {...props}>
          {children}
        </div>
      </Suspense>
    );
  },
);

const headerVariants = cva(
  'gf-max-w-[var(--gf-container-width)] gf-w-full gf-h-full gf-flex gf-items-center gf-border-box gf-px-4 @5xl/page:gf-px-0',
  {
    variants: {
      variant: {
        default: 'gf-mx-auto',
        fluid: 'gf-max-w-full gf-px-8 @5xl/page:gf-px-8',
      },
      size: {
        default: 'gf-min-h-[var(--gf-topbar-height)] gf-max-h-[var(--gf-topbar-height)]',
        lg: 'gf-min-h-[calc(var(--gf-topbar-height)_+_12px)] gf-max-h-[calc(var(--gf-topbar-height)_+_12px)]',
        sm: 'gf-min-h-[var(--gf-topbar-height)] gf-max-w-[var(--gf-container-width-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface PageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  name?: string | React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onGoBack?: () => void;
  children?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ children, className, name, icon, action, variant, size, onGoBack, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-page-header-container
        className={cn(
          'gf-w-full gf-sticky gf-z-header gf-border-b gf-border-b-border gf-bg-background-surface-secondary gf-max-h-[var(--gf-topbar-height)] gf-min-h-[var(--gf-topbar-height)]',
          variant === 'fluid' || [User.isFundraiser(), User.isBacker()].includes(true)
            ? 'gf-top-0'
            : 'gf-top-[var(--gf-wp-topbar-height)]',
          className,
        )}
        {...props}
      >
        <div className={cn(headerVariants({ variant, size }))}>
          <div className="gf-w-full gf-flex gf-items-center gf-h-full gf-justify-between">
            <PageTitle title={name} onGoBack={onGoBack} icon={icon} />
            {isDefined(children) && children}
            {isDefined(action) && action}
          </div>
        </div>
      </div>
    );
  },
);

const PageSubHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string | React.ReactNode;
    action?: React.ReactNode;
  }
>(({ className, title, action, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('gf-flex gf-items-center gf-justify-between', className)}
      {...props}
    >
      <h4 className="gf-typo-h4 gf-text-fg-primary/80">{title}</h4>
      {isDefined(action) && action}
    </div>
  );
});

const PageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('gf-w-full', className)} {...props}>
        {children}
      </div>
    );
  },
);

Page.displayName = 'Page';
PageHeader.displayName = 'PageHeader';
PageContent.displayName = 'PageContent';
PageSubHeader.displayName = 'PageSubHeader';

export { Page, PageContent, PageHeader, PageSubHeader };
