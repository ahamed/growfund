import { __ } from '@wordpress/i18n';
import { AlertOctagon } from 'lucide-react';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { TextField } from '@/components/form/text-field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useDeleteMyAccountMutation } from '@/dashboards/shared/services/user';
import useCurrentUser from '@/hooks/use-current-user';
import { createAcronym } from '@/utils';

const DeleteUserDialog = ({ children }: React.PropsWithChildren) => {
  const { currentUser: user } = useCurrentUser();

  const form = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
  });
  const emailValue = useWatch({ control: form.control, name: 'email' });

  const deleteAccountMutation = useDeleteMyAccountMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="gf-bg-background-surface">
        <DialogTitle className="gf-sr-only">{__('Delete User', 'growfund')}</DialogTitle>

        <div className="gf-space-y-4 gf-p-6">
          <div className="gf-flex gf-flex-col gf-items-center gf-text-center gf-gap-2">
            <AlertOctagon className="gf-size-8 gf-text-icon-critical" />
            <h5 className="gf-typo-h5 gf-font-semibold gf-text-fg-primary">
              {__('Delete your entire account permanently?', 'growfund')}
            </h5>
          </div>
          <Alert variant="warning">
            <AlertTitle>
              {__(
                'We understand you want to permanently delete your account. Please note:',
                'growfund',
              )}
            </AlertTitle>
            <AlertDescription>
              <ol className="gf-list-decimal gf-list-outside gf-ps-4 gf-space-y-2">
                <li>
                  {__(
                    'You may have pledged to a few campaigns, and if you delete your account, those pledge records may remain in our system for legal records, but there is no guarantee that you will receive rewards from the campaigns you backed even if you have already paid.',
                    'growfund',
                  )}
                </li>
                <li>
                  {__('You will no longer be able to log in or recover this account.', 'growfund')}
                </li>
                <li>
                  {__(
                    'You can create a new account with the same email address if needed.',
                    'growfund',
                  )}
                </li>
              </ol>
            </AlertDescription>
          </Alert>

          <Box className="gf-bg-background-secondary gf-border-none gf-shadow-none">
            <BoxContent className="gf-flex gf-items-center gf-gap-2">
              <Avatar className="gf-size-8">
                <AvatarImage src={user.image?.url ?? undefined} />
                <AvatarFallback>
                  {createAcronym({ first_name: user.first_name, last_name: user.last_name })}
                </AvatarFallback>
              </Avatar>
              <div className="gf-space-y-1">
                <p className="gf-typo-small gf-font-medium gf-text-fg-primary gf-break-all gf-line-clamp-2">
                  {user.first_name} {user.last_name}
                </p>
                <p className="gf-typo-tiny gf-text-fg-secondary">{user.email}</p>
              </div>
            </BoxContent>
          </Box>

          <Form {...form}>
            <TextField
              control={form.control}
              name="email"
              label={__('Please type your email to confirm.', 'growfund')}
              placeholder={user.email}
            />
          </Form>

          <div className="gf-w-full gf-grid gf-gap-2">
            <Button
              variant="destructive"
              disabled={emailValue !== user.email}
              onClick={() => {
                if (emailValue === user.email) {
                  deleteAccountMutation.mutate();
                }
              }}
            >
              {__('Permanently delete account', 'growfund')}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">{__('Cancel', 'growfund')}</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
