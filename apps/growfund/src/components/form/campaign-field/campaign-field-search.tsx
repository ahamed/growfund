import { __ } from '@wordpress/i18n';

import { useCampaignFieldContext } from '@/components/form/campaign-field/campaign-field-context';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const CampaignFieldSearch = () => {
  const { search, setSearch } = useCampaignFieldContext();
  return (
    <div className="gf-flex gf-justify-between gf-gap-3 gf-px-4 gf-pt-4">
      <FormControl>
        <Input
          placeholder={__('Search for a campaign...', 'growfund')}
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          autoFocus
        />
      </FormControl>
    </div>
  );
};

export default CampaignFieldSearch;
