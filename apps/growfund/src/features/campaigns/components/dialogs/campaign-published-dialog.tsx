import { __ } from '@wordpress/i18n';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  FacebookSocialIcon,
  LinkedinSocialIcon,
  RocketIcon,
  TelegramSocialIcon,
  TwitterXSocialIcon,
  WhatsappSocialIcon,
} from '@/app/icons';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { copyToClipboard } from '@/utils';
import { createContentSharer } from '@/utils/share';

interface CampaignPublishedDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  url: string;
}

const CampaignPublishedDialog = ({ open, onOpenChange, url }: CampaignPublishedDialogProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { shareOn } = createContentSharer(url);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gf-bg-transparent gf-border-none gf-max-w-[26.75rem]">
        <DialogHeader className="gf-sr-only">
          <DialogTitle className="gf-sr-only">
            {__('Your campaign is published!', 'growfund')}
          </DialogTitle>
        </DialogHeader>
        <div className="gf-space-y-2 gf-relative">
          <DialogCloseButton className="gf-absolute gf-right-2 gf-top-4" />
          <Box className="gf-rounded-xl">
            <BoxContent className="gf-flex gf-flex-col gf-items-center gf-p-6">
              <RocketIcon />
              <h4 className="gf-typo-h4 gf-font-semibold gf-text-fg-primary">
                {__('Your campaign is published!', 'growfund')}
              </h4>
            </BoxContent>
          </Box>
          <Box className="gf-rounded-xl">
            <BoxContent className="gf-p-6 gf-space-y-4">
              <div className="gf-grid gf-grid-cols-[3fr_1fr] gf-border gf-border-border gf-rounded-lg">
                <div className="gf-grid gf-gap-1 gf-px-3 gf-py-1">
                  <span className="gf-typo-tiny gf-text-fg-subdued">
                    {__('Quick link', 'growfund')}
                  </span>
                  <span className="gf-typo-small gf-text-fg-primary gf-truncate">{url}</span>
                </div>
                <div className="gf-border-l gf-border-l-border gf-flex gf-items-center gf-justify-center gf-py-1 gf-bg-background-fill-secondary">
                  <Button
                    variant="link"
                    className="hover:gf-no-underline gf-w-32"
                    onClick={async () => {
                      const isCopied = await copyToClipboard(url);
                      if (isCopied) {
                        setIsCopied(true);
                      } else {
                        toast.error(__('Failed to copy link. Please copy manually.', 'growfund'));
                      }
                    }}
                  >
                    {!isCopied ? (
                      <>
                        <Copy />
                        {__('Copy link', 'growfund')}
                      </>
                    ) : (
                      <>
                        <Check className="gf-text-icon-success" />
                        <span className="gf-text-fg-success">{__('Copied', 'growfund')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="gf-space-y-2">
                <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary">
                  {__('Reach more contributors by sharing!', 'growfund')}
                </h6>
                <p className="gf-typo-tiny gf-text-fg-secondary">
                  {__(
                    'Spread the word about your campaign! The more people who are aware, the greater the opportunities for success.',
                    'growfund',
                  )}
                </p>
              </div>

              <div className="gf-grid gf-grid-cols-2">
                <div className="gf-flex gf-flex-col gf-gap-2 [&>button]:gf-justify-start">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      shareOn('facebook');
                    }}
                  >
                    <FacebookSocialIcon />
                    {__('Facebook', 'growfund')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      shareOn('whatsapp');
                    }}
                  >
                    <WhatsappSocialIcon />
                    {__('WhatsApp', 'growfund')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      shareOn('telegram');
                    }}
                  >
                    <TelegramSocialIcon />
                    {__('Telegram', 'growfund')}
                  </Button>
                </div>
                <div className="gf-flex gf-flex-col gf-gap-2 [&>button]:gf-justify-start">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      shareOn('linkedin');
                    }}
                  >
                    <LinkedinSocialIcon />
                    {__('LinkedIn', 'growfund')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      shareOn('twitter');
                    }}
                  >
                    <TwitterXSocialIcon />
                    {__('X', 'growfund')}
                  </Button>
                </div>
              </div>
            </BoxContent>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignPublishedDialog;
