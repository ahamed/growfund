import { Checkbox } from '@/components/ui/checkbox';
import { ProBadge } from '@/components/ui/pro-badge';

const ProCheckboxInput = ({ label, showProBadge }: { label: string; showProBadge?: boolean }) => {
  return (
    <div className="gf-w-full gf-flex gf-gap-2 gf-items-center">
      <Checkbox disabled={true} checked={false} aria-readonly />
      <div className="gf-flex gf-items-center gf-gap-2 ">
        <span className="gf-text-fg-subdued gf-typo-small gf-font-medium gf-min-h-4 gf-flex-shrink-0">
          {label}
        </span>
        {showProBadge && <ProBadge />}
      </div>
    </div>
  );
};

export default ProCheckboxInput;
