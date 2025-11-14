import { __ } from '@wordpress/i18n';
import { Lock } from 'lucide-react';
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { TextField } from '@/components/form/text-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useResetPasswordMutation } from '@/dashboards/shared/services/user';
import { type User } from '@/features/settings/schemas/settings';
import { useFormErrorHandler } from '@/hooks/use-form-error-handler';

const UserResetPasswordDialog = ({ children, user }: React.PropsWithChildren<{ user: User }>) => {
  const [open, setOpen] = useState(false);
  const form = useForm<{
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }>({
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  });

  const resetPasswordMutation = useResetPasswordMutation();

  const { createErrorHandler } = useFormErrorHandler(form);

  const oldPassword = useWatch({ control: form.control, name: 'old_password' });
  const newPassword = useWatch({ control: form.control, name: 'new_password' });
  const confirmNewPassword = useWatch({ control: form.control, name: 'confirm_new_password' });
  const isNewPasswordValid = newPassword === confirmNewPassword;
  const isDisabled = !oldPassword || !newPassword || !confirmNewPassword || !isNewPasswordValid;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="gf-flex gf-items-center gf-gap-2">
            <Lock className="gf-size-5 gf-text-icon-primary" />
            {__('Reset Password', 'growfund')}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (values) => {
                resetPasswordMutation.mutate(
                  {
                    user_id: user.id,
                    ...values,
                  },
                  {
                    onError: createErrorHandler(),
                    onSuccess: () => {
                      setOpen(false);
                      form.reset();
                    },
                  },
                );
              },
              (errors) => {
                console.error(errors);
              },
            )}
          >
            <div className="gf-space-y-4 gf-p-4">
              <TextField
                control={form.control}
                name="old_password"
                type="password"
                label={__('Old Password', 'growfund')}
                placeholder={__('Enter your old password', 'growfund')}
              />
              <div className="gf-flex gf-items-end gf-gap-3">
                <TextField
                  control={form.control}
                  type="password"
                  name="new_password"
                  label={__('Password', 'growfund')}
                  placeholder={__('Enter your new password', 'growfund')}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    form.setValue('new_password', Math.random().toString(36).substring(2, 15));
                  }}
                >
                  {__('Generate', 'growfund')}
                </Button>
              </div>
              <TextField
                control={form.control}
                type="password"
                name="confirm_new_password"
                label={__('Confirm Password', 'growfund')}
                placeholder={__('Enter your new password again', 'growfund')}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{__('Cancel', 'growfund')}</Button>
              </DialogClose>
              <Button type="submit" disabled={isDisabled}>
                {__('Update Password', 'growfund')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserResetPasswordDialog;
