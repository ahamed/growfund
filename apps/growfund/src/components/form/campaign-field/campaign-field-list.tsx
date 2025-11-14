import { __ } from '@wordpress/i18n';
import { CheckIcon } from 'lucide-react';

import { useCampaignFieldContext } from '@/components/form/campaign-field/campaign-field-context';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';
import { noop } from '@/utils';

const CampaignFieldList = () => {
  const { campaigns, field, onOpenChange } = useCampaignFieldContext();

  if (campaigns.length === 0) {
    return (
      <div className="gf-flex gf-items-center gf-justify-center gf-h-24 gf-text-fg-secondary gf-typo-small">
        <p>{__('No campaigns found', 'growfund')}</p>
      </div>
    );
  }

  return (
    <div className="gf-flex gf-flex-col gf-mt-3">
      {campaigns.map((campaign) => {
        return (
          <div
            key={campaign.id}
            role="button"
            tabIndex={0}
            onKeyDown={noop}
            onClick={() => {
              field.onChange(field.value === campaign.id ? null : campaign.id);
              onOpenChange(false);
            }}
            className={cn(
              'gf-flex gf-items-center gf-cursor-pointer gf-px-4 gf-py-2 hover:gf-bg-background-surface-secondary',
              field.value === campaign.id && 'gf-text-fg-primary gf-font-medium gf-typo-small',
            )}
          >
            <div className="gf-flex gf-items-center gf-gap-2 gf-min-w-0">
              <Image
                src={campaign.images?.[0]?.url ?? null}
                alt={campaign.title}
                className="gf-size-8 gf-rounded-sm gf-flex-shrink-0"
              />
              <span className="gf-truncate gf-typo-small gf-w-full" title={campaign.title}>
                {campaign.title}
              </span>
            </div>

            <CheckIcon
              className={cn(
                'gf-size-4 gf-ml-auto gf-shrink-0 gf-transition-all',
                field.value === campaign.id ? 'gf-opacity-100' : 'gf-opacity-0',
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CampaignFieldList;
