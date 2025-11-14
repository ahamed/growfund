import { DragHandleDots2Icon, Pencil2Icon } from '@radix-ui/react-icons';
import { __, sprintf } from '@wordpress/i18n';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { SortableContainer, SortableItem } from '@/contexts/sortable';
import CreateRewardItem from '@/features/campaigns/components/dialogs/manage-reward-dialog/create-reward-item';
import { useCampaignReward } from '@/features/campaigns/contexts/campaign-reward';
import { type RewardForm } from '@/features/campaigns/schemas/reward';
import { type RewardItem } from '@/features/campaigns/schemas/reward-item';
import { cn } from '@/lib/utils';

import AddRewardItem from './add-reward-item';

export const SingleRewardItem = ({
  item,
  onRemove,
  onEdit,
  isOverlay = false,
}: {
  item: RewardItem;
  onRemove?: () => void;
  onEdit?: (values: { id: string; quantity: number }) => void;

  isOverlay?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <CreateRewardItem
        mode="edit"
        defaultValues={item}
        onSave={(values) => {
          setIsEditing(false);
          onEdit?.(values);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        'gf-bg-background-surface gf-border gf-border-border gf-rounded-md gf-py-3 gf-ps-2 gf-pe-3 gf-flex gf-items-center gf-justify-between gf-group/item gf-select-none gf-relative',
        isOverlay && 'gf-shadow-lg',
      )}
    >
      <div className="gf-flex gf-items-center gf-gap-3 gf-cursor-grab">
        <DragHandleDots2Icon className="gf-text-icon-secondary gf-shrink-0" />
        <Image
          src={item.image?.url ?? null}
          alt={item.title}
          className="gf-size-14 gf-shrink-0"
          fit="cover"
        />
        <div className="gf-grid gf-gap-2">
          <p className="gf-typo-small gf-font-medium gf-text-fg-primary">{item.title}</p>
          <div className="gf-min-h-9">
            <span className="gf-typo-tiny gf-text-fg-muted gf-block group-hover/item:gf-hidden">
              {/* translators: %s: reward item's quantity */}
              {sprintf(__('Quantity: %s', 'growfund'), item.quantity)}
            </span>
            <Input
              type="number"
              placeholder={__('Qty', 'growfund')}
              value={String(item.quantity)}
              onChange={(event) => {
                const value = event.target.valueAsNumber;
                onEdit?.({ ...item, quantity: value });
              }}
              className="gf-hidden gf-max-w-16 group-hover/item:gf-block"
            />
          </div>
        </div>
      </div>
      <div className="gf-flex gf-transition-opacity gf-opacity-0 group-hover/item:gf-opacity-100 gf-absolute gf-top-4 gf-right-4 gf-border gf-border-border gf-p-1 gf-rounded-md gf-bg-background-surface">
        <Button
          variant="ghost"
          size="icon"
          className="gf-size-8"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          <Pencil2Icon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:gf-text-icon-critical gf-size-8"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

const RewardItemsSelection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { rewardItems } = useCampaignReward();

  const form = useFormContext<RewardForm>();
  const items = useWatch({ control: form.control, name: 'items' });
  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: 'items',
    keyName: 'uuid',
  });

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...items[index],
      id: field.id,
    };
  });

  const itemsError = form.getFieldState('items').error;

  return (
    <div className="gf-space-y-2">
      <Box
        className={cn(
          'gf-p-4 gf-space-y-3',
          !!itemsError && 'gf-border-border-critical gf-bg-background-fill-critical-secondary',
        )}
      >
        <p className="gf-typo-small gf-font-medium gf-text-fg-primary">{__('Items', 'growfund')}</p>
        <div className="gf-grid gf-gap-3">
          <SortableContainer
            items={controlledFields}
            onSortCompleted={(items) => {
              replace(items);
            }}
            overlay={(item) => {
              const rewardItem = rewardItems.find((reward) => reward.id === item.id);
              if (!rewardItem) {
                return null;
              }

              return <SingleRewardItem item={rewardItem} isOverlay={true} />;
            }}
          >
            {controlledFields.map((item, index) => {
              const rewardItem = rewardItems.find((reward) => reward.id === item.id);
              if (!rewardItem) {
                return null;
              }
              return (
                <SortableItem id={item.id} key={item.id}>
                  <SingleRewardItem
                    item={{ ...rewardItem, quantity: item.quantity }}
                    onRemove={() => {
                      remove(index);
                    }}
                    onEdit={(values) => {
                      update(index, values);
                    }}
                  />
                </SortableItem>
              );
            })}
          </SortableContainer>
        </div>

        {isOpen ? (
          <AddRewardItem
            selectedItems={items}
            onOpenChange={setIsOpen}
            onSave={(value) => {
              append({
                id: value.id,
                quantity: value.quantity,
              });
            }}
          />
        ) : (
          <Button
            variant="secondary"
            className="gf-w-full"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Plus />
            {__('Add', 'growfund')}
          </Button>
        )}
      </Box>
      {!!itemsError && (
        <p className="gf-typo-small gf-text-fg-critical">{itemsError.message?.[0]}</p>
      )}
    </div>
  );
};

RewardItemsSelection.displayName = 'RewardItems';

export default RewardItemsSelection;
