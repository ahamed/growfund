import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  showAvatarSkeleton?: boolean;
  avatarClassName?: string;
  skeleton?: React.ReactNode;
  skeletonClassName?: string;
}

const LoadingSkeletonCard = React.forwardRef<
  HTMLDivElement,
  Omit<LoadingSkeletonProps, 'skeleton'>
>(
  (
    {
      className,
      children,
      loading,
      showAvatarSkeleton,
      skeletonClassName,
      avatarClassName,
      ...props
    },
    ref,
  ) => {
    if (!loading) {
      return children;
    }

    return (
      <div
        ref={ref}
        className={cn('gf-flex gf-items-center gf-gap-3 gf-p-3', className)}
        {...props}
      >
        {showAvatarSkeleton && (
          <Skeleton animate className={cn('gf-h-14 gf-w-14 gf-rounded-xl', avatarClassName)} />
        )}
        <div className="gf-space-y-2">
          <Skeleton animate className={cn('gf-h-2 gf-w-72', skeletonClassName)} />
          <Skeleton animate className={cn('gf-h-2 gf-w-72', skeletonClassName)} />
          <div
            className={cn('gf-flex gf-items-center gf-justify-center gf-gap-2', skeletonClassName)}
          >
            <Skeleton animate className="gf-h-2 gf-w-[8.2rem]" />
            <Skeleton animate className="gf-h-2 gf-w-2 gf-rounded-full" />
            <Skeleton animate className="gf-h-2 gf-w-[8.2rem]" />
          </div>
        </div>
      </div>
    );
  },
);

const LoadingSkeletonJustifyBetween = React.forwardRef<
  HTMLDivElement,
  Omit<LoadingSkeletonProps, 'skeleton'>
>(
  (
    {
      className,
      children,
      loading,
      showAvatarSkeleton,
      avatarClassName,
      skeletonClassName,
      ...props
    },
    ref,
  ) => {
    if (!loading) {
      return children;
    }

    return (
      <div
        ref={ref}
        className={cn('gf-flex gf-items-center gf-gap-3 gf-p-3', className)}
        {...props}
      >
        {showAvatarSkeleton && (
          <Skeleton animate className={cn('gf-h-5 gf-w-5 gf-rounded-full', avatarClassName)} />
        )}
        <div className="gf-w-full gf-gap-8 gf-flex gf-items-center gf-justify-between">
          <Skeleton animate className={cn('gf-h-2 gf-w-[4.25rem]', skeletonClassName)} />
          <Skeleton animate className={cn('gf-h-2 gf-w-[4.25rem]', skeletonClassName)} />
        </div>
      </div>
    );
  },
);

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  (
    {
      className,
      children,
      loading,
      showAvatarSkeleton,
      avatarClassName,
      skeleton,
      skeletonClassName,
      ...props
    },
    ref,
  ) => {
    if (!loading) {
      return children;
    }

    skeleton = skeleton ?? (
      <Skeleton animate className={cn('gf-h-2 gf-w-[4.25rem]', skeletonClassName)} />
    );

    return (
      <div
        ref={ref}
        className={cn('gf-flex gf-items-start gf-gap-[0.375rem] gf-p-3', className)}
        {...props}
      >
        {showAvatarSkeleton && (
          <Skeleton animate className={cn('gf-h-5 gf-w-5 gf-rounded-full', avatarClassName)} />
        )}
        <div className="gf-space-y-2 gf-w-full">{skeleton}</div>
      </div>
    );
  },
);

LoadingSkeleton.displayName = 'LoadingSkeleton';
LoadingSkeletonCard.displayName = 'LoadingSkeletonCard';
LoadingSkeletonJustifyBetween.displayName = 'LoadingSkeletonJustifyBetween';

export { LoadingSkeleton, LoadingSkeletonCard, LoadingSkeletonJustifyBetween };
