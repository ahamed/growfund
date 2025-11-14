import { __ } from '@wordpress/i18n';
import { UploadCloud } from 'lucide-react';
import React from 'react';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Button } from '@/components/ui/button';
import { useWordpressMedia } from '@/hooks/use-wp-media';
import { type MediaAttachment } from '@/schemas/media';

interface GalleryEmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  uploadButtonLabel: string;
  dropzoneLabel: string;
  disabled: boolean;
  onChange: (attachments: MediaAttachment[]) => void;
  isLoading?: boolean;
}

const GalleryEmptyState = React.forwardRef<HTMLDivElement, GalleryEmptyStateProps>(
  ({ uploadButtonLabel, dropzoneLabel, disabled, onChange, isLoading, ...props }, ref) => {
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
            <Button
              variant="outline"
              className="gf-text-fg-primary gf-typo-sm gf-font-medium gf-border-none"
              disabled={disabled}
              onClick={() => {
                openMediaModal({
                  title: __('Select Campaign Images', 'growfund'),
                  multiple: true,
                  button_text: __('Insert', 'growfund'),
                  onSelect: (attachments) => {
                    onChange(attachments);
                  },
                  types: ['image'],
                });
              }}
            >
              <UploadCloud className="gf-h-4 gf-w-4" />
              {uploadButtonLabel}
            </Button>

            <p className="gf-typo-sm gf-text-fg-secondary">{dropzoneLabel}</p>
          </>
        )}
      </div>
    );
  },
);

export default GalleryEmptyState;
