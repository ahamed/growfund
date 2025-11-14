import { __ } from '@wordpress/i18n';
import { ChevronsUpDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProBadge } from '@/components/ui/pro-badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

interface ProMultiSelectInputProps {
  label?: string;
  description?: string;
  className?: string;
  placeholder?: string;
  showProBadge?: boolean;
  options?: string[];
}

function ProMultiSelectInput({
  label,
  description,
  className,
  placeholder = __('Select an option', 'growfund'),
  showProBadge = false,
  options = [],
}: ProMultiSelectInputProps) {
  return (
    <div className="gf-w-full gf-space-y-2">
      {isDefined(label) && (
        <Label
          className={cn(
            'gf-text-fg-primary gf-typo-small gf-font-medium gf-min-h-4 gf-flex gf-items-center gf-gap-1 gf-flex-shrink-0',
            !showProBadge && 'gf-text-fg-subdued',
          )}
        >
          {label} {showProBadge && <ProBadge />}
        </Label>
      )}

      <div className={cn('gf-space-y-2', className)}>
        <div
          className={cn(
            'gf-border gf-border-border gf-rounded-md',
            'focus-within:gf-outline-none focus-within:gf-ring-2 focus-within:gf-ring-ring focus-within:gf-ring-offset-2',
          )}
        >
          <Button
            variant="outline"
            className={cn(
              'gf-w-full gf-justify-start gf-py-1 gf-px-3 gf-text-fg-subdued hover:gf-text-fg-subdued gf-font-regular gf-cursor-text hover:gf-bg-transparent gf-border-none focus-visible:gf-ring-0 focus-visible:gf-ring-offset-0',
            )}
            disabled={true}
          >
            {placeholder}
            <ChevronsUpDown className="gf-ml-auto gf-opacity-50" />
          </Button>
          <Separator />
          <div className="gf-flex gf-flex-wrap gf-gap-2 gf-m-3">
            {options.map((option, index) => (
              <Badge key={index} variant="ghost" className="gf-bg-background-surface-secondary">
                {option}
                <Button variant="ghost" size="icon" className="gf-size-4 gf-ml-1">
                  <X className="gf-text-icon-disabled" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
        {isDefined(description) && (
          <p className="gf-text-[0.8rem] gf-text-fg-muted">{description}</p>
        )}
      </div>
    </div>
  );
}

export { ProMultiSelectInput };
