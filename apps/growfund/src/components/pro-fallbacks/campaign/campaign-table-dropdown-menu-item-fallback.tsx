import { ProBadge } from '@/components/ui/pro-badge';

const CampaignTableDropdownMenuItemFallback = ({ label }: { label: string }) => {
  return (
    <div className="gf-relative gf-flex gf-cursor-default gf-pointer-events-none gf-select-none gf-items-center gf-gap-2 gf-rounded-sm gf-px-2 gf-py-1.5 gf-typo-small gf-outline-none gf-transition-colors">
      <span className="gf-text-fg-disabled">{label}</span> <ProBadge />
    </div>
  );
};

export default CampaignTableDropdownMenuItemFallback;
