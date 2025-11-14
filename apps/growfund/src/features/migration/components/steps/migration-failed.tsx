import { __ } from '@wordpress/i18n';
import { Headphones } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Screen, ScreenContent } from '@/features/migration/layouts/screen';
import DecisionBox from '@/features/onboarding/components/decision-box';

const MigrationFailed = () => {
  return (
    <>
      <DecisionBox className="gf-p-3">
        <Image
          src="/images/migration-failed.webp"
          className="gf-size-full gf-border-none gf-bg-transparent"
          fit="cover"
        />
      </DecisionBox>
      <DecisionBox>
        <Screen className="gf-space-y-5">
          <ScreenContent className="gf-flex gf-flex-col gf-justify-center gf-items-center gf-gap-6">
            <div className="gf-flex gf-flex-col gf-justify-center gf-items-center gf-gap-2">
              <div className="gf-typo-h4 gf-text-fg-critical">
                {__('Migration Failed', 'growfund')}
              </div>
              <div className="gf-text-fg-subdued gf-typo-small gf-text-center">
                {__(
                  'We apologize, the migration was unsuccessful. Please contact support for assistance.',
                  'growfund',
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                window.location.href = 'https://growfund.com'; // @todo: replace with support page
              }}
            >
              <Headphones />
              {__('Contact Support', 'growfund')}
            </Button>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default MigrationFailed;
