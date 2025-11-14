import { __ } from '@wordpress/i18n';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import DecisionBox from '@/features/onboarding/components/decision-box';
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context';
import {
  Screen,
  ScreenContent,
  ScreenDescription,
  ScreenFooter,
  ScreenIndicator,
  ScreenTitle,
} from '@/features/onboarding/layouts/screen';

const Welcome = () => {
  const { setStep } = useOnboarding();

  return (
    <>
      <DecisionBox className="gf-p-0">
        <Image
          src="/images/welcome.webp"
          fit="cover"
          className="gf-border-none gf-bg-transparent gf-size-full"
        />
      </DecisionBox>
      <DecisionBox>
        <Screen className="gf-space-y-5">
          <ScreenIndicator />
          <ScreenContent className="gf-space-y-5">
            <Image src="/images/version-banner.webp" fit="cover" />
            <div className="gf-space-y-3">
              <ScreenTitle>{__('Welcome to Growfund!', 'growfund')}</ScreenTitle>
              <ScreenDescription>
                {__(
                  `We're so glad you're here! Whether you're launching a passion project or supporting a community cause, you're part of a movement that turns purpose into progress.`,
                  'growfund',
                )}
              </ScreenDescription>
            </div>
            <ScreenFooter>
              <Button
                onClick={() => {
                  setStep('mode-selection');
                }}
              >
                {__('Continue', 'growfund')}
                <ArrowRight />
              </Button>
            </ScreenFooter>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default Welcome;
