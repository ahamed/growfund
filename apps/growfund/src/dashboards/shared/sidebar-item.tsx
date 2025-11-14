import { Link } from 'react-router';

import { type SidebarItem } from '@/dashboards/types/types';
import { useCurrentPath } from '@/hooks/use-current-path';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const SidebarItem = ({ item }: { item: SidebarItem }) => {
  const currentPath = useCurrentPath();
  const isActive = !isDefined(currentPath)
    ? false
    : currentPath === item.route.template || item.child_routes.includes(currentPath);

  const IconComp = item.icon;
  return (
    <div className="gf-px-3">
      <Link
        to={item.route.buildLink()}
        className={cn(
          'gf-flex gf-items-center gf-gap-2 gf-typo-small gf-text-fg-secondary gf-min-h-8 gf-px-3 gf-py-2 gf-rounded-lg gf-relative gf-group/sidebar-item',
          isActive
            ? 'gf-bg-background-fill-success-var gf-text-fg-success-var [&>svg]:gf-text-icon-success-var'
            : 'hover:gf-bg-background-secondary hover:gf-text-fg-secondary',
        )}
      >
        <IconComp
          className={cn(
            'gf-size-4 gf-shrink-0 gf-text-icon-primary',
            !isActive && 'group-hover/sidebar-item:gf-text-fg-secondary',
          )}
        />
        <span>{item.label}</span>
        {isActive && (
          <span className="gf-absolute gf-w-1 gf-h-6 gf-left-0 gf-top-1/2 gf--translate-y-1/2 gf-rounded-lg gf-bg-background-fill-brand-var" />
        )}
      </Link>
    </div>
  );
};

export default SidebarItem;
