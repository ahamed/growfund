import { sprintf } from '@wordpress/i18n';
import { Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type AppreciationMessageSchemaType } from '@/features/campaigns/schemas/campaign';
import { useCurrency } from '@/hooks/use-currency';

interface MessageDisplayProps {
  formatData: AppreciationMessageSchemaType;
  onEdit: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export const MessageDisplay = ({
  formatData,
  onEdit,
  onRemove,
  disabled = false,
}: MessageDisplayProps) => {
  const { toCurrency } = useCurrency();
  const { pledge_from, pledge_to, appreciation_message } = formatData;
  return (
    <div className="gf-relative gf-flex gf-gap-2 gf-group">
      <div className="gf-flex gf-flex-col gf-gap-2">
        <div className="gf-flex gf-justify-between gf-items-center">
          <h6 className="gf-typo-h6 gf-text-fg-primary">
            {sprintf('%s-%s ', toCurrency(pledge_from), toCurrency(pledge_to))}
          </h6>
        </div>
        <p className="gf-typo-tiny gf-text-fg-secondary">{appreciation_message}</p>
      </div>

      <div className="gf-absolute gf-right-0 gf-h-9 gf-w-[64px] gf-items-center gf-justify-center gf-border gf-rounded-md gf-hidden group-hover:gf-flex">
        <Button
          variant="ghost"
          size="icon"
          className="gf-size-8 gf-cursor-pointer"
          onClick={onEdit}
          disabled={disabled}
        >
          <Edit />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="gf-size-8 gf-cursor-pointer hover:gf-text-icon-critical"
          onClick={onRemove}
          disabled={disabled}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};
