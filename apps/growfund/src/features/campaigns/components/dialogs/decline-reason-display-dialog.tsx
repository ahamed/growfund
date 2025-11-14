import { __ } from '@wordpress/i18n';
import { AlertOctagon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User } from '@/utils/user';

const DeclineReasonDisplayDialog = ({
  reason,
  children,
}: React.PropsWithChildren<{ reason?: string | null }>) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gf-bg-background-white">
        <DialogTitle className="gf-sr-only">{__('Decline reason', 'growfund')}</DialogTitle>

        <div className="gf-px-8 gf-py-6 gf-space-y-4">
          <div className="gf-w-full gf-flex gf-flex-col gf-gap-2 gf-items-center gf-justify-center gf-text-center">
            <AlertOctagon className="gf-size-6 gf-text-icon-critical" />
            <h5 className="gf-typo-h5 gf-text-fg-critical">
              {User.isAdmin()
                ? __('You have declined this campaign', 'growfund')
                : __('Your Campaign is Declined!', 'growfund')}
            </h5>
            <p className="gf-typo-sm gf-text-fg-secondary">
              {User.isAdmin()
                ? __('Reason', 'growfund')
                : __(
                    'Your campaign submission has been reviewed and requires some changes before it can be approved.',
                    'growfund',
                  )}
            </p>
          </div>

          {reason && (
            <div
              className="gf-bg-background-fill-caution-secondary gf-rounded-sm gf-p-4 gf-border-l-4 gf-border-l-border-warning gf-typo-small gf-text-fg-primary"
              dangerouslySetInnerHTML={{ __html: reason }}
            />
          )}
          <div>
            <DialogClose asChild>
              <Button variant="secondary" size="lg" className="gf-w-full">
                {__('I understand', 'growfund')}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeclineReasonDisplayDialog;
