import { __, sprintf } from '@wordpress/i18n';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCurrency } from '@/hooks/use-currency';

interface DeleteDonationsDialogProps extends React.PropsWithChildren {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRows?: {
    id: string;
    amount: number;
    donor_name: string;
  }[];
}

const DeleteDonationsDialog = ({
  children,
  open,
  onOpenChange,
  selectedRows = [],
}: DeleteDonationsDialogProps) => {
  const { toCurrency } = useCurrency();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{__('Move to Trash', 'growfund')}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="gf-px-4 gf-max-h-[360px] gf-overflow-y-auto gf-rounded">
          {selectedRows.length > 0 ? (
            <>
              <p className="gf-text-fg-secondary">
                {__(
                  'Move the following donations to trash? You can restore them anytime if needed.',
                  'growfund',
                )}
              </p>
              <div className="gf-bg-background-white gf-mt-3 gf-border gf-border-border gf-rounded">
                {selectedRows.map((row) => {
                  return (
                    <div
                      key={row.id}
                      className="gf-mb-2 gf-flex gf-items-center gf-gap-2 gf-h-10 gf-border-b gf-border-border-tertiary last:gf-border-b-0 gf-pl-6 gf-py-3"
                    >
                      <span className="gf-w-[156px] gf-text-fg-subdued gf-typo-tiny">
                        {/* translators: %s: donation id */}
                        {sprintf(__('ID #%s', 'growfund'), row.id)}
                      </span>
                      <span className="gf-w-[156px] gf-text-fg-primary gf-typo-tiny">
                        {toCurrency(row.amount)}
                      </span>
                      <p className="gf-w-[156px] gf-text-fg-primary gf-typo-tiny">
                        <span className="gf-typo-tiny gf-text-fg-secondary">
                          {__('by ', 'growfund')}
                        </span>
                        {row.donor_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <span>{__('No donations selected for deletion.', 'growfund')}</span>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {__('Cancel', 'growfund')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {__('Move to Trash', 'growfund')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDonationsDialog;

DeleteDonationsDialog.displayName = 'DeleteDonationsDialog';
