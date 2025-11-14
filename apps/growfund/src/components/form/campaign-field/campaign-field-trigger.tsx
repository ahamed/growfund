import { Cross2Icon } from '@radix-ui/react-icons';
import { ChevronDownIcon } from 'lucide-react';

import { useCampaignFieldContext } from '@/components/form/campaign-field/campaign-field-context';
import { Button } from '@/components/ui/button';
import { PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const CampaignFieldTrigger = ({ placeholder }: { placeholder?: string }) => {
  const { field, campaigns } = useCampaignFieldContext();
  const selectedCampaign = campaigns.find((campaign) => campaign.id === field.value);
  const label = isDefined(selectedCampaign) ? selectedCampaign.title : placeholder;

  return (
    <div className="gf-flex gf-items-center gf-rounded-md focus-within:gf-ring-2 focus-within:gf-ring-ring focus-within:gf-ring-offset-2">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          title={label}
          className={cn(
            'gf-max-w-40 gf-min-w-[12.5rem] gf-justify-between gf-pe-3 focus-visible:gf-ring-0',
            isDefined(selectedCampaign) && 'gf-rounded-none gf-rounded-tl-lg gf-rounded-bl-lg',
          )}
        >
          <span className="gf-typo-small gf-truncate">{label}</span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      {isDefined(selectedCampaign) && (
        <Button
          onClick={() => {
            field.onChange(null);
          }}
          variant="outline"
          className="gf-rounded-none gf-rounded-tr-lg gf-rounded-br-lg gf-border-l-0 focus-visible:gf-ring-0"
          size="icon"
        >
          <Cross2Icon />
        </Button>
      )}
    </div>
  );
};

export default CampaignFieldTrigger;
