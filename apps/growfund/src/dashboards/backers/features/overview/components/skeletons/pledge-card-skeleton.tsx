import { Box, BoxContent } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';

const PledgeCardSkeleton = () => {
  return (
    <Box className="gf-shadow-none gf-border-none">
      <BoxContent className="gf-grid gf-grid-cols-[5.5rem_auto_4rem] gf-gap-4">
        <Skeleton className="gf-h-[5.5rem] gf-w-[5.5rem] gf-rounded-sm" animate />
        <div className="gf-space-y-3 gf-mt-3">
          <div className="gf-flex gf-gap-2 gf-items-center">
            <Skeleton className="gf-h-3 gf-w-[4rem]" animate />
            <Skeleton className="gf-h-3 gf-w-[4rem]" animate />
          </div>
          <Skeleton className="gf-h-3 gf-w-[7rem]" animate />
          <div className="gf-flex gf-gap-2 gf-items-center">
            <Skeleton className="gf-h-3 gf-w-[12rem]" animate />
            <Skeleton className="gf-h-3 gf-w-[16rem]" animate />
          </div>
        </div>
        <div className="gf-flex gf-flex-col gf-justify-between">
          <Skeleton className="gf-size-5 gf-rounded-sm gf-self-end" animate />
          <Skeleton className="gf-h-2 gf-w-10 gf-self-end" animate />
        </div>
      </BoxContent>
    </Box>
  );
};

export default PledgeCardSkeleton;
