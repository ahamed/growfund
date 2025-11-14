import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';

import VideoEmptyState from '@/components/form/video-field/video-empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { type VideoField } from '@/schemas/media';
import { useMediaUploadMutation } from '@/services/media';
import { isDefined, uuidv4 } from '@/utils';
import { byte2mb, mb2byte } from '@/utils/media';

import VideoPreview from './video-preview';

interface VideoProps {
  className?: string;
  video: VideoField | null;
  onError?: (error: string | null) => void;
  maxSize?: number; // in bytes
  disabled?: boolean;
  uploadButtonLabel: string;
  dropzoneLabel: string;
  onChange: (video: VideoField | null) => void;
}

function Video({
  className,
  video,
  onChange,
  onError,
  maxSize = mb2byte(10), // 10MB default
  disabled = false,
  uploadButtonLabel,
  dropzoneLabel,
}: VideoProps) {
  const [isAddFromUrl, setIsAddFromUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { mutateAsync: uploadMedia, isPending } = useMediaUploadMutation();

  const isValidVideoUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleDropAsync = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((file) => {
          if (file.errors[0]?.code === 'file-too-large') {
            return sprintf(
              /* translators: 1: file name, 2: max size in MB */
              __('File %1$s is too large. Max size is %2$sMB.', 'growfund'),
              file.file.name,
              byte2mb(maxSize),
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

      if (acceptedFiles.length === 0) {
        return;
      }

      try {
        const response = await uploadMedia(acceptedFiles);

        if (response.data.media.length > 0) {
          onChange(response.data.media[0]);
        } else {
          onError?.(__('Failed to upload media', 'growfund'));
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        onError?.(__('Failed to upload media', 'growfund'));
      }
    },
    [maxSize, onChange, onError, uploadMedia],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      void handleDropAsync(acceptedFiles, rejectedFiles);
    },
    [handleDropAsync],
  );

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    disabled,
  });

  function renderAddFromUrl() {
    return (
      <div className="gf-flex gf-flex-col gf-gap-2 gf-p-3 gf-pb-4">
        <div>{__('Source URL', 'growfund')}</div>
        <Input
          autoFocus={true}
          className="gf-bg-background-surface"
          type="url"
          value={urlInput}
          onChange={(event) => {
            setUrlInput(event.target.value);
          }}
          placeholder="https://"
        />
        {urlInput && !isValidVideoUrl(urlInput) && (
          <p className="gf-typo-small gf-text-fg-critical">
            {__('Please enter a valid video URL', 'growfund')}
          </p>
        )}
        <div className="gf-flex gf-gap-3 gf-pt-1 gf-ml-auto">
          <Button
            variant="outline"
            onClick={() => {
              setIsAddFromUrl(false);
            }}
          >
            {__('Cancel', 'growfund')}
          </Button>
          <Button
            onClick={() => {
              if (isValidVideoUrl(urlInput)) {
                onChange({
                  id: uuidv4(),
                  url: urlInput,
                });
                setIsAddFromUrl(false);
                setUrlInput('');
              } else {
                onError?.(__('Please provide a valid video URL', 'growfund'));
              }
            }}
            disabled={!urlInput || !isValidVideoUrl(urlInput)}
          >
            {__('Ok', 'growfund')}
          </Button>
        </div>
      </div>
    );
  }

  if (isAddFromUrl) {
    return (
      <div
        className={cn(
          'gf-border gf-border-border gf-bg-background-surface-secondary gf-rounded-md gf-min-h-[9rem] gf-shadow-sm',
          isDragActive && 'gf-border-primary gf-border-dashed gf-bg-muted/50',
          disabled && 'gf-opacity-50 gf-cursor-not-allowed',
          isDragReject && 'gf-border-border-critical gf-bg-background-fill-critical-secondary/60',
          className,
        )}
      >
        {renderAddFromUrl()}
      </div>
    );
  }

  if (!isDefined(video)) {
    return (
      <div
        className={cn(
          'gf-border gf-border-border gf-bg-background-surface-secondary gf-rounded-md gf-min-h-[9rem]',
          isDragActive && 'gf-border-primary gf-border-dashed gf-bg-muted/50',
          disabled && 'gf-opacity-50 gf-cursor-not-allowed',
          isDragReject && 'gf-border-border-critical gf-bg-background-fill-critical-secondary/60',
          className,
        )}
      >
        <VideoEmptyState
          {...getRootProps()}
          onChange={onChange}
          isLoading={isPending}
          disabled={disabled}
          uploadButtonLabel={uploadButtonLabel}
          dropzoneLabel={dropzoneLabel}
          setIsAddFromUrl={setIsAddFromUrl}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'gf-border gf-border-border gf-bg-background-surface-secondary gf-rounded-md',
        !video.url && 'gf-min-h-[9rem]',
        isDragActive && 'gf-border-primary gf-border-dashed gf-bg-muted/50',
        disabled && 'gf-opacity-50 gf-cursor-not-allowed',
        isDragReject && 'gf-border-border-critical gf-bg-background-fill-critical-secondary/60',
        className,
      )}
    >
      <VideoPreview videoField={video} onChange={onChange} />
    </div>
  );
}

export default Video;
