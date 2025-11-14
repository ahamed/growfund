import { __, sprintf } from '@wordpress/i18n';
import { RefreshCw, Trash, UploadCloud } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { useWordpressMedia } from '@/hooks/use-wp-media';
import { cn } from '@/lib/utils';
import { type MediaAttachment } from '@/schemas/media';
import { useMediaUploadMutation } from '@/services/media';
import { isDefined } from '@/utils';
import {
  ACCEPT_TYPES,
  type AcceptType,
  getAcceptTypes,
  mb2byte,
  type MediaType,
} from '@/utils/media';

interface DropZonePropsBasic {
  className?: string;
  value: MediaAttachment | null;
  onError?: (error: string | null) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: MediaType[];
  disabled?: boolean;
  uploadButtonLabel: string;
  dropzoneLabel: string;
}

interface DropZoneProps extends DropZonePropsBasic {
  onChange: (media: MediaAttachment | null) => void;
}

function Media({
  className,
  value,
  onChange,
  onError,
  maxSize = mb2byte(10), // 10MB default
  accept,
  disabled = false,
  uploadButtonLabel,
  dropzoneLabel,
}: DropZoneProps) {
  const { openMediaModal } = useWordpressMedia();
  const { mutateAsync: uploadMedia, isPending } = useMediaUploadMutation();

  const acceptTypes = useMemo<AcceptType>(() => {
    if (!accept) return ACCEPT_TYPES;
    return accept.reduce((acc, type) => {
      acc[type] = getAcceptTypes(type);
      return acc;
    }, {} as AcceptType);
  }, [accept]);

  const handleReplace = () => {
    try {
      openMediaModal({
        title: __('Upload media', 'growfund'),
        button_text: __('Upload', 'growfund'),
        types: ['image'],
        onSelect: (media) => {
          if (!isDefined(media) || media.length === 0) {
            return;
          }
          onChange(media[0]);
        },
      });
    } catch (error) {
      console.error('Error replacing file:', error);
      onError?.(__('Failed to replace file', 'growfund'));
    }
  };

  const handleDropAsync = useCallback(
    async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      if (rejectedFiles.length > 0) {
        const errors = (
          rejectedFiles as { errors: { code: string }[]; file: { name: string } }[]
        ).map((file) => {
          if (file.errors[0]?.code === 'file-too-large') {
            return sprintf(
              /* translators: 1: file name, 2: max size in MB */
              __('File %1$s is too large. Max size is %2$sMB.', 'growfund'),
              file.file.name,
              maxSize / (1024 * 1024),
            );
          }
          if (file.errors[0]?.code === 'file-invalid-type') {
            /* translators: %s: file name */
            return sprintf(__('File %s has an invalid file type.', 'growfund'), file.file.name);
          }
          /* translators: %s: file name */
          return sprintf(__('File %s could not be uploaded.', 'growfund'), file.file.name);
        });

        if (onError) {
          onError(errors[0]);
        }
        return;
      }

      if (onError) {
        onError(null);
      }

      try {
        const response = await uploadMedia(acceptedFiles);

        if (response.data.media.length > 0) {
          onChange(response.data.media[0]);
        } else {
          onError?.(__('Failed to upload media', 'growfund'));
        }
      } catch (error) {
        console.error('Error uploading media:', error);
        onError?.(__('Failed to upload media', 'growfund'));
      }
    },
    [onError, uploadMedia, maxSize, onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      void handleDropAsync(acceptedFiles, rejectedFiles);
    },
    [handleDropAsync],
  );

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptTypes,
    disabled,
    multiple: false,
  });

  const singlePreview = (preview: MediaAttachment) => {
    return (
      <div className="gf-group gf-relative gf-flex gf-justify-center gf-items-center gf-p-5 gf-w-full gf-min-h-64">
        <div className="group-hover:gf-visible gf-z-positive gf-invisible gf-absolute gf-left-0 gf-top-0 gf-size-full gf-rounded-md gf-bg-background-inverse/60">
          <div className="gf-flex gf-gap-2 gf-h-full gf-items-end gf-justify-center gf-pb-6">
            <Button
              variant="ghost"
              size="icon"
              className="gf-bg-background-fill"
              onClick={() => {
                handleReplace();
              }}
            >
              <RefreshCw />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="gf-bg-background-fill"
              onClick={() => {
                onChange(null);
              }}
            >
              <Trash />
            </Button>
          </div>
        </div>
        <Image
          src={preview.url}
          /* translators: %s: file name */
          alt={sprintf(__('Preview %s', 'growfund'), preview.filename)}
          className="gf-rounded-md gf-border-transparent gf-shadow-none gf-bg-transparent gf-max-h-64 gf-h-full"
          fit="contain"
          aspectRatio="square"
        />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'gf-border gf-border-border gf-bg-background-surface-secondary gf-rounded-md',
        isDragActive && 'gf-border-primary gf-border-dashed gf-bg-muted/50',
        disabled && 'gf-opacity-50 gf-cursor-not-allowed',
        isDragReject && 'gf-border-border-critical gf-bg-background-fill-critical-secondary/60',
        className,
      )}
    >
      {isDefined(value) ? (
        <div className={cn('gf-flex gf-gap-2 gf-flex-wrap')}>{singlePreview(value)}</div>
      ) : (
        <div
          {...getRootProps()}
          className="gf-flex gf-flex-col gf-items-center gf-justify-center gf-py-10 gf-gap-2 gf-text-center gf-rounded-md gf-min-h-[10rem]"
        >
          {isPending ? (
            <LoadingSpinner />
          ) : (
            <>
              <Button
                variant="outline"
                className="gf-text-fg-primary gf-typo-sm gf-font-medium gf-border-none"
                disabled={disabled}
                onClick={() => {
                  openMediaModal({
                    title: __('Upload media', 'growfund'),
                    button_text: __('Upload', 'growfund'),
                    types: ['image'],
                    onSelect: (media) => {
                      onChange(media[0] ?? null);
                    },
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
      )}
    </div>
  );
}

export default Media;
