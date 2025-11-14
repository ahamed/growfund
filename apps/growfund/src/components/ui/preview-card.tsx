import React from 'react';

import { cn } from '@/lib/utils';

import { Image } from './image';

interface PreviewCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode | string;
  subtitle?: React.ReactNode | string;
  image?: string | null;
  alt?: string;
  action?: React.ReactNode;
}

const PreviewCard = React.forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ className, title, subtitle, image, alt, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gf-grid gf-grid-cols-[3.5rem_auto] gf-gap-3 gf-bg-background-surface gf-border-border-secondary gf-rounded-md gf-p-2 gf-shadow-sm gf-group/preview-card',
          className,
        )}
        {...props}
      >
        <Image
          src={image}
          alt={alt}
          className="gf-rounded-md gf-flex-shrink-0"
          fit="cover"
          aspectRatio="square"
        />
        <div className="gf-flex gf-items-center gf-justify-between gf-gap-2">
          <div className="gf-flex gf-flex-col gf-gap-2">
            <h3 className="gf-typo-small gf-font-medium gf-text-fg-primary">{title}</h3>
            {subtitle && <div className="gf-typo-tiny gf-text-fg-secondary">{subtitle}</div>}
          </div>
          {action && (
            <div className="gf-flex gf-items-end gf-justify-end gf-opacity-0 group-hover/preview-card:gf-opacity-100 gf-transition-opacity">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default PreviewCard;
