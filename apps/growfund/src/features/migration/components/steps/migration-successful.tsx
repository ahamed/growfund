import { __ } from '@wordpress/i18n';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Screen, ScreenContent } from '@/features/migration/layouts/screen';
import DecisionBox from '@/features/onboarding/components/decision-box';
import { useManageWordpressLayout } from '@/hooks/use-wp-layout';

const MigrationSuccessful = () => {
  const { showWordpressLayout } = useManageWordpressLayout();
  const navigate = useNavigate();
  return (
    <>
      <DecisionBox className="gf-p-3">
        <Image
          src="/images/successful-migration.webp"
          className="gf-size-full gf-border-none gf-bg-transparent"
          fit="cover"
        />
      </DecisionBox>
      <DecisionBox>
        <Screen className="gf-space-y-5">
          <ScreenContent className="gf-flex gf-flex-col gf-justify-center gf-items-center gf-gap-6">
            <div className="gf-flex gf-flex-col gf-justify-center gf-items-center gf-gap-2">
              <div className="gf-typo-h4 gf-text-fg-primary">
                {__('Successfully Migrated!', 'growfund')}
              </div>
              <div className="gf-text-fg-secondary gf-typo-small gf-text-center">
                {__(
                  "Hooray! Your data is safe and sound. Let's dive into Growfund and make some magic happen!",
                  'growfund',
                )}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={(event) => {
                event.preventDefault();
                showWordpressLayout();
                void navigate('/');
              }}
            >
              {__("Let's go", 'growfund')}
              <ArrowRight />
            </Button>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default MigrationSuccessful;
