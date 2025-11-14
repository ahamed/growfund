import { Outlet } from 'react-router';

import FeatureGuard from '@/components/feature-guard';
import { Container } from '@/components/layouts/container';
import { DetectRouteChangeProvider } from '@/contexts/detect-route-change-context';
import { UserSettingsProvider } from '@/dashboards/shared/contexts/user-settings-context';
import UserSettingsSidebar from '@/dashboards/shared/layouts/user-settings-sidebar';
import UserSettingsTopbar from '@/dashboards/shared/layouts/user-settings-topbar';
import UserSidebar from '@/dashboards/shared/user-sidebar';
import { registry } from '@/lib/registry';
import { User } from '@/utils/user';

const UserSettingsLayout = () => {
  if (User.isFundraiser()) {
    const FundraiserSettingsLayout = registry.get('FundraiserSettingsLayout');
    return (
      <DetectRouteChangeProvider>
        <FeatureGuard feature="fundraisers">
          {FundraiserSettingsLayout && <FundraiserSettingsLayout />}
        </FeatureGuard>
      </DetectRouteChangeProvider>
    );
  }

  return (
    <DetectRouteChangeProvider>
      <UserSettingsProvider>
        <div className="gf-w-full gf-h-full">
          <UserSidebar />
          <div className="gf-ms-[var(--gf-sidebar-width)]" id="user-settings-content">
            <UserSettingsTopbar />
            <Container className="gf-flex gf-gap-6 gf-mt-6" size="sm">
              <UserSettingsSidebar />
              <Outlet />
            </Container>
          </div>
        </div>
      </UserSettingsProvider>
    </DetectRouteChangeProvider>
  );
};

export default UserSettingsLayout;
