import { Box, BoxContent } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';

const CampaignCardSkeleton = () => {
  return (
    <Box className="gf-shadow-none gf-border-none">
      <BoxContent className="gf-grid gf-grid-cols-[5.5rem_auto] gf-gap-6">
        <Skeleton className="gf-size-[6.25rem] gf-rounded-sm" animate />
        <div className="gf-space-y-3 gf-mt-3">
          <Skeleton className="gf-h-3 gf-w-[60%]" animate />
          <div className="gf-flex gf-gap-2 gf-items-center">
            <Skeleton className="gf-h-3 gf-w-[20%]" animate />
            <Skeleton className="gf-h-3 gf-w-[30%]" animate />
          </div>
          <Skeleton className="gf-h-3 gf-w-[80%]" animate />
          <Skeleton className="gf-h-3 gf-w-[70%]" animate />
        </div>
      </BoxContent>
    </Box>
  );
};

export default CampaignCardSkeleton;
