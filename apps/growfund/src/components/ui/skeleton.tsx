import { cn } from '@/lib/utils';

function Skeleton({
  className,
  animate = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        ' gf-rounded-full gf-bg-background-surface-subdued',
        animate && 'gf-animate-pulse',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
