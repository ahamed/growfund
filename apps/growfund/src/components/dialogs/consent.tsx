import { __ } from '@wordpress/i18n';
import React, { useId } from 'react';

import { Button, type ButtonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ConsentDialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  checkboxContent?: React.ReactNode;
  checkboxLabel?: string;
  showCheckBox?: boolean;
  checkboxChecked: boolean;
  setCheckboxChecked: (checked: boolean) => void;
  onConfirm: () => void;
  onDecline: () => void;
  children?: React.ReactNode;
  confirmText?: string;
  declineText?: string;
  confirmButtonVariant?: ButtonVariants;
  declineButtonVariant?: ButtonVariants;
  loading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConsentDialog = React.forwardRef<HTMLDivElement, ConsentDialogProps>(
  (
    {
      title,
      content,
      checkboxContent,
      checkboxLabel,
      showCheckBox = false,
      checkboxChecked,
      setCheckboxChecked,
      onConfirm,
      onDecline,
      confirmText = __('Confirm', 'growfund'),
      declineText = __('Decline', 'growfund'),
      confirmButtonVariant = 'primary',
      declineButtonVariant = 'outline',
      children,
      loading = false,
      className,
      open,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const deleteAssocCheckboxId = useId();
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent ref={ref} className={className} {...props}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogCloseButton className="gf-size-6" />
          </DialogHeader>
          <div className="gf-p-4 gf-py-0">
            <div className="gf-typo-small gf-text-fg-primary">{content}</div>
            {showCheckBox && (
              <div className="gf-mt-4 gf-flex gf-items-center gf-gap-2">
                <Checkbox
                  id={deleteAssocCheckboxId}
                  checked={checkboxChecked}
                  onCheckedChange={(checked) => {
                    setCheckboxChecked(!!checked);
                  }}
                >
                  {checkboxContent}
                </Checkbox>
                <Label
                  htmlFor={deleteAssocCheckboxId}
                  className="gf-fg-text-primary gf-font-medium gf-text-sm"
                >
                  {checkboxLabel}
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant={declineButtonVariant} onClick={onDecline}>
              {declineText}
            </Button>
            <Button
              onClick={onConfirm}
              variant={confirmButtonVariant}
              disabled={loading}
              loading={loading}
            >
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default ConsentDialog;
