import React from 'react';

import { useDashboardLayoutContext } from '@/dashboards/shared/contexts/root-layout-context';
import { cn } from '@/lib/utils';

const Topbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { topbar } = useDashboardLayoutContext();
    const TopbarIcon = topbar.icon;

    return (
      <div
        data-topbar-container
        ref={ref}
        className={cn(
          'gf-w-full gf-sticky gf-z-header gf-border-b gf-border-b-border gf-bg-background-surface-secondary gf-max-h-[var(--gf-topbar-height)] gf-min-h-[var(--gf-topbar-height)] gf-top-0 gf-px-7 gf-flex gf-items-center gf-justify-between',
          className,
        )}
        {...props}
      >
        <div className="gf-flex gf-items-center gf-gap-2">
          <TopbarIcon className="gf-size-5 gf-text-icon-primary" />
          <span className="gf-typo-small gf-font-medium gf-text-fg-primary">{topbar.title}</span>
        </div>
      </div>
    );
  },
);

export default Topbar;
