import { __, sprintf } from '@wordpress/i18n';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router';

import { EmptySearchIcon2 } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { LoadingSkeleton } from '@/components/layouts/loading-skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Box, BoxContent, BoxTitle } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/tooltip';
import { RouteConfig } from '@/config/route-config';
import { useAppConfig } from '@/contexts/app-config';
import { type DonationStatus } from '@/features/donations/schemas/donation';
import { type PledgeStatus } from '@/features/pledges/schemas/pledge';
import { useCurrency } from '@/hooks/use-currency';
import { type MediaAttachment } from '@/schemas/media';

const badges: BadgeVariant[] = ['primary', 'secondary', 'warning', 'info', 'special'];

interface RecentContributionsProps {
  contributions: {
    id: string;
    amount: number;
    status: DonationStatus | PledgeStatus;
    campaign_title: string;
    contributor: {
      first_name: string;
      last_name: string;
      image?: MediaAttachment | null;
    };
  }[];
  title: string;
  loading?: boolean;
}

const RecentContributions = ({ contributions, title, loading }: RecentContributionsProps) => {
  const { toCurrency } = useCurrency();
  const navigate = useNavigate();
  const { isDonationMode } = useAppConfig();

  if (contributions.length === 0) {
    return (
      <Box className="gf-rounded-3xl">
        <BoxContent className="gf-py-4 gf-px-6 gf-h-full gf-overflow-hidden">
          <BoxTitle>{title}</BoxTitle>
          <EmptyState className="gf-h-full gf-shadow-none gf-pt-0">
            <EmptySearchIcon2 />
            <EmptyStateDescription>{__('No data found.', 'growfund')}</EmptyStateDescription>
          </EmptyState>
        </BoxContent>
      </Box>
    );
  }

  return (
    <Box className="gf-rounded-3xl">
      <BoxContent className="gf-py-4 gf-px-6">
        <BoxTitle className="gf-justify-between [&>span>[data-type=tooltip]]:gf-opacity-0 group-hover/box:[&>span>[data-type=tooltip]]:gf-opacity-100">
          <span>
            {title}
            <InfoTooltip>
              {isDonationMode
                ? __(
                    'Recent donations show the most recent donation contributions made across all campaigns, regardless of their current status.',
                    'growfund',
                  )
                : __(
                    'Recent pledges show the most recent pledge contributions made across all campaigns, regardless of their current status.',
                    'growfund',
                  )}
            </InfoTooltip>
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="gf-opacity-0 group-hover/box:gf-opacity-100"
            onClick={() => {
              if (isDonationMode) {
                void navigate(RouteConfig.Donations.buildLink());

                return;
              }
              void navigate(RouteConfig.Pledges.buildLink());
            }}
          >
            <FileText className="gf-size-4" />
            {isDonationMode
              ? __('See All Donations', 'growfund')
              : __('See All Pledges', 'growfund')}
          </Button>
        </BoxTitle>
        <div className="gf-space-y-5 gf-mt-4">
          {contributions.map((contribution) => {
            return (
              <LoadingSkeleton key={contribution.id} loading={loading} showAvatarSkeleton>
                <div className="gf-w-full">
                  <div className="gf-flex gf-items-start gf-gap-2">
                    <Avatar className="gf-size-5">
                      <AvatarImage
                        src={contribution.contributor.image?.url ?? undefined}
                        alt={contribution.contributor.first_name}
                      />
                      <AvatarFallback className="gf-typo-tiny">
                        {contribution.contributor.first_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="gf-w-full gf-space-y-2">
                      <div className="gf-flex gf-items-center gf-gap-2">
                        <p
                          title={sprintf(
                            '%s %s',
                            contribution.contributor.first_name,
                            contribution.contributor.last_name,
                          )}
                          className="gf-typo-small gf-font-medium gf-text-fg-primary gf-break-all gf-line-clamp-1"
                        >
                          {sprintf(
                            '%s %s',
                            contribution.contributor.first_name,
                            contribution.contributor.last_name,
                          )}
                        </p>
                        <Badge variant={badges[Math.floor(Math.random() * badges.length + 1)]}>
                          {toCurrency(contribution.amount)}
                        </Badge>
                        {contribution.status === 'pending' && (
                          <Badge variant="warning">{__('Pending', 'growfund')}</Badge>
                        )}
                      </div>
                      <div
                        title={contribution.campaign_title}
                        className="gf-text-fg-secondary gf-typo-small gf-break-all gf-line-clamp-1"
                      >
                        {contribution.campaign_title}
                      </div>
                    </div>
                  </div>
                </div>
              </LoadingSkeleton>
            );
          })}
        </div>
      </BoxContent>
    </Box>
  );
};

export default RecentContributions;
