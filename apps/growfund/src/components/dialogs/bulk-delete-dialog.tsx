import { __, sprintf } from '@wordpress/i18n';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { useCurrency } from '@/hooks/use-currency';

export type BulkDeleteItemType =
  | 'fund'
  | 'campaign'
  | 'donation'
  | 'pledge'
  | 'contributor'
  | 'category'
  | 'tag';

interface Data {
  id?: string;
  image?: string | null;
  name: string;
  email?: string;
  amount?: number;
}

interface BulkDeleteDialogProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  deleteButtonText?: string;
  cancelButtonText?: string;
  data: Data[];
  onDelete: (closeDialog: () => void) => void;
  isAvatar?: boolean;
  showImage?: boolean;
  loading?: boolean;
  type: BulkDeleteItemType;
}

const BulkDeleteDialog = ({
  title,
  description,
  open,
  setOpen,
  deleteButtonText = __('Delete', 'growfund'),
  cancelButtonText = __('Cancel', 'growfund'),
  data,
  isAvatar = false,
  showImage = true,
  onDelete,
  type,
  loading = false,
}: React.PropsWithChildren<BulkDeleteDialogProps>) => {
  const { toCurrency } = useCurrency();

  const renderItem = (item: Data, type: BulkDeleteItemType) => {
    switch (type) {
      case 'fund':
        return (
          <>
            <div className="gf-shrink-0 gf-max-w-60 gf-m-3">
              <span className="gf-truncate">{item.name}</span>
            </div>
            <div>
              {item.amount && <span className="gf-font-medium">{toCurrency(item.amount)}</span>}
            </div>
          </>
        );

      case 'campaign':
        return (
          <>
            {/* translators: %s: campaign ID */}
            <div className="gf-shrink-0">{sprintf(__('ID #%s', 'growfund'), item.id)}</div>
            <div className="gf-shrink-0">
              {showImage &&
                (isAvatar ? (
                  <Avatar className="gf-size-8">
                    <AvatarImage src={item.image ?? undefined} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Image
                    src={item.image ?? null}
                    alt={item.name}
                    className="gf-size-8"
                    fit="cover"
                    aspectRatio="square"
                  />
                ))}
            </div>
            <div className="gf-max-w-60 gf-flex gf-flex-col gf-gap-1" title={item.name}>
              <span className="gf-truncate">{item.name}</span>
            </div>
          </>
        );
      case 'contributor':
        return (
          <div className="gf-flex gf-gap-4 gf-items-center gf-w-full">
            <div className="gf-shrink-0 gf-min-w-[100px]">
              {/* translators: %s: contributor ID (backer ID or donor ID) */}
              {sprintf(__('ID #%s', 'growfund'), item.id)}
            </div>
            <div className="gf-shrink-0">
              {showImage &&
                (isAvatar ? (
                  <Avatar className="gf-size-8">
                    <AvatarImage src={item.image ?? undefined} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Image
                    src={item.image ?? null}
                    alt={item.name}
                    className="gf-size-8 gf-rounded-full"
                    fit="cover"
                    aspectRatio="square"
                  />
                ))}
            </div>
            <div className="gf-flex gf-flex-col gf-gap-1 gf-max-w-60" title={item.name}>
              <span className="gf-truncate">{item.name}</span>
              {item.email && <span className="gf-truncate">{item.email}</span>}
            </div>
          </div>
        );
      case 'category':
        return (
          <div className="gf-flex gf-gap-4 gf-items-center gf-w-full">
            <div className="gf-shrink-0">
              {showImage &&
                (isAvatar ? (
                  <Avatar className="gf-size-8">
                    <AvatarImage src={item.image ?? undefined} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Image
                    src={item.image ?? null}
                    alt={item.name}
                    className="gf-size-8"
                    fit="cover"
                    aspectRatio="square"
                  />
                ))}
            </div>

            <div className="gf-flex gf-flex-col gf-gap-1 gf-max-w-60" title={item.name}>
              <span className="gf-truncate">{item.name}</span>
            </div>
          </div>
        );
      case 'tag':
        return (
          <div className="gf-m-2 gf-max-w-60">
            <span className="gf-truncate">{item.name}</span>
          </div>
        );

      case 'pledge':
      case 'donation':
        return (
          <>
            {/* translators: %s: contribution ID (pledge ID or donation ID) */}
            <div className="gf-shrink-0 gf-my-3">{sprintf(__('ID #%s', 'growfund'), item.id)}</div>
            {item.amount && (
              <div className="gf-shrink-0 gf-font-medium">{toCurrency(item.amount)}</div>
            )}
            <div className="gf-truncate gf-text-fg-secondary gf-max-w-60">
              {/* translators: %s: contributor name (backer name or donor name) */}
              {sprintf(__('by %s', 'growfund'), item.name)}
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="gf-px-4 gf-py-0 gf-space-y-3">
          <p className="gf-typo-sm gf-text-fg-secondary">{description}</p>
          <Box className="gf-max-h-96 gf-overflow-y-auto gf-border-border-tertiary gf-shadow-none">
            {data.map((item) => {
              return (
                <div
                  key={item.id}
                  className="gf-grid gf-grid-cols-[1fr_1fr_6fr] gf-items-center gf-gap-4 gf-space-x-3 [&:not(:last-of-type)]:gf-border-b [&:not(:last-of-type)]:gf-border-b-border gf-px-6 gf-py-2 gf-typo-tiny gf-text-fg-primary"
                >
                  {renderItem(item, type)}
                </div>
              );
            })}
          </Box>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              {cancelButtonText}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            loading={loading}
            disabled={loading}
            onClick={() => {
              onDelete(() => {
                setOpen(false);
              });
            }}
          >
            {deleteButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteDialog;
