import { __ } from '@wordpress/i18n';
import { Trash2, TriangleAlert } from 'lucide-react';

import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import DeleteUserDialog from '@/dashboards/shared/components/dialogs/delete-user-dialog';

const DeleteUserAccount = () => {
  return (
    <Box className="gf-border-none gf-shadow-none">
      <BoxContent>
        <div className="gf-space-y-1">
          <div className="gf-flex gf-items-center gf-gap-2">
            <TriangleAlert className="gf-size-4 gf-text-icon-primary" />
            <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary">
              {__('Danger Zone', 'growfund')}
            </h6>
          </div>
          <p className="gf-typo-small gf-text-fg-secondary">
            {__('Crucial actions are here proceed cautiously', 'growfund')}
          </p>
        </div>

        <div className="gf-flex gf-items-center gf-justify-between gf-mt-6">
          <div className="gf-space-y-1">
            <p className="gf-typo-small gf-font-medium gf-text-fg-critical">
              {__('Delete my account', 'growfund')}
            </p>
            <p className="gf-typo-small gf-text-fg-secondary">
              {__('Permanently delete the account.', 'growfund')}
            </p>
          </div>
          <DeleteUserDialog>
            <Button variant="destructive-soft" size="sm">
              <Trash2 />
              {__('Delete', 'growfund')}
            </Button>
          </DeleteUserDialog>
        </div>
      </BoxContent>
    </Box>
  );
};

export default DeleteUserAccount;
