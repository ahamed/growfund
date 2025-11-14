import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { __ } from '@wordpress/i18n';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/layouts/loading-spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { type MediaAttachment } from '@/schemas/media';

import { useGalleryContext } from './gallery-context';

interface ImageCardProps {
  image: string;
  featured?: boolean;
  isChecked?: boolean;
  onCheck?: (checked: boolean) => void;
}

export function ImageCard({ image, featured = false, isChecked = false, onCheck }: ImageCardProps) {
  return (
    <div
      className={cn(
        'gf-group gf-relative gf-rounded-sm gf-overflow-hidden gf-bg-white gf-shadow-sm gf-transition-shadow hover:gf-shadow-md gf-cursor-pointer',
        featured ? 'md:gf-col-span-2 md:gf-row-span-2' : '',
        isChecked && 'gf-shadow-md',
      )}
    >
      <div
        role="button"
        className="gf-aspect-square gf-size-full"
        onClick={() => onCheck?.(!isChecked)}
      >
        <img src={image} alt="Card content" className="gf-size-full gf-object-cover" />
        <div
          className={cn(
            'gf-absolute gf-inset-0 gf-bg-background-inverse/40 gf-transition-opacity',
            isChecked ? 'gf-opacity-100' : 'gf-opacity-0 group-hover:gf-opacity-100',
          )}
        />
      </div>

      <Checkbox
        checked={isChecked}
        onCheckedChange={onCheck}
        className={cn(
          'gf-absolute gf-top-2 gf-left-2 gf-hidden group-hover:gf-block',
          isChecked && 'gf-block',
        )}
      />

      {featured && (
        <Button
          variant="ghost"
          className="gf-absolute gf-top-3 gf-right-3 gf-px-2 gf-py-1 gf-rounded-md gf-text-primary-foreground gf-bg-background-dark hover:gf-bg-background-dark gf-typo-small gf-font-medium gf-h-[1.875rem]"
        >
          {__('Featured', 'growfund')}
        </Button>
      )}
    </div>
  );
}

interface SortableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  isFeatured: boolean;
}

function SortableItem({ id, children, isFeatured }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transformOrigin: '0 0',
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'gf-touch-manipulation gf-cursor-grab',
        isFeatured ? 'md:gf-col-span-2 md:gf-row-span-2' : '',
        isDragging ? 'gf-z-10' : '',
      )}
    >
      {children}
    </div>
  );
}

interface Image extends MediaAttachment {
  featured?: boolean;
}

const Gallery = ({
  images,
  onChange,
  onUpload,
  isLoading = false,
}: {
  images: Image[];
  onUpload: () => void;
  onChange: (images: Image[]) => void;
  isLoading?: boolean;
}) => {
  const [items, setItems] = useState<Image[]>(images);
  const { checkedItems, setCheckedItems } = useGalleryContext();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    onChange(items);
  }, [items, onChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);
        return newArray;
      });
    }

    setActiveId(null);
  }

  const handleCheck = (id: UniqueIdentifier) => (checked: boolean) => {
    if (checked) {
      setCheckedItems((items) => [...items, id]);
    } else {
      setCheckedItems((items) => items.filter((item) => item !== id));
    }
  };

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  return (
    <div className="gf-p-2 gf-bg-background-surface-secondary gf-rounded-md gf-w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="gf-grid gf-grid-cols-1 md:gf-grid-cols-[repeat(auto-fit,minmax(94px,_1fr))] gf-gap-2 gf-auto-rows-[1fr]">
          <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id} isFeatured={index === 0}>
                <ImageCard
                  image={item.url}
                  featured={index === 0}
                  isChecked={checkedItems.includes(item.id)}
                  onCheck={handleCheck(item.id)}
                />
              </SortableItem>
            ))}
          </SortableContext>
          <div className="gf-relative">
            <Button
              variant="outline"
              className="gf-rounded-md gf-size-full hover:gf-bg-white"
              onClick={onUpload}
            >
              {isLoading ? <LoadingSpinner /> : <Plus className="!gf-size-6" />}
            </Button>
          </div>
        </div>
        <DragOverlay adjustScale={true}>
          {activeItem ? <ImageCard image={activeItem.url} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export { Gallery };
