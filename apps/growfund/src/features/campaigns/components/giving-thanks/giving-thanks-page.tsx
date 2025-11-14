import { __ } from '@wordpress/i18n';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { MessagesEmptyStateIcon } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MessageDisplay } from '@/features/campaigns/components/giving-thanks/message-display';
import { MessageForm } from '@/features/campaigns/components/giving-thanks/message-form';
import { type CampaignForm } from '@/features/campaigns/schemas/campaign';
import { cn } from '@/lib/utils';

export const GivingThanks = () => {
  const form = useFormContext<CampaignForm>();
  const messages = useWatch({ control: form.control, name: 'giving_thanks' }) ?? [];
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { remove, append, update } = useFieldArray({
    control: form.control,
    name: 'giving_thanks',
  });

  const appreciationType = useWatch({
    control: form.control,
    name: 'appreciation_type',
  });

  if (appreciationType !== 'giving-thanks') {
    return null;
  }

  const error = form.getFieldState('giving_thanks').error;

  return (
    <div className="gf-space-y-2">
      <div className={cn('gf-space-y-3 gf-bg-background-surface gf-rounded-lg gf-p-4')}>
        <span className={cn('gf-font-medium gf-typo-small gf-text-fg-primary')}>
          {__('Thanks-giving Messages', 'growfund')}
        </span>

        {!!error && (
          <Alert variant="destructive">
            {__(
              'Please add at least one thank-you message before publishing your campaign.',
              'growfund',
            )}
          </Alert>
        )}

        {messages.length === 0 && !isCreateNew && (
          <EmptyState className="gf-bg-background-surface-secondary gf-shadow-sm gf-border-none">
            <MessagesEmptyStateIcon />
            <EmptyStateDescription>
              {__('No messages added yet. Add at least one message to publish.', 'growfund')}
            </EmptyStateDescription>
          </EmptyState>
        )}

        {messages.map((message, index) => {
          if (editingIndex === index) {
            return (
              <div
                key={index}
                className="gf-mt-2 gf-space-y-2 gf-bg-background-surface gf-px-4 gf-py-3 gf-border gf-border-border gf-rounded-md"
              >
                <MessageForm
                  key={index}
                  defaultData={{
                    from: message.pledge_from,
                    to: message.pledge_to,
                    message: message.appreciation_message,
                  }}
                  onSave={(data) => {
                    update(index, {
                      pledge_from: data.from,
                      pledge_to: data.to,
                      appreciation_message: data.message,
                    });
                    setIsCreateNew(false);
                    setEditingIndex(null);
                  }}
                  onRemove={() => {
                    remove(index);
                    setIsCreateNew(false);
                    setEditingIndex(null);
                  }}
                  onCancel={() => {
                    setIsCreateNew(false);
                    setEditingIndex(null);
                  }}
                />
              </div>
            );
          }
          return (
            <div
              key={index}
              className="gf-mt-2 gf-space-y-2 gf-bg-background-surface gf-px-4 gf-py-3 gf-border gf-border-border gf-rounded-md"
            >
              <MessageDisplay
                key={index}
                formatData={message}
                onEdit={() => {
                  setEditingIndex(index);
                }}
                onRemove={() => {
                  setEditingIndex(null);
                  remove(index);
                }}
                disabled={isCreateNew || editingIndex !== null}
              />
            </div>
          );
        })}

        {editingIndex === null && !isCreateNew && (
          <Button
            variant="secondary"
            className="gf-w-full gf-mt-3"
            onClick={() => {
              setIsCreateNew(true);
            }}
          >
            <Plus />
            {__('Add Message', 'growfund')}
          </Button>
        )}

        {isCreateNew && (
          <div className="gf-mt-2 gf-space-y-2 gf-bg-background-surface gf-px-4 gf-py-3 gf-border gf-border-border gf-rounded-md">
            <MessageForm
              onSave={(data) => {
                append({
                  pledge_from: data.from,
                  pledge_to: data.to,
                  appreciation_message: data.message,
                });
                setIsCreateNew(false);
              }}
              onCancel={() => {
                setIsCreateNew(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
