import { ArrowTopRightIcon, TimerIcon } from '@radix-ui/react-icons';
import { __, _n, sprintf } from '@wordpress/i18n';
import { format } from 'date-fns';
import { ArrowUpRight, BookmarkMinus, Trash2, Users } from 'lucide-react';
import React from 'react';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { DotSeparator } from '@/components/ui/dot-separator';
import { Image } from '@/components/ui/image';
import { Progress } from '@/components/ui/progress';
import { getGoalInfo } from '@/config/goal-info';
import { useAppConfig } from '@/contexts/app-config';
import { type Campaign } from '@/features/campaigns/schemas/campaign';
import { useCurrency } from '@/hooks/use-currency';
import { DATE_FORMATS } from '@/lib/date';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

interface CampaignCardProps extends React.HTMLAttributes<HTMLDivElement> {
  campaign: Campaign;
  onRemove?: () => void;
  onRemoveBookmark?: () => void;
  mode?: 'view' | 'edit' | 'bookmark';
  showPreview?: boolean;
}

const CampaignCard = React.forwardRef<HTMLDivElement, CampaignCardProps>(
  (
    {
      campaign,
      onRemove,
      onRemoveBookmark,
      mode = 'edit',
      showPreview = false,
      className,
      ...props
    },
    ref,
  ) => {
    const { isDonationMode } = useAppConfig();
    const { toCurrency } = useCurrency();
    const goalInfo = getGoalInfo(campaign, isDonationMode, toCurrency);

    return (
      <Box
        className={cn(
          'gf-flex gf-gap-6 gf-p-4 gf-items-center gf-relative gf-group/campaign-card',
          className,
        )}
        {...props}
        ref={ref}
      >
        <Image
          src={campaign.images?.[0]?.url ?? null}
          alt={campaign.title}
          aspectRatio="square"
          className="gf-w-[6.25rem]"
          fit="cover"
        />

        <div className="gf-grid gf-gap-1 gf-flex-1">
          <div className="gf-typo-paragraph gf-font-medium gf-text-fg-primary">
            {campaign.title}
          </div>
          <div className="gf-flex gf-items-center gf-gap-2">
            {isDefined(campaign.created_by) && (
              <>
                <div className="gf-text-fg-secondary gf-flex gf-items-center gf-gap-1 gf-flex-shrink-0">
                  <span>{__('by', 'growfund')}</span>
                  <span className="gf-text-fg-success gf-capitalize">{campaign.created_by}</span>
                </div>
                <DotSeparator />
              </>
            )}

            {campaign.start_date && (
              <div className="gf-flex gf-items-center gf-gap-2 gf-typo-small gf-text-fg-secondary">
                <TimerIcon className="gf-w-4 gf-h-4 gf-text-icon-primary" />
                <span>
                  {sprintf(
                    /* translators: %s: campaign start date */
                    __('Starts from %s', 'growfund'),
                    format(new Date(campaign.start_date), DATE_FORMATS.HUMAN_READABLE_V2),
                  )}
                </span>
              </div>
            )}
          </div>
          {campaign.has_goal && isDefined(goalInfo) ? (
            <>
              <div className="gf-w-full gf-max-w-[20rem]">
                <Progress value={goalInfo.progress_percentage} className="gf-mt-1" />
              </div>
              <div className="gf-typo-paragraph gf-font-medium gf-text-fg-secondary">
                <span
                  className="gf-text-primary"
                  dangerouslySetInnerHTML={{ __html: goalInfo.goal_label }}
                />
              </div>
            </>
          ) : (
            <div className="gf-typo-paragraph gf-font-medium  gf-text-fg-secondary gf-flex gf-items-center gf-gap-2">
              <span className="gf-text-primary">
                {/* translators: %s: Raised amount. */}
                {sprintf('%s raised', toCurrency(campaign.fund_raised ?? 0))}
              </span>
              <DotSeparator />
              <Users className="gf-size-3" />
              <span className="gf-typo-small">
                {sprintf(
                  isDonationMode
                    ? /* translators: %s: number of donors */
                      _n('%s donor', '%s donors', campaign.number_of_contributors ?? 0, 'growfund')
                    : /* translators: %s: number of backers */
                      _n(
                        '%s backer',
                        '%s backers',
                        campaign.number_of_contributors ?? 0,
                        'growfund',
                      ),
                  campaign.number_of_contributors ?? 0,
                )}
              </span>
            </div>
          )}
        </div>

        <div className="gf-ms-auto gf-opacity-0 gf-transition-opacity group-hover/campaign-card:gf-opacity-100">
          {mode === 'bookmark' && (
            <div className="gf-flex gf-flex-col gf-gap-2">
              <Button variant="secondary" size="icon" className="" onClick={onRemoveBookmark}>
                <BookmarkMinus />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  if (!campaign.preview_url) {
                    return;
                  }
                  window.open(campaign.preview_url, '_blank');
                }}
              >
                <ArrowUpRight />
              </Button>
            </div>
          )}

          {mode === 'edit' && (
            <Button
              variant="secondary"
              size="icon"
              className="hover:gf-text-icon-critical"
              onClick={onRemove}
            >
              <Trash2 />
            </Button>
          )}

          {showPreview && (
            <Button
              variant="secondary"
              size="icon"
              className="gf-top-4 gf-right-4"
              onClick={() => {
                if (!campaign.preview_url) {
                  return;
                }
                window.open(campaign.preview_url, '_blank');
              }}
            >
              <ArrowTopRightIcon />
            </Button>
          )}
        </div>
      </Box>
    );
  },
);

export default CampaignCard;
