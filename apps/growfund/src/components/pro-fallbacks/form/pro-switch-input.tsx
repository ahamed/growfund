import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { ProBadge } from '@/components/ui/pro-badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

interface ProSwitchInputProps {
  allowEdit?: boolean;
  hideToggle?: boolean;
  className?: string;
  label?: string;
  description?: string;
  showProBadge?: boolean;
}

function ProSwitchInput({
  label,
  description,
  className,
  allowEdit = false,
  hideToggle = false,
  showProBadge = false,
}: ProSwitchInputProps) {
  return (
    <div
      className={cn(
        'gf-w-full gf-flex gf-items-center gf-justify-between gf-gap-4 gf-group/switch',
        className,
      )}
    >
      <div className="gf-space-y-2">
        {isDefined(label) && (
          <Label
            className={cn(
              'gf-text-fg-primary gf-typo-small gf-font-medium gf-min-h-4 gf-flex gf-items-center gf-gap-1 gf-flex-shrink-0',
              !showProBadge && 'gf-text-fg-subdued',
            )}
          >
            {label}
            {showProBadge && <ProBadge />}
          </Label>
        )}
        {isDefined(description) && (
          <p className="gf-text-[0.8rem] gf-text-fg-muted">{description}</p>
        )}
      </div>
      <div className="gf-flex gf-items-center gf-gap-2">
        {allowEdit && (
          <Button variant="ghost" size="icon">
            <Edit className="gf-text-icon-primary" />
          </Button>
        )}
        {!hideToggle && (
          <FormControl>
            <Switch disabled={true} checked={false} aria-readonly />
          </FormControl>
        )}
      </div>
    </div>
  );
}

export { ProSwitchInput };
