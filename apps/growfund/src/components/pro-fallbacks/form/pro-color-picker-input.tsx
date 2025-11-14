import { __ } from '@wordpress/i18n';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProBadge } from '@/components/ui/pro-badge';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

interface ProColorPickerInputProps {
  placeholder?: string;
  description?: string;
  label?: string;
  className?: string;
  showProBadge?: boolean;
}
function ProColorPickerInput({
  label,
  placeholder = __('Pick a color', 'growfund'),
  description,
  className,
  showProBadge = false,
}: ProColorPickerInputProps) {
  return (
    <div className="gf-w-full gf-space-y-2 gf-select-none">
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
      <Button
        variant="outline"
        className={cn(
          'gf-w-full gf-justify-start gf-text-left gf-font-normal gf-px-3 gf-text-muted-foreground gf-opacity-50',
          className,
        )}
      >
        <div
          className="gf-w-4 gf-h-4 gf-rounded-full gf-border"
          style={{
            backgroundColor: '#FFFFFF',
          }}
        />
        <span>{placeholder}</span>
      </Button>

      {isDefined(description) && <p className="gf-text-[0.8rem] gf-text-fg-muted">{description}</p>}
    </div>
  );
}

export { ProColorPickerInput };
