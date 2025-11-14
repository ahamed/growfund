import { __, _n, sprintf } from '@wordpress/i18n';
import { Bell, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Alert } from '@/components/ui/alert';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RouteConfig } from '@/config/route-config';
import { useAppConfig } from '@/contexts/app-config';
import { ActionBadge } from '@/features/campaigns/components/campaign-action/action-badge';
import {
  getActionAlerts,
  getActionHeaderText,
  prepareActionOptions,
  prepareMessageKey,
} from '@/features/campaigns/components/campaign-action/campaign-action-services';
import { type Action } from '@/features/campaigns/components/campaign-action/campaign-action-types';
import { useConsentDialog } from '@/features/campaigns/contexts/consent-dialog-context';
import {
  useCampaignDetailsQuery,
  useChargeBackersMutation,
  useDeleteCampaignMutation,
  useUpdateCampaignSecondaryStatusMutation,
  useUpdateCampaignStatusMutation,
} from '@/features/campaigns/services/campaign';
import { useRouteParams } from '@/hooks/use-route-params';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const CampaignAction = () => {
  const { id: campaignId } = useRouteParams(RouteConfig.CampaignBuilder);
  const [campaignAction, setCampaignAction] = useState<Action | null>(null);
  const { isDonationMode } = useAppConfig();

  const { data: campaign } = useCampaignDetailsQuery(campaignId);
  const updateSecondaryStatusMutation = useUpdateCampaignSecondaryStatusMutation();
  const chargeBackerMutation = useChargeBackersMutation();
  const updateStatusMutation = useUpdateCampaignStatusMutation();
  const deleteCampaignMutation = useDeleteCampaignMutation();
  const { openDialog } = useConsentDialog();
  const navigate = useNavigate();

  if (!isDefined(campaign)) {
    return null;
  }

  const shouldShowAction = ['published', 'funded', 'completed'].includes(campaign.status);

  if (!shouldShowAction) {
    return null;
  }

  const handleCampaignAction = () => {
    if (!isDefined(campaignAction)) {
      return;
    }

    switch (campaignAction) {
      case 'hide':
      case 'visible':
      case 'pause':
      case 'resume':
        updateSecondaryStatusMutation.mutate({
          id: campaign.id,
          status: campaignAction,
        });
        break;
      case 'end':
        openDialog({
          title: __('End Campaign', 'growfund'),
          content: (
            <div className="gf-space-y-3">
              <p>{__('Are you sure you want to end this campaign?', 'growfund')}</p>
              <Alert variant="warning">{actionAlerts.get('end')}</Alert>
            </div>
          ),
          confirmText: __('End Campaign', 'growfund'),
          declineText: __('Cancel', 'growfund'),
          onConfirm: async (closeDialog) => {
            await updateSecondaryStatusMutation.mutateAsync({
              id: campaign.id,
              status: campaignAction,
            });
            closeDialog();
          },
        });
        break;
      case 'charge-backers':
        openDialog({
          title: __('Charge Backers', 'growfund'),
          content: (
            <div className="gf-space-y-3">
              <p>{__('Are you sure you want to charge backers?', 'growfund')}</p>
              <Alert variant="warning">{actionAlerts.get('charge-backers')}</Alert>
            </div>
          ),
          confirmText: __('Charge', 'growfund'),
          declineText: __('Cancel', 'growfund'),
          onConfirm: async (closeDialog) => {
            await chargeBackerMutation.mutateAsync({ campaign_id: campaign.id });
            closeDialog();
          },
        });
        break;
      case 'funded':
        openDialog({
          title: __('Mark as Funded', 'growfund'),
          content: (
            <div className="gf-space-y-3">
              <p>{__('Are you sure you want to mark this campaign as funded?', 'growfund')}</p>
              <Alert variant="warning">{actionAlerts.get('funded')}</Alert>
            </div>
          ),
          confirmText: __('Mark as Funded', 'growfund'),
          declineText: __('Cancel', 'growfund'),
          onConfirm: async (closeDialog) => {
            await updateStatusMutation.mutateAsync({
              id: campaign.id,
              status: campaignAction,
            });
            closeDialog();
          },
        });
        break;
      case 'completed':
        openDialog({
          title: __('Mark as Completed', 'growfund'),
          content: (
            <div className="gf-space-y-3">
              <p>{__('Are you sure you want to mark this campaign as completed?', 'growfund')}</p>
              <Alert variant="warning">{actionAlerts.get('completed')}</Alert>
            </div>
          ),
          confirmText: __('Mark as Completed', 'growfund'),
          declineText: __('Cancel', 'growfund'),
          onConfirm: async (closeDialog) => {
            await updateStatusMutation.mutateAsync({
              id: campaign.id,
              status: campaignAction,
            });
            closeDialog();
          },
        });
        break;
      case 'delete':
        openDialog({
          title: __('Delete Campaign', 'growfund'),
          content: (
            <div className="gf-space-y-3">
              <p>{__('Are you sure you want to delete this campaign?', 'growfund')}</p>
              <Alert variant="destructive">{actionAlerts.get('delete')}</Alert>
            </div>
          ),
          confirmButtonVariant: 'destructive',
          confirmText: __('Delete', 'growfund'),
          declineText: __('Cancel', 'growfund'),
          onConfirm: async (closeDialog) => {
            await deleteCampaignMutation.mutateAsync(campaignId);
            closeDialog();
            void navigate(RouteConfig.Campaigns.buildLink());
          },
        });
        break;
    }
    setCampaignAction(null);
  };

  const actionAlerts = getActionAlerts(isDonationMode);
  const options = prepareActionOptions(campaign, isDonationMode);
  const key = prepareMessageKey(campaign);
  const actionAlert = campaignAction ? actionAlerts.get(campaignAction) : null;

  if (!isDefined(key)) {
    return null;
  }

  const headerText = getActionHeaderText(isDonationMode).get(key);
  const isFunded = campaign.status === 'funded';
  const isCompleted = campaign.status === 'completed';

  return (
    <Box className="gf-border-none">
      <BoxContent className="gf-space-y-4">
        <div className="gf-flex gf-items-center gf-justify-between">
          <div className="gf-flex gf-items-center gf-gap-2">
            <ActionBadge variant={headerText?.variant} />
            <p className="gf-typo-tiny gf-text-fg-secondary">{headerText?.label}</p>
          </div>
          {isFunded && (
            <div className="gf-flex gf-items-center gf-gap-2 gf-typo-tiny gf-text-fg-secondary">
              <PartyPopper className="gf-size-4 gf-text-icon-brand" />
              {__('Campaign is funded', 'growfund')}
            </div>
          )}
        </div>

        {!isDonationMode && campaign.uncharged_pledge_count > 0 && (
          <div className="gf-bg-background-surface-secondary gf-rounded-md gf-p-2 gf-flex gf-items-center gf-gap-2 gf-justify-center gf-typo-small gf-text-fg-critical">
            <Bell className="gf-size-4 gf-text-icon-critical" />
            {sprintf(
              /* translators: %d: number of uncharged pledges */
              _n('%d New Pledge', '%d New Pledges', campaign.uncharged_pledge_count, 'growfund'),
              campaign.uncharged_pledge_count,
            )}
          </div>
        )}

        {isCompleted && !!campaign.number_of_contributions && (
          <div className="gf-bg-background-surface-secondary gf-rounded-md gf-p-2 gf-flex gf-items-center gf-gap-2 gf-justify-center gf-typo-small gf-text-fg-brand">
            {sprintf(
              isDonationMode
                ? /* translators: %d: number of donations */
                  _n('%d Donation', '%d Donations', campaign.number_of_contributions, 'growfund')
                : /* translators: %d: number of pledges */
                  _n('%d Pledge', '%d Pledges', campaign.number_of_contributions, 'growfund'),
              campaign.number_of_contributions,
            )}
          </div>
        )}

        <div className="gf-space-y-2">
          <FormLabel>{__('Take an Action', 'growfund')}</FormLabel>
          <Select
            value={campaignAction ?? ''}
            onValueChange={(value) => {
              setCampaignAction(value as Action);
            }}
          >
            <SelectTrigger className="[&>span]:gf-flex [&>span]:gf-items-center [&_svg]:gf-size-4 [&_svg]:gf-text-icon-primary">
              <SelectValue placeholder={__('Select an Action', 'growfund')} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => {
                if (option.value === 'separator') {
                  return <SelectSeparator key={index} />;
                }
                return (
                  <SelectItem
                    key={index}
                    value={option.value}
                    className={cn(
                      '[&>span]:gf-flex [&>span]:gf-items-center [&_svg]:gf-size-4 [&_svg]:gf-text-icon-primary',
                      option.is_critical && 'gf-text-fg-critical [&_svg]:gf-text-icon-critical',
                    )}
                  >
                    <span className="gf-mr-2 gf-text-icon-primary">{option.icon}</span>
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {actionAlert && <Alert>{actionAlert}</Alert>}

        <Button className="gf-w-full" disabled={!campaignAction} onClick={handleCampaignAction}>
          {__('Update', 'growfund')}
        </Button>
      </BoxContent>
    </Box>
  );
};

export default CampaignAction;
