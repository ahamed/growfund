import { __ } from '@wordpress/i18n';

import { SubmittedForReviewIcon } from '@/app/icons';
import { Box, BoxContent } from '@/components/ui/box';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CampaignSubmittedForReviewDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const CampaignSubmittedForReviewDialog = ({
  open,
  onOpenChange,
}: CampaignSubmittedForReviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gf-bg-transparent gf-border-none gf-max-w-[30rem]">
        <DialogHeader className="gf-sr-only">
          <DialogTitle className="gf-sr-only">
            {__('The campaign is submitted for review', 'growfund')}
          </DialogTitle>
        </DialogHeader>
        <DialogCloseButton className="gf-absolute gf-right-2 gf-top-4" />
        <Box className="gf-rounded-xl">
          <BoxContent className="gf-flex gf-flex-col gf-gap-4 gf-items-center gf-p-12">
            <SubmittedForReviewIcon />
            <div className="gf-space-y-2 gf-text-center">
              <h4 className="gf-typo-h4 gf-font-semibold gf-text-fg-primary">
                {__('The campaign is submitted for review', 'growfund')}
              </h4>
              <p className="gf-typo-paragraph">
                {__(
                  "Thanks for submitting your campaign! You'll be notified when it's approved and live.",
                  'growfund',
                )}
              </p>
            </div>
          </BoxContent>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignSubmittedForReviewDialog;
