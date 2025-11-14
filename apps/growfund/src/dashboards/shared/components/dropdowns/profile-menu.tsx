import { GearIcon, PersonIcon } from '@radix-ui/react-icons';
import { __, sprintf } from '@wordpress/i18n';
import { ChevronRight, LogOut, Undo2 } from 'lucide-react';
import { Link } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RouteConfig } from '@/config/route-config';
import { UserRouteConfig } from '@/dashboards/shared/config/user-route-config';
import { useLogoutMutation } from '@/dashboards/shared/services/user';
import useCurrentUser from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { createAcronym } from '@/utils';

type Role = 'admin' | 'fundraiser' | 'donor' | 'backer';

const roleMap = new Map<`gf_${Role}`, string>([
  ['gf_admin', __('Admin', 'growfund')],
  ['gf_fundraiser', __('Fundraiser', 'growfund')],
  ['gf_donor', __('Donor', 'growfund')],
  ['gf_backer', __('Backer', 'growfund')],
]);

const ProfileMenu = ({ className }: { className?: string }) => {
  const { currentUser: user, isFundraiser } = useCurrentUser();

  const logoutMutation = useLogoutMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'gf-flex gf-items-center gf-gap-2 hover:gf-bg-background-fill-secondary-hover gf-px-4 gf-py-1 gf-rounded-lg gf-cursor-pointer [&[data-state=open]]:gf-bg-background-fill-secondary-hover',
            className,
          )}
        >
          <Avatar className="gf-size-8">
            <AvatarImage src={user.image?.url ?? undefined} />
            <AvatarFallback className="gf-bg-background-fill-tertiary/50 gf-typo-tiny">
              {createAcronym({ first_name: user.first_name, last_name: user.last_name })}
            </AvatarFallback>
          </Avatar>

          <div className="gf-flex gf-items-center gf-justify-between gf-gap-3 gf-w-full">
            <div className="gf-flex gf-flex-col gf-items-start">
              <span
                className="gf-typo-small gf-font-medium gf-text-fg-secondary gf-block gf-truncate gf-max-w-28"
                title={sprintf('%s %s', user.first_name, user.last_name)}
              >
                {sprintf('%s %s', user.first_name, user.last_name)}
              </span>
              <span className="gf-typo-tiny gf-text-fg-secondary">
                {roleMap.has(user.active_role ?? 'gf_admin') &&
                  roleMap.get(user.active_role ?? 'gf_admin')}
              </span>
            </div>
            <ChevronRight className="gf-size-4 gf-shrink-0 gf-text-icon-secondary" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="gf-w-[var(--radix-dropdown-menu-trigger-width)]"
        align="end"
        side="right"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to={
                isFundraiser
                  ? RouteConfig.FundraiserProfile.buildLink()
                  : UserRouteConfig.Profile.buildLink()
              }
            >
              <PersonIcon />
              {__('Profile', 'growfund')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => (window.location.href = '/')}>
            <Undo2 />
            {__('Back to site', 'growfund')}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to={
                isFundraiser
                  ? RouteConfig.FundraiserSettings.buildLink()
                  : UserRouteConfig.Settings.buildLink()
              }
            >
              <GearIcon />
              {__('Settings', 'growfund')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logoutMutation.mutate();
            }}
          >
            <LogOut />
            {__('Logout', 'growfund')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
