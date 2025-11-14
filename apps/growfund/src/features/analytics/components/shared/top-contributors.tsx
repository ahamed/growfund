import { __, sprintf } from '@wordpress/i18n';
import { FileText, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router';

import { EmptySearchIcon2 } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { LoadingSkeletonJustifyBetween } from '@/components/layouts/loading-skeleton';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Box, BoxContent, BoxTitle } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { DotSeparator } from '@/components/ui/dot-separator';
import { Image } from '@/components/ui/image';
import { InfoTooltip } from '@/components/ui/tooltip';
import { RouteConfig } from '@/config/route-config';
import { useAppConfig } from '@/contexts/app-config';
import { useCurrency } from '@/hooks/use-currency';
import { type MediaAttachment } from '@/schemas/media';

interface TopContributorsProps {
  users: {
    id: string;
    first_name: string;
    last_name: string;
    image?: MediaAttachment | null;
    total_contributions: number;
    number_of_contributions: number;
  }[];
  loading?: boolean;
}

const badges: BadgeVariant[] = ['primary', 'secondary', 'warning', 'info', 'special'];

const TopContributors = ({ users, loading }: TopContributorsProps) => {
  const navigate = useNavigate();
  const { isDonationMode } = useAppConfig();
  const { toCurrency } = useCurrency();

  if (users.length === 0) {
    return (
      <Box className="gf-rounded-3xl">
        <BoxContent className="gf-py-4 gf-px-6 gf-h-full gf-overflow-hidden">
          <BoxTitle>
            {isDonationMode ? __('Top Donors', 'growfund') : __('Top Backers', 'growfund')}
          </BoxTitle>
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
            {isDonationMode ? __('Top Donors', 'growfund') : __('Top Backers', 'growfund')}
            <InfoTooltip>
              {isDonationMode
                ? __(
                    'The Donors who have made the highest total donations across all campaigns.',
                    'growfund',
                  )
                : __(
                    'The Backers who have made the highest total contributions across all campaigns.',
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
                void navigate(RouteConfig.Donors.buildLink());

                return;
              }

              void navigate(RouteConfig.Backers.buildLink());
            }}
          >
            <FileText className="gf-size-4" />
            {isDonationMode ? __('See All Donors', 'growfund') : __('See All Backers', 'growfund')}
          </Button>
        </BoxTitle>
        <div className="gf-space-y-5 gf-mt-4">
          {users.map((user) => {
            return (
              <LoadingSkeletonJustifyBetween key={user.id} loading={loading} showAvatarSkeleton>
                <div className="gf-flex gf-items-center gf-justify-between">
                  <div className="gf-flex gf-items-center gf-gap-2">
                    <Image
                      src={user.image?.url ?? null}
                      alt={user.first_name}
                      className="gf-size-5 gf-rounded-full"
                      aspectRatio="square"
                    />
                    <p
                      className="gf-typo-small gf-font-medium gf-text-fg-primary gf-max-w-32 gf-truncate"
                      title={sprintf('%s %s', user.first_name, user.last_name)}
                    >
                      {sprintf('%s %s', user.first_name, user.last_name)}
                    </p>
                    <DotSeparator />
                    <div className="gf-flex gf-items-center gf-gap-1">
                      <HeartHandshake className="gf-size-3 gf-text-icon-primary" />
                      <span className="gf-typo-tiny gf-font-medium gf-text-fg-secondary">
                        {isDonationMode
                          ? /* translators: %s: number of donations */
                            sprintf(__('%s donations', 'growfund'), user.number_of_contributions)
                          : /* translators: %s: number of pledges */
                            sprintf(__('%s pledges', 'growfund'), user.number_of_contributions)}
                      </span>
                    </div>
                  </div>
                  <Badge variant={badges[Math.floor(Math.random() * badges.length + 1)]}>
                    {toCurrency(user.total_contributions)}
                  </Badge>
                </div>
              </LoadingSkeletonJustifyBetween>
            );
          })}
        </div>
      </BoxContent>
    </Box>
  );
};

export default TopContributors;
