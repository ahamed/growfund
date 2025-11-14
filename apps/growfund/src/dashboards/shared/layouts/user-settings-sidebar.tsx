import { __ } from '@wordpress/i18n';
import { Bell, UserCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRouteConfig } from '@/dashboards/shared/config/user-route-config';
import { useUserSettingsContext } from '@/dashboards/shared/contexts/user-settings-context';
import SidebarItem from '@/dashboards/shared/sidebar-item';
import { createAcronym } from '@/utils';
import { User as CurrentUser } from '@/utils/user';

const UserSettingsSidebar = () => {
  const { user } = useUserSettingsContext();

  if (!CurrentUser.isBacker() && !CurrentUser.isDonor() && !CurrentUser.isFundraiser()) {
    return null;
  }

  const getUserRoleTitle = (user: typeof CurrentUser) => {
    if (user.isBacker()) {
      return __('Backer', 'growfund');
    }

    if (user.isDonor()) {
      return __('Donor', 'growfund');
    }

    if (user.isFundraiser()) {
      return __('Fundraiser', 'growfund');
    }

    return null;
  };

  return (
    <div className="gf-max-w-[13.25rem] gf-w-full gf-bg-background-surface gf-border gf-border-border gf-rounded-md gf-shadow-sm gf-sticky gf-top-[72px]  gf-overflow-hidden gf-h-fit">
      <div className="gf-p-4 gf-flex gf-items-center gf-gap-2 gf-border-b gf-border-b-muted gf-bg-background-surface-alt">
        <Avatar>
          <AvatarImage src={user?.image?.url ?? undefined} />
          <AvatarFallback>
            {createAcronym({ first_name: user?.first_name, last_name: user?.last_name })}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="gf-typo-small gf-font-medium gf-text-fg-primary">{user?.display_name}</p>
          <p className="gf-typo-tiny gf-text-fg-secondary">{getUserRoleTitle(CurrentUser)}</p>
        </div>
      </div>
      <div className="gf-p-3 gf-space-y-2">
        <SidebarItem
          item={{
            label: __('Account', 'growfund'),
            route: UserRouteConfig.AccountSettings,
            icon: UserCircle,
            child_routes: [UserRouteConfig.AccountSettings.template],
          }}
        />
        <SidebarItem
          item={{
            label: __('Notifications', 'growfund'),
            route: UserRouteConfig.NotificationsSettings,
            icon: Bell,
            child_routes: [UserRouteConfig.NotificationsSettings.template],
          }}
        />
      </div>
    </div>
  );
};

export default UserSettingsSidebar;
