import { __ } from '@wordpress/i18n';
import { Home } from 'lucide-react';
import { useEffect } from 'react';

import { Container } from '@/components/layouts/container';
import DonorInformationMetrics from '@/dashboards/donors/features/home/components/donor-information-metrics';
import RecentDonations from '@/dashboards/donors/features/home/components/recent-donations';
import { useDashboardLayoutContext } from '@/dashboards/shared/contexts/root-layout-context';

const DonorHomePageContent = () => {
  const { setTopbar } = useDashboardLayoutContext();
  useEffect(() => {
    setTopbar({
      title: __('Home', 'growfund'),
      icon: Home,
    });
  }, [setTopbar]);
  return (
    <Container className="gf-mt-10" size="sm">
      <div className="gf-flex gf-items-center gf-justify-between">
        <h4 className="gf-typo-h5 gf-font-semibold gf-text-primary">
          {__('My giving stats', 'growfund')}
        </h4>
      </div>
      <div className="gf-mt-4 gf-space-y-4">
        <DonorInformationMetrics />
        <RecentDonations />
      </div>
    </Container>
  );
};

export default DonorHomePageContent;
