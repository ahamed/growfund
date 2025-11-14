import AnalyticsRevenueChart from '@/features/analytics/components/contents/analytics-revenue-chart';
import CampaignInformationMetrics from '@/features/analytics/components/contents/campaign-information-metrics';
import RecentPledges from '@/features/analytics/components/contents/recent-pledges';
import TopBackers from '@/features/analytics/components/contents/top-backers';
import TopCampaigns from '@/features/analytics/components/shared/top-campaigns';

const RewardModeOverview = () => {
  return (
    <div className="gf-mt-4 gf-space-y-7">
      <CampaignInformationMetrics />
      <AnalyticsRevenueChart />
      <div className="gf-grid gf-grid-cols-[23.75rem_auto] gf-gap-7">
        <div className="gf-space-y-7">
          <RecentPledges />
          <TopBackers />
        </div>
        <TopCampaigns />
      </div>
    </div>
  );
};

export default RewardModeOverview;
