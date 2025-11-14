import { __ } from '@wordpress/i18n';
import { FileText } from 'lucide-react';

import { EmptySearchIcon2 } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import BackerActivityLog from '@/features/backers/components/activity/backer-activity-log';
import BackerActivities from '@/features/backers/components/activity/sheet/backer-activity-log-sheet';
import { useBackerContext } from '@/features/backers/contexts/backer';
import { isDefined } from '@/utils';

const BackerActivityLogCard = () => {
  const { backer } = useBackerContext();
  const activities = backer.activity_logs;

  if (activities.length === 0) {
    return (
      <Box className="gf-border-none gf-group/activity-logs">
        <BoxContent className="gf-p-5 gf-h-full">
          <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary">
            {__('Activity Logs', 'growfund')}
          </h6>
          <EmptyState className="gf-shadow-none gf-mt-0">
            <EmptySearchIcon2 />
            <EmptyStateDescription>
              {__('No activities created yet.', 'growfund')}
            </EmptyStateDescription>
          </EmptyState>
        </BoxContent>
      </Box>
    );
  }

  return (
    <Box className="gf-border-none gf-group/activity-logs">
      <BoxContent className="gf-p-5">
        <div className="gf-flex gf-items-center gf-justify-between">
          <h6 className="gf-typo-h6 gf-font-semibold gf-text-fg-primary">
            {__('Activity Logs', 'growfund')}
          </h6>
          {isDefined(backer) && (
            <BackerActivities backerId={backer.backer_information.id}>
              <Button
                variant="ghost"
                size="sm"
                className="gf-transition-opacity gf-opacity-0 group-hover/activity-logs:gf-opacity-100"
              >
                <FileText />
                {__('See All Logs', 'growfund')}
              </Button>
            </BackerActivities>
          )}
        </div>
        <div className="gf-space-y-4 gf-mt-5">
          {activities.map((activity) => {
            return <BackerActivityLog key={activity.id} activity={activity} />;
          })}
        </div>
      </BoxContent>
    </Box>
  );
};

export default BackerActivityLogCard;
