import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import { Image, Video, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useWordpressMedia } from '@/hooks/use-wp-media';
import { cn } from '@/lib/utils';
import { type VideoField } from '@/schemas/media';
import { isDefined } from '@/utils';
import { calculateVideoDuration, formatVideoDuration } from '@/utils/media';

import { getVideoProvider } from './video-providers';

const LOCAL_VIDEO_PROVIDERS = ['wordpress-media', 'direct'];

function VideoPreview({
  videoField,
  onChange,
}: {
  videoField: VideoField;
  onChange: (video: VideoField | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const videoName = typeof videoField.url === 'string' ? videoField.url : videoField.filename;

  const videoProvider = getVideoProvider(videoField);
  const Component = videoProvider?.Component ?? null;

  const { openMediaModal } = useWordpressMedia();

  useEffect(() => {
    if (!videoField.url) {
      setVideoUrl(null);
      setPosterUrl(null);
      return;
    }

    const embedUrl = videoProvider?.getEmbedUrl(videoField.url) ?? null;
    setVideoUrl(embedUrl);
  }, [videoField, videoProvider]);

  useEffect(() => {
    if (!videoProvider || !videoUrl || !LOCAL_VIDEO_PROVIDERS.includes(videoProvider.name)) {
      return;
    }

    void calculateVideoDuration(videoUrl).then((duration) => {
      setVideoDuration(duration);
    });
  }, [videoProvider, videoUrl]);

  useEffect(() => {
    if (!videoField.poster) {
      return;
    }

    setPosterUrl(videoField.poster.url);
  }, [videoField]);

  const handleReplaceVideo = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    openMediaModal({
      title: __('Select Video', 'growfund'),
      button_text: __('Select', 'growfund'),
      types: ['video'],
      onSelect: (attachments) => {
        if (attachments.length === 0) {
          return;
        }
        const attachment = attachments[0];
        onChange(attachment);
      },
    });
  };

  const handleAddThumbnail = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    openMediaModal({
      title: __('Select Video Thumbnail', 'growfund'),
      button_text: __('Select', 'growfund'),
      types: ['image'],
      onSelect: (attachments) => {
        if (attachments.length === 0) {
          return;
        }
        const attachment = attachments[0];
        onChange({
          ...videoField,
          poster: attachment,
        });
      },
    });
  };

  return (
    <div className="gf-flex gf-flex-col">
      <div className="gf-group gf-relative gf-w-full gf-aspect-video gf-bg-muted gf-rounded-t-md gf-overflow-hidden">
        {videoDuration && (
          <span className="gf-absolute gf-bg-background-inverse/60 gf-px-3 gf-py-2 gf-rounded-md gf-right-2 gf-top-2 gf-text-fg-light gf-typo-tiny gf-font-medium">
            {formatVideoDuration(videoDuration)}
          </span>
        )}
        {videoProvider && LOCAL_VIDEO_PROVIDERS.includes(videoProvider.name) && (
          <div className="gf-invisible group-hover:gf-visible gf-absolute gf-left-0 gf-top-0 gf-size-full gf-inset-0 gf-bg-background-inverse/60 gf-z-positive gf-flex gf-flex-col gf-items-center gf-justify-center gf-gap-1">
            {!videoField.poster ? (
              <Button variant="secondary" className="gf-px-3 gf-py-2" onClick={handleAddThumbnail}>
                <Image className="gf-size-4 gf-flex-shrink-0 gf-text-icon-primary" />
                {__('Add Thumbnail', 'growfund')}
              </Button>
            ) : (
              <Button
                variant="destructive-soft"
                className="gf-px-3 gf-py-2"
                onClick={() => {
                  onChange({
                    ...videoField,
                    poster: null,
                  });
                  setPosterUrl(null);
                }}
              >
                {__('Remove Thumbnail', 'growfund')}
              </Button>
            )}
            <Button
              variant="link"
              className="gf-text-fg-light gf-px-3 gf-py-2"
              onClick={handleReplaceVideo}
            >
              {__('Replace Video', 'growfund')}
            </Button>
          </div>
        )}
        {!videoUrl && (
          <div className="gf-flex gf-flex-col gf-gap-2 gf-w-[15.75rem] gf-mt-[4.375rem] gf-ml-[3.625rem]">
            <div className="gf-flex gf-gap-2 gf-items-center">
              <ExclamationTriangleIcon className="gf-size-4" />
              <span className="gf-typo-small gf-text-fg-primary">
                {__('Video unavailable', 'growfund')}
              </span>
            </div>
            <span className="gf-typo-tiny gf-text-fg-secondary">
              {__("The video link doesn't seem to work. Please recheck your link.", 'growfund')}
            </span>
          </div>
        )}

        {isDefined(Component) ? (
          <Component
            url={videoUrl ?? undefined}
            poster={posterUrl ?? undefined}
            className="gf-w-full gf-h-full gf-object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl ?? undefined}
            poster={posterUrl ?? undefined}
            className={cn('gf-size-full gf-object-cover', isLoading && 'gf-opacity-0')}
            preload="auto"
            playsInline
            muted
            crossOrigin="anonymous"
            controls={false}
            onError={() => {
              setIsLoading(false);
            }}
          />
        )}
      </div>
      <div className="gf-typo-sm gf-text-fg-primary gf-flex gf-gap-2 gf-py-2 gf-px-3 gf-items-center gf-rounded-b-md">
        <Video className="gf-size-4 gf-text-icon-primary gf-flex-shrink-0" />
        <span className="gf-truncate" title={videoName ?? ''}>
          {videoName ?? ''}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="gf-h-6 gf-w-6 gf-bg-transparent gf-ml-auto"
          onClick={(event) => {
            event.stopPropagation();
            onChange(null);
          }}
        >
          <X className="gf-size-4" />
        </Button>
      </div>
    </div>
  );
}
export default VideoPreview;
