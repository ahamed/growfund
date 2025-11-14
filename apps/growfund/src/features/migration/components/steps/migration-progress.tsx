import { __, sprintf } from '@wordpress/i18n';
import { CheckCircle2, FileHeart, Receipt, SmileIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Image } from '@/components/ui/image';
import { Progress } from '@/components/ui/progress';
import { growfundConfig } from '@/config/growfund';
import { useMigration } from '@/features/migration/contexts/migration-context';
import {
  Screen,
  ScreenContent,
  ScreenFooter,
  ScreenTitle,
} from '@/features/migration/layouts/screen';
import DecisionBox from '@/features/onboarding/components/decision-box';
import { isDefined } from '@/utils';

const MigrationProgress = () => {
  const { campaignProgress, pledgeProgress } = useMigration();
  const [openAlert, setOpenAlert] = useState(false);

  const campaignProgressPercent = useMemo(() => {
    if (!isDefined(campaignProgress) || campaignProgress.total === 0) {
      return 0;
    }

    return (campaignProgress.completed / campaignProgress.total) * 100;
  }, [campaignProgress]);

  const pledgeProgressPercent = useMemo(() => {
    if (!isDefined(pledgeProgress) || pledgeProgress.total === 0) {
      return 0;
    }

    return (pledgeProgress.completed / pledgeProgress.total) * 100;
  }, [pledgeProgress]);

  useEffect(() => {
    const delayTime = 1 * 60 * 1000;
    const timer = setTimeout(() => {
      setOpenAlert(true);
    }, delayTime);

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <DecisionBox className="gf-flex gf-items-center gf-justify-center">
        <Image
          src="/images/reward-mode.webp"
          className="gf-size-full gf-border-none gf-max-h-[20.75rem]"
          fit="cover"
        />
      </DecisionBox>
      <DecisionBox>
        <Screen className="gf-space-y-5">
          <ScreenContent>
            <div className="gf-space-y-3">
              {/* translators: %s: Growfund version */}
              <ScreenTitle>
                {sprintf(__('Migrating to Growfund %s', 'growfund'), growfundConfig.version)}
              </ScreenTitle>
              <div className="gf-space-y-1">
                <div className="gf-flex gf-items-center gf-justify-between">
                  <p className="gf-typo-small gf-text-fg-primary">{__('Progress', 'growfund')}</p>
                  <Badge variant="primary" className="gf-rounded-full">
                    {`${((campaignProgressPercent + pledgeProgressPercent) / 2).toFixed(0)}%`}
                  </Badge>
                </div>
                <div className="gf-flex gf-items-center gf-gap-1">
                  <Progress value={campaignProgressPercent} />
                  <Progress value={pledgeProgressPercent} />
                </div>
              </div>
            </div>
            <div className="gf-grid gf-gap-2 gf-mt-6">
              <div className="gf-flex gf-items-center gf-rounded-lg gf-py-2 gf-px-3 gf-bg-background-surface gf-border gf-border-border gf-gap-3">
                {campaignProgressPercent < 100 ? (
                  <CircularProgress value={campaignProgressPercent} />
                ) : (
                  <CheckCircle2 className="gf-fill-icon-brand gf-text-fg-light" />
                )}
                <div className="gf-bg-background-surface-tertiary gf-rounded-md gf-py-1 gf-px-2 gf-flex gf-items-center gf-justify-between gf-w-full">
                  <div className="gf-flex gf-items-center gf-gap-2">
                    <FileHeart className="gf-text-icon-primary gf-size-4" />
                    <div className="gf-typo-small gf-text-fg-primary gf-font-medium">
                      {__('Campaigns', 'growfund')}
                    </div>
                  </div>
                  <div className="gf-typo-small gf-text-fg-subdued">
                    {campaignProgressPercent === 100
                      ? __('Completed', 'growfund')
                      : /* translators: 1: completed campaigns, 2: total campaigns */
                        sprintf(
                          __('%1$s of %2$s', 'growfund'),
                          campaignProgress?.completed ?? 0,
                          campaignProgress?.total ?? 0,
                        )}
                  </div>
                </div>
              </div>
              <div className="gf-flex gf-items-center gf-rounded-lg gf-py-2 gf-px-3 gf-bg-background-surface gf-border gf-border-border gf-gap-3">
                {pledgeProgressPercent < 100 ? (
                  <CircularProgress value={pledgeProgressPercent} />
                ) : (
                  <CheckCircle2 className="gf-fill-icon-brand gf-text-fg-light" />
                )}
                <div className="gf-bg-background-surface-tertiary gf-rounded-md gf-py-1 gf-px-2 gf-flex gf-items-center gf-justify-between gf-w-full">
                  <div className="gf-flex gf-items-center gf-gap-2">
                    <Receipt className="gf-text-icon-primary gf-size-4" />
                    <div className="gf-typo-small gf-text-fg-primary gf-font-medium">
                      {__('Pledges', 'growfund')}
                    </div>
                  </div>
                  <div className="gf-typo-small gf-text-fg-subdued">
                    {pledgeProgressPercent === 100
                      ? __('Completed', 'growfund')
                      : /* translators: 1: completed pledges, 2: total pledges */
                        sprintf(
                          __('%1$s of %2$s', 'growfund'),
                          pledgeProgress?.completed ?? 0,
                          pledgeProgress?.total ?? 0,
                        )}
                  </div>
                </div>
              </div>
            </div>
            <ScreenFooter className="gf-justify-center gf-right-0 gf-px-8">
              <div
                className={`gf-transition-all gf-duration-500 gf-ease-in-out gf-transform ${
                  openAlert
                    ? 'gf-opacity-100 translate-y-0'
                    : 'gf-opacity-0 gf-translate-y-4 gf-pointer-events-none'
                }`}
              >
                {openAlert && (
                  <Alert className="gf-border-l-0 gf-rounded-lg gf-bg-background-surface-tertiary">
                    <div className="gf-flex gf-items-center gf-gap-3 gf-text-fg-brand gf-font-medium gf-typo-tiny">
                      <SmileIcon />
                      {__(
                        'This is taking longer than usual, but don’t worry, your data is migrating just fine.',
                        'growfund',
                      )}
                    </div>
                  </Alert>
                )}
              </div>
            </ScreenFooter>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default MigrationProgress;
