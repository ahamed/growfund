import { __ } from '@wordpress/i18n';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import placeholder from '@/assets/images/placeholder.svg';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

import { Skeleton } from './skeleton';

const imageVariants = cva('gf-object-cover gf-transition-opacity gf-duration-300', {
  variants: {
    rounded: {
      none: 'gf-rounded-none',
      sm: 'gf-rounded-sm',
      md: 'gf-rounded-md',
      lg: 'gf-rounded-lg',
      xl: 'gf-rounded-xl',
      full: 'gf-rounded-full',
    },
    aspectRatio: {
      auto: 'gf-aspect-auto',
      square: 'gf-aspect-square',
      video: 'gf-aspect-video',
      portrait: 'gf-aspect-[3/4]',
      wide: 'gf-aspect-[16/9]',
    },
    fit: {
      cover: 'gf-object-cover',
      contain: 'gf-object-contain',
      fill: 'gf-object-fill',
      none: 'gf-object-none',
    },
  },
  defaultVariants: {
    rounded: 'md',
    aspectRatio: 'auto',
    fit: 'cover',
  },
});

interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>,
    VariantProps<typeof imageVariants> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  src?: string | null;
}

function processSrc(src: string | null | undefined) {
  if (!isDefined(src)) {
    return null;
  }

  if (src.startsWith('/')) {
    return `${window.growfund.assets_url}${src}`;
  }

  return src;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      src,
      alt = '',
      rounded,
      aspectRatio,
      fit,
      fallbackSrc = placeholder,
      showSkeleton = true,
      ...props
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setError(true);
    };

    useEffect(() => {
      if (src && error) {
        setError(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
      <div
        className={cn(
          'gf-relative gf-overflow-hidden gf-bg-background-surface-subdued gf-border gf-border-border gf-shrink-0',
          imageVariants({ rounded, aspectRatio, fit: 'none' }),
          className,
        )}
      >
        {isLoading && showSkeleton && <Skeleton className="gf-absolute gf-inset-0 gf-z-10" />}
        {error ? (
          <div className="gf-flex gf-h-full gf-w-full gf-flex-col gf-items-center gf-justify-center gf-bg-background-surface-subdued">
            {fallbackSrc ? (
              <img src={fallbackSrc} alt={alt} className={cn(imageVariants({ rounded, fit }))} />
            ) : (
              <div className="gf-flex gf-flex-col gf-items-center gf-justify-center gf-p-4 gf-text-fg-muted">
                <X className="gf-h-8 gf-w-8 gf-mb-2" />
                <span className="gf-typo-small">{__('Failed to load image', 'growfund')}</span>
              </div>
            )}
          </div>
        ) : (
          <img
            ref={ref}
            src={processSrc(src) ?? fallbackSrc}
            alt={alt}
            className={cn(
              'gf-w-full gf-h-full',
              imageVariants({ rounded: 'none', fit }),
              isLoading ? 'gf-opacity-0' : 'gf-opacity-100',
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}
      </div>
    );
  },
);

Image.displayName = 'Image';

// eslint-disable-next-line react-refresh/only-export-components
export { Image, processSrc };
