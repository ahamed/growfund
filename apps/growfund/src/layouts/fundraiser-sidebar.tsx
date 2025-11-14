import { GearIcon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import {
  Bookmark,
  FileHeart,
  FileText,
  HeartHandshake,
  HelpingHand,
  Home,
  Receipt,
  Undo2,
  User,
  Users2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { BrandIcon } from '@/app/icons';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { RouteConfig } from '@/config/route-config';
import { useAppConfig } from '@/contexts/app-config';
import ProfileMenu from '@/dashboards/shared/components/dropdowns/profile-menu';
import SidebarItem from '@/dashboards/shared/sidebar-item';
import { type SidebarItem as SidebarItemType } from '@/dashboards/types/types';
import { AppConfigKeys } from '@/features/settings/context/settings-context';
import { cn } from '@/lib/utils';

const sidebarItems: SidebarItemType[] = [
  {
    label: __('Home', 'growfund'),
    icon: Home,
    route: RouteConfig.Home,
    child_routes: [],
  },
  {
    label: __('My Campaigns', 'growfund'),
    icon: FileHeart,
    route: RouteConfig.Campaigns,
    child_routes: [
      RouteConfig.CampaignStepBasic.template,
      RouteConfig.CampaignStepGoal.template,
      RouteConfig.CampaignStepRewards.template,
      RouteConfig.CampaignStepAdditional.template,
      RouteConfig.CampaignSettings.template,
    ],
  },
  {
    label: __('Pledges', 'growfund'),
    icon: HeartHandshake,
    route: RouteConfig.Pledges,
    child_routes: [],
  },
  {
    label: __('Backers', 'growfund'),
    icon: Users2,
    route: RouteConfig.Backers,
    child_routes: [],
  },
  {
    label: __('Analytics', 'growfund'),
    icon: FileText,
    route: RouteConfig.Analytics,
    child_routes: [],
  },
  {
    label: __('Profile', 'growfund'),
    icon: User,
    route: RouteConfig.FundraiserProfile,
    child_routes: [],
  },
];

const sidebarItemsDonationsMode: SidebarItem[] = [
  {
    label: __('Home', 'growfund'),
    icon: Home,
    route: RouteConfig.Home,
    child_routes: [],
  },
  {
    label: __('My Campaigns', 'growfund'),
    icon: FileHeart,
    route: RouteConfig.Campaigns,
    child_routes: [
      RouteConfig.CampaignStepBasic.template,
      RouteConfig.CampaignStepGoal.template,
      RouteConfig.CampaignStepRewards.template,
      RouteConfig.CampaignStepAdditional.template,
      RouteConfig.CampaignSettings.template,
    ],
  },
  {
    label: __('Donations', 'growfund'),
    icon: HeartHandshake,
    route: RouteConfig.Donations,
    child_routes: [],
  },
  {
    label: __('Donors', 'growfund'),
    icon: Users2,
    route: RouteConfig.Donors,
    child_routes: [],
  },
  {
    label: __('Analytics', 'growfund'),
    icon: FileText,
    route: RouteConfig.Analytics,
    child_routes: [],
  },
  {
    label: __('Profile', 'growfund'),
    icon: User,
    route: RouteConfig.FundraiserProfile,
    child_routes: [],
  },
];

const pledgeSidebarItems: SidebarItem[] = [
  {
    label: __('My pledges', 'growfund'),
    icon: HelpingHand,
    route: RouteConfig.FundraiserMyPledges,
    child_routes: [],
  },
  {
    label: __('Bookmarks', 'growfund'),
    icon: Bookmark,
    route: RouteConfig.FundraiserBookmarks,
    child_routes: [],
  },
];

const donationSidebarItems: SidebarItem[] = [
  {
    label: __('My donations', 'growfund'),
    icon: HelpingHand,
    route: RouteConfig.FundraiserMyDonations,
    child_routes: [],
  },
  {
    label: __('Annual Receipt', 'growfund'),
    icon: Receipt,
    route: RouteConfig.FundraiserAnnualReceipts,
    child_routes: [],
  },
  {
    label: __('Bookmarks', 'growfund'),
    icon: Bookmark,
    route: RouteConfig.FundraiserBookmarks,
    child_routes: [],
  },
];

const FundraiserSidebar = () => {
  const { pathname } = useLocation();
  const { isDonationMode, appConfig } = useAppConfig();
  const items = isDonationMode ? sidebarItemsDonationsMode : sidebarItems;

  const contributionItems = isDonationMode
    ? donationSidebarItems.filter((item) => {
        if (item.route.template === RouteConfig.FundraiserAnnualReceipts.template) {
          return !!appConfig[AppConfigKeys.Receipt]?.enable_annual_receipt;
        }
        return true;
      })
    : pledgeSidebarItems;

  const brandLogo = appConfig[AppConfigKeys.Branding]?.logo?.url;
  const brandLogoHeight = appConfig[AppConfigKeys.Branding]?.logo_height ?? 28;

  return (
    <div
      id="fundraiser-sidebar"
      className="gf-fixed gf-h-full gf-w-[var(--gf-sidebar-width)] gf-bg-background-surface-alt gf-border-r gf-border-r-border gf-overflow-hidden"
    >
      {/* topbar */}
      <div className="gf-h-[var(--gf-topbar-height)] gf-flex gf-items-center gf-px-4 gf-border-b gf-border-b-border gf-group/sidebar-logo gf-relative">
        <div
          className="gf-flex gf-items-center gf-gap-2 gf-absolute gf-left-4 gf-transition-all gf-duration-300 group-hover/sidebar-logo:gf-left-[12.5rem] group-hover/sidebar-logo:gf-opacity-0"
          style={{ '--gf-brand-logo-height': `${brandLogoHeight}px` } as React.CSSProperties}
        >
          {brandLogo ? (
            <Image
              src={brandLogo}
              alt="Brand Logo"
              className={cn(
                'gf-h-7 gf-border-none gf-bg-transparent',
                'gf-h-[var(--gf-brand-logo-height)]',
              )}
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
                  to={RouteConfig.FundraiserSettings.buildLink()}
                  className={cn(
                    'gf-w-full gf-flex gf-items-center gf-gap-2 gf-typo-small gf-font-medium gf-text-fg-secondary gf-min-h-8 gf-px-3 gf-py-2 gf-rounded-lg gf-relative gf-group/sidebar-item',
                    pathname.startsWith(RouteConfig.FundraiserSettings.template)
                      ? 'gf-bg-background-fill-success-var gf-text-fg-success-var [&>svg]:gf-text-icon-success-var'
                      : 'hover:gf-bg-background-secondary hover:gf-text-fg-secondary',
                  )}
                >
                  <GearIcon
                    className={cn(
                      'gf-size-4 gf-text-icon-primary',
                      !pathname.startsWith(RouteConfig.FundraiserSettings.template) &&
                        'group-hover/sidebar-item:gf-text-fg-secondary',
                    )}
                  />
                  <span>{__('Settings', 'growfund')}</span>
                  {pathname.startsWith(RouteConfig.FundraiserSettings.template) && (
                    <span className="gf-absolute gf-w-1 gf-h-6 gf-left-0 gf-top-1/2 gf--translate-y-1/2 gf-rounded-lg gf-bg-background-fill-brand-var" />
                  )}
                </Link>
              </div>
            </div>

            <div>
              <Separator />
              <div className="gf-py-6">
                <div className="gf-px-6 gf-pb-3 gf-typo-tiny gf-text-fg-subdued">
                  {isDonationMode
                    ? __('Donor options', 'growfund')
                    : __('Backer options', 'growfund')}
                </div>
                <div className="gf-space-y-2">
                  {contributionItems.map((item, index) => {
                    return <SidebarItem key={index} item={item} />;
                  })}
                </div>
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

export default FundraiserSidebar;
