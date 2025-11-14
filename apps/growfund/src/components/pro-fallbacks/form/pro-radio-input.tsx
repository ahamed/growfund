import { Label } from '@/components/ui/label';
import { ProBadge } from '@/components/ui/pro-badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

interface ProRadioInputProps {
  options: string[];
  inline?: boolean;
  label?: string;
  description?: string;
  showProBadge?: boolean;
  disabled?: boolean;
  className?: string;
}

function ProRadioInput({
  label,
  description,
  disabled = false,
  className,
  inline = false,
  options,
  showProBadge = false,
}: ProRadioInputProps) {
  return (
    <div className={cn('gf-w-full', inline && 'gf-flex gf-flex-col gf-gap-1')}>
      <div className="gf-space-y-1">
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
      <RadioGroup
        disabled={disabled}
        className={cn('gf-mt-2', inline && 'gf-flex gf-items-center gf-gap-4', className)}
      >
        {options.map((option, index) => {
          return (
            <div key={index} className="gf-flex gf-items-center gf-space-x-2">
              <RadioGroupItem disabled value="" />
              <span className="gf-text-fg-subdued gf-typo-small gf-font-medium gf-min-h-4 gf-flex gf-items-center gf-gap-1">
                {option}
              </span>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export { ProRadioInput };
