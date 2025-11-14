import { __ } from '@wordpress/i18n';
import { Settings, Undo2 } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { BrandIcon } from '@/app/icons';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { useAppConfig } from '@/contexts/app-config';
import ProfileMenu from '@/dashboards/shared/components/dropdowns/profile-menu';
import { UserRouteConfig } from '@/dashboards/shared/config/user-route-config';
import SidebarItem from '@/dashboards/shared/sidebar-item';
import { AppConfigKeys } from '@/features/settings/context/settings-context';
import { cn } from '@/lib/utils';

const Sidebar = ({ items }: { items: SidebarItem[] }) => {
  const { pathname } = useLocation();
  const { appConfig } = useAppConfig();

  const brandLogo = appConfig[AppConfigKeys.Branding]?.logo?.url;

  return (
    <div className="gf-fixed gf-h-full gf-w-[var(--gf-sidebar-width)] gf-bg-background-surface-alt gf-border-r gf-border-r-border gf-overflow-hidden">
      {/* topbar */}
      <div className="gf-h-[var(--gf-topbar-height)] gf-flex gf-items-center gf-px-4 gf-border-b gf-border-b-border gf-group/sidebar-logo gf-relative">
        <div className="gf-flex gf-items-center gf-gap-2 gf-absolute gf-left-4 gf-transition-all gf-duration-300 group-hover/sidebar-logo:gf-left-[12.5rem] group-hover/sidebar-logo:gf-opacity-0">
          {brandLogo ? (
            <Image
              src={brandLogo}
              alt="Brand Logo"
              className="gf-h-7 gf-border-none gf-bg-transparent"
              fit="contain"
            />
          ) : (
            <BrandIcon className="gf-h-5" />
          )}
        </div>
        <Button
          variant="secondary"
          className="gf-absolute gf-opacity-0 gf-transition-all gf-left-[-12.5rem] group-hover/sidebar-logo:gf-left-4 group-hover/sidebar-logo:gf-opacity-100"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          <Undo2 />
          {__('Back to site', 'growfund')}
        </Button>
      </div>

      {/* sidebar items */}
      <div className="gf-flex gf-flex-col gf-gap-2 gf-h-full">
        <div className="gf-flex gf-flex-col gf-justify-between gf-h-full">
          <div className="gf-space-y-4 gf-overflow-auto gf-flex-1">
            <div className="gf-py-4 gf-flex gf-flex-col gf-gap-2">
              {items.map((item, index) => {
                return <SidebarItem key={index} item={item} />;
              })}
              <div className="gf-px-3">
                <Link
                  to={UserRouteConfig.Settings.buildLink()}
                  className={cn(
                    'gf-w-full gf-flex gf-items-center gf-gap-2 gf-typo-small gf-font-medium gf-text-fg-secondary gf-min-h-8 gf-px-3 gf-py-2 gf-rounded-lg gf-relative gf-group/sidebar-item hover:gf-bg-background-secondary hover:gf-text-fg-secondary',
                    pathname.startsWith(UserRouteConfig.Settings.template) &&
                      'gf-bg-background-fill-success-var gf-text-fg-success-var [&>svg]:gf-text-icon-success-var',
                  )}
                >
                  <Settings className="gf-size-4 gf-text-icon-primary group-hover/sidebar-item:gf-text-fg-secondary" />
                  <span>{__('Settings', 'growfund')}</span>
                  {pathname.startsWith(UserRouteConfig.Settings.template) && (
                    <span className="gf-absolute gf-w-1 gf-h-6 gf-left-0 gf-top-1/2 gf--translate-y-1/2 gf-rounded-lg gf-bg-background-fill-brand" />
                  )}
                </Link>
              </div>
            </div>
          </div>

          <div className="gf-w-full gf-min-h-32  gf-p-4 gf-border-t gf-border-t-border gf-bg-background-surface">
            <ProfileMenu className="gf-px-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
