import AnalyticsRevenueChart from '@/features/analytics/components/contents/analytics-revenue-chart';
import DonationInformationMetrics from '@/features/analytics/components/contents/donation-information-metrics';
import RecentDonations from '@/features/analytics/components/contents/recent-donations';
import TopDonors from '@/features/analytics/components/contents/top-donors';
import TopCampaigns from '@/features/analytics/components/shared/top-campaigns';

const DonationOverview = () => {
  return (
    <div className="gf-mt-4 gf-space-y-7">
      <DonationInformationMetrics />
      <AnalyticsRevenueChart />
      <div className="gf-grid gf-grid-cols-[23.75rem_auto] gf-gap-7">
        <div className="gf-space-y-7">
          <RecentDonations />
          <TopDonors />
        </div>
        <TopCampaigns />
      </div>
    </div>
  );
};

export default DonationOverview;
