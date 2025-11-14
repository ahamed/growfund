import { __ } from '@wordpress/i18n';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

interface PageTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string | React.ReactNode;
  onGoBack?: () => void;
  icon?: React.ReactNode;
}

const PageTitle = React.forwardRef<HTMLDivElement, PageTitleProps>(
  ({ title, onGoBack, icon, className, ...props }, ref) => {
    return (
      <div
        className={cn('gf-h-full gf-flex gf-items-center gf-gap-2', className)}
        ref={ref}
        {...props}
      >
        {isDefined(onGoBack) && (
          <div className="gf-group/back gf-peer/back">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="hover:gf-bg-background-white gf-px-0 group-hover/back:gf-px-3 gf-transition-all"
            >
              <ArrowLeft className="gf-text-icon-primary" />
              <span className="gf-opacity-0 gf-w-0 gf-px-0 group-hover/back:gf-opacity-100 group-hover/back:gf-w-auto gf-transition-opacity">
                {__('Exit', 'growfund')}
              </span>
            </Button>
          </div>
        )}
        <div className="gf-flex gf-items-center gf-gap-3 peer-hover/back:gf-opacity-0 gf-transition-opacity">
          {isDefined(icon) && icon}
          {isDefined(title) && (
            <h6
              className={cn(
                'gf-typo-h6 gf-font-medium gf-text-fg-primary',
                typeof title === 'string' && 'gf-line-clamp-2 gf-break-all',
              )}
            >
              {title}
            </h6>
          )}
        </div>
      </div>
    );
  },
);

export default PageTitle;
