import { __ } from '@wordpress/i18n';
import {
  CreditCard,
  FileHeart,
  Home,
  KeyRound,
  Lock,
  type LucideIcon,
  Mail,
  Paintbrush,
  Receipt,
  Settings2,
  UserCog,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Link } from 'react-router';

import { WhiteLabelIcon } from '@/app/icons';
import { growfundConfig } from '@/config/growfund';
import { RouteConfig } from '@/config/route-config';
import { useCurrentPath } from '@/hooks/use-current-path';
import { cn } from '@/lib/utils';
import { User } from '@/utils/user';

interface SidebarMenu {
  label: string;
  icon: LucideIcon;
  route: string;
}

const sidebarMenus: SidebarMenu[] = [
  {
    label: __('General', 'growfund'),
    icon: Home,
    route: RouteConfig.GeneralSettings.buildLink(),
  },
  {
    label: __('Campaign', 'growfund'),
    icon: FileHeart,
    route: RouteConfig.CampaignSettings.buildLink(),
  },
  {
    label: __('User & Permissions', 'growfund'),
    icon: UserCog,
    route: RouteConfig.UserAndPermissionsSettings.buildLink(),
  },
  {
    label: __('Payment', 'growfund'),
    icon: CreditCard,
    route: RouteConfig.PaymentSettings.buildLink(),
  },
  {
    label: __('PDF Receipt', 'growfund'),
    icon: Receipt,
    route: RouteConfig.PdfReceiptSettings.buildLink(),
  },
  {
    label: __('Email & Notifications', 'growfund'),
    icon: Mail,
    route: RouteConfig.EmailAndNotificationsSettings.buildLink(),
  },
  {
    label: __('Security', 'growfund'),
    icon: Lock,
    route: RouteConfig.SecuritySettings.buildLink(),
  },
  {
    label: __('Branding', 'growfund'),
    icon: Paintbrush,
    route: RouteConfig.BrandingSettings.buildLink(),
  },
  {
    label: __('Advanced', 'growfund'),
    icon: Settings2,
    route: RouteConfig.AdvancedSettings.buildLink(),
  },
  {
    label: __('License', 'growfund'),
    icon: KeyRound,
    route: RouteConfig.LicenseSettings.buildLink(),
  },
];

const SettingsSidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const currentPath = useCurrentPath();

    useEffect(() => {
      const elements = document.getElementsByClassName('growfund-license-notice');

      Array.from(elements).forEach((el) => {
        const element = el as HTMLElement;
        if (currentPath === RouteConfig.LicenseSettings.template) {
          element.style.setProperty('display', 'none');
        } else {
          element.style.setProperty('display', 'block');
        }
      });
    }, [currentPath]);

    return (
      <div
        ref={ref}
        className={cn(
          'gf-w-full gf-h-full gf-bg-background-surface gf-shadow-sm gf-border gf-border-border gf-overflow-hidden gf-rounded-lg gf-sticky gf-top-[calc(var(--gf-topbar-height)_+_var(--gf-wp-topbar-height)_+_1.5rem)]',
          User.isFundraiser() && 'gf-top-[calc(var(--gf-topbar-height)_+_1.5rem)]',
          className,
        )}
        {...props}
      >
        <div className="gf-flex gf-items-center gf-gap-2 gf-p-4 gf-border-b gf-bg-background-surface-alt gf-border-border-muted">
          <div>
            <WhiteLabelIcon className="gf-rounded-md" />
          </div>
          <div className="gf-grid">
            <span className="gf-typo-small gf-font-medium gf-text-fg-primary">
              {__('Growfund', 'growfund')}
            </span>
            <a
              href="https://growfund.com"
              target="_blank"
              rel="noopener noreferrer"
              className="gf-typo-tiny gf-text-fg-muted gf-truncate hover:gf-underline hover:gf-text-fg-emphasis"
              title="growfund.com"
            >
              growfund.com
            </a>
          </div>
        </div>
        <ul className="gf-flex gf-flex-col gf-py-4 gf-px-3">
          {sidebarMenus.map(({ label, icon: Icon, route }, index) => {
            const isActive = route === currentPath;

            if (route === RouteConfig.LicenseSettings.template && !growfundConfig.is_pro) {
              return null;
            }

            return (
              <li
                key={index}
                className={cn(
                  'gf-group/sidebar-menu gf-relative gf-typo-small gf-text-fg-primary gf-h-8 gf-flex gf-items-center gf-px-3 gf-rounded-lg',
                  'hover:gf-bg-background-fill-secondary hover:gf-text-fg-primary',
                  isActive &&
                    'gf-bg-background-fill-success-secondary hover:gf-bg-background-fill-success-secondary',
                )}
              >
                <Link
                  to={route}
                  className={cn(
                    'gf-flex gf-items-center gf-gap-2 gf-h-full gf-w-full',
                    'hover:gf-text-[inherit]',
                    isActive && 'gf-text-fg-brand gf-font-medium',
                  )}
                >
                  <Icon
                    className={cn(
                      'gf-w-4 gf-h-4 gf-text-icon-primary group-hover/sidebar-menu:gf-text-icon-primary-hover',
                      isActive && 'gf-text-icon-brand',
                    )}
                  />
                  <span>{label}</span>
                </Link>
                {isActive && (
                  <span className="gf-w-1 gf-h-6 gf-bg-background-fill-brand gf-rounded-full gf-absolute gf-left-0 gf-top-1/2 gf-translate-y-[-50%]" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

export default SettingsSidebar;
