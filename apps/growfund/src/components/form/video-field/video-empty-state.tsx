import { __ } from '@wordpress/i18n';
import { UploadCloud } from 'lucide-react';
import React from 'react';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Button } from '@/components/ui/button';
import { useWordpressMedia } from '@/hooks/use-wp-media';
import { type VideoField } from '@/schemas/media';

interface VideoEmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange: (video: VideoField | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  uploadButtonLabel: string;
  dropzoneLabel: string;
  setIsAddFromUrl: (isAddFromUrl: boolean) => void;
}

const VideoEmptyState = React.forwardRef<HTMLDivElement, VideoEmptyStateProps>(
  (
    { onChange, isLoading, disabled, uploadButtonLabel, dropzoneLabel, setIsAddFromUrl, ...props },
    ref,
  ) => {
    const { openMediaModal } = useWordpressMedia();

    return (
      <div
        {...props}
        ref={ref}
        className="gf-flex gf-flex-col gf-items-center gf-justify-center gf-py-10 gf-gap-2 gf-text-center gf-rounded-md gf-min-h-[10rem]"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="gf-flex">
              <Button
                variant="outline"
                className="gf-text-fg-primary gf-typo-sm gf-font-medium gf-border-none"
                disabled={disabled}
                onClick={() => {
                  openMediaModal({
                    title: __('Select Campaign Video', 'growfund'),
                    types: ['video'],
                    onSelect: (attachments) => {
                      if (!attachments.length) {
                        return;
                      }
                      const attachment = attachments[0];
                      onChange(attachment);
                    },
                  });
                }}
              >
                <UploadCloud className="gf-h-4 gf-w-4" />
                {uploadButtonLabel}
              </Button>
              <Button
                variant="link"
                className="gf-text-fg-emphasis hover:gf-no-underline"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsAddFromUrl(true);
                }}
              >
                {__('Add from URL', 'growfund')}
              </Button>
            </div>
            <p className="gf-typo-sm gf-text-fg-secondary">{dropzoneLabel}</p>
          </>
        )}
      </div>
    );
  },
);

export default VideoEmptyState;
