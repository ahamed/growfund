import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { TextField } from '@/components/form/text-field';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useCurrentUser from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { getDefaults } from '@/lib/zod';
import { type MediaAttachment } from '@/schemas/media';
import { CommentSchema, type CommentSchemaType } from '@/schemas/timeline';
import { ActivityType } from '@/types/activity';
import { createAcronym } from '@/utils';

interface TimelineFormProps {
  onSubmit: (data: CommentSchemaType) => void;
}

const TimelineForm = ({ onSubmit }: TimelineFormProps) => {
  const { currentUser } = useCurrentUser();
  const myAcronym =
    createAcronym({
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
    }) || 'A';

  const form = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: getDefaults(CommentSchema),
  });

  const handleFormSubmit = (values: CommentSchemaType) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="gf-rounded-lg gf-bg-background-surface gf-shadow-md gf-overflow-hidden gf-mt-3"
        onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
          console.error(errors);
        })}
      >
        <div className="gf-flex gf-items-center gf-gap-2 gf-p-3">
          <Avatar>
            <AvatarImage src={currentUser.image?.url} />
            <AvatarFallback>{myAcronym}</AvatarFallback>
          </Avatar>
          <TextField
            control={form.control}
            name="comment"
            placeholder={__('Leave a comment...', 'growfund')}
            className="gf-border-none"
            noErrorMessage
          />
        </div>
        <div className="gf-p-2 gf-bg-background-surface-secondary gf-w-full gf-flex gf-justify-end">
          <Button variant="outline" type="submit">
            {__('Post', 'growfund')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

interface TimelineItemProps {
  onRemove: (timelineId: string) => void;
  timeline: {
    id: string;
    type: ActivityType;
    user: {
      id: string;
      name: string;
      image?: MediaAttachment | null;
    };
    created_at: string;
    comment?: string;
  };
}

const TimelineItem = ({ timeline, onRemove }: TimelineItemProps) => {
  const { currentUser } = useCurrentUser();
  const isSystemGenerated = timeline.type !== ActivityType.TIMELINE;
  const acronym = createAcronym({ first_name: timeline.user.name });
  return (
    <div
      className={cn(
        'gf-px-5 gf-py-3 gf-pr-0 gf-flex gf-items-center gf-justify-between gf-rounded-lg gf-group/timeline gf-min-h-16 last:gf-pb-0 last:gf-min-h-0',
        !isSystemGenerated && 'hover:gf-bg-background-fill hover:gf-shadow-md',
      )}
    >
      <div className="gf-flex gf-items-center gf-gap-2">
        {isSystemGenerated ? (
          <div className="gf-size-6 gf-rounded gf-bg-background-fill gf-flex gf-items-center gf-justify-center">
            <span className="gf-size-2 gf-rounded-full gf-bg-icon-primary" />
          </div>
        ) : (
          <div>
            <Avatar className="gf-size-10 gf-relative gf-left-[-0.5rem]">
              <AvatarImage
                src={timeline.user.image?.url}
                className="gf-bg-background-fill-special-2 gf-border gf-border-border"
              />
              <AvatarFallback className="gf-bg-background-surface">
                {currentUser.active_role === 'gf_admin' ? 'A' : acronym}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="gf-space-y-1 gf-typo-small gf-text-fg-primary gf-font-medium">
          {!isSystemGenerated && <div>{timeline.user.name}</div>}
          <div className={cn('gf-font-regular', !isSystemGenerated && 'gf-text-fg-secondary')}>
            {timeline.comment}
          </div>
        </div>
      </div>

      <div>
        <div
          className={cn(
            'gf-typo-tiny gf-text-fg-subdued',
            !isSystemGenerated && 'group-hover/timeline:gf-hidden',
          )}
        >
          {timeline.created_at}
        </div>
        {!isSystemGenerated && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:gf-text-icon-critical gf-mr-2 gf-hidden group-hover/timeline:gf-flex"
            onClick={() => {
              onRemove(timeline.id);
            }}
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
};

const TimelineItemWrapper = ({
  children,
  hasItems,
}: React.PropsWithChildren<{ hasItems: boolean }>) => {
  return (
    <div className="gf-relative">
      <div className="gf-pt-6">{children}</div>
      {hasItems && (
        <div className="gf-absolute gf-bottom-0 gf-left-8 gf-w-[2px] gf-h-full gf-bg-border gf-z-negative" />
      )}
    </div>
  );
};

const TimelineContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="gf-pt-3">{children}</div>;
};

const Timeline = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="gf-mt-10">
      <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary">
        {__('Timeline', 'growfund')}
      </h6>
      {children}
    </div>
  );
};

export { Timeline, TimelineContentWrapper, TimelineForm, TimelineItem, TimelineItemWrapper };
