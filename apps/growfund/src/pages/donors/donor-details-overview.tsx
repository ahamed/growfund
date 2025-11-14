import FeatureGuard from '@/components/feature-guard';
import ActivityLogFallback from '@/components/pro-fallbacks/activity-log-fallback';
import DonorMetricsFallback from '@/components/pro-fallbacks/donor/metrics-fallback';
import DonorProfileCard from '@/features/donors/components/donor-details/donor-profile-card';
import { useDonorContext } from '@/features/donors/contexts/donor';
import { registry } from '@/lib/registry';

const DonorDetailsOverviewPage = () => {
  const { donor } = useDonorContext();

  const DonorOverviewMetrics = registry.get('DonorOverviewMetrics');
  const DonorActivityLogCard = registry.get('DonorActivityLogCard');
  return (
    <div className="gf-space-y-4 gf-mt-4">
      <FeatureGuard feature="donor.overview" fallback={<DonorMetricsFallback />}>
        {DonorOverviewMetrics && <DonorOverviewMetrics />}
      </FeatureGuard>
      <div className="gf-grid gf-grid-cols-[320px_auto] gf-gap-4">
        <DonorProfileCard donor={donor.profile} />
        <FeatureGuard feature="donor.overview" fallback={<ActivityLogFallback />}>
          {DonorActivityLogCard && <DonorActivityLogCard />}
        </FeatureGuard>
      </div>
    </div>
  );
};

export default DonorDetailsOverviewPage;
