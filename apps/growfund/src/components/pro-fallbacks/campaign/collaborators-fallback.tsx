import { __ } from '@wordpress/i18n';

import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { ProBadge } from '@/components/ui/pro-badge';

const CollaboratorsFallback = () => {
  return (
    <div className="gf-space-y-2">
      <div className="gf-typo-small gf-font-medium gf-text-fg-primary">
        {__('Collaborators', 'growfund')} <ProBadge />
      </div>
      <div className="gf-border gf-border-border gf-rounded-md">
        <div className="gf-typo-small gf-text-fg-disabled gf-px-4 gf-py-2 gf-border-b gf-border-b-border">
          {__('Search to add...', 'growfund')}
        </div>
        <div className="gf-px-12 gf-py-6 gf-space-y-2 gf-text-center">
          <Image
            src="/images/collaborators.webp"
            className="gf-border-none gf-bg-transparent gf-h-8"
            fit="contain"
          />
          <p className="gf-typo-tiny gf-text-fg-secondary gf-text-center">
            {__(
              'Invite teammates to co-manage your campaign. Plan, edit, and fundraise together.',
              'growfund',
            )}
          </p>
          <Button variant="link" className="gf-text-fg-emphasis">
            {__('Get Pro', 'growfund')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsFallback;
