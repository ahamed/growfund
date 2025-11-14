import { Outlet } from 'react-router';

import { DetectRouteChangeProvider } from '@/contexts/detect-route-change-context';

const PublicRootLayout = () => {
  return (
    <DetectRouteChangeProvider>
      <div className="gf-w-full gf-h-full">
        <Outlet />
      </div>
    </DetectRouteChangeProvider>
  );
};

export default PublicRootLayout;
