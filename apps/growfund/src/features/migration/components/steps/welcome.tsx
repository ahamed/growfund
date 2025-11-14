import { __ } from '@wordpress/i18n';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { CheckboxField } from '@/components/form/checkbox-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { OptionKeys } from '@/constants/option-keys';
import { useMigration } from '@/features/migration/contexts/migration-context';
import {
  Screen,
  ScreenContent,
  ScreenDescription,
  ScreenFooter,
  ScreenTitle,
} from '@/features/migration/layouts/screen';
import DecisionBox from '@/features/onboarding/components/decision-box';
import { useStoreOptionMutation } from '@/services/app-config';

const Welcome = () => {
  const { setStep, setStart, isCheckedMigrationConsent } = useMigration();
  const storeOptionMutation = useStoreOptionMutation();

  const form = useForm<{ checked_migration_consent: boolean }>({
    defaultValues: {
      checked_migration_consent: isCheckedMigrationConsent,
    },
  });

  const checkedMigrationConsent = useWatch({
    control: form.control,
    name: 'checked_migration_consent',
  });

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
          <ScreenContent className="gf-space-y-5">
            <Form {...form}>
              <Image src="/images/migration-banner.webp" fit="cover" />
              <div className="gf-space-y-3">
                <ScreenTitle>{__('Migrate to Growfund?', 'growfund')}</ScreenTitle>
                <ScreenDescription>
                  {__(
                    'Switching from WP Crowdfunding to Growfund is a fantastic choice! Just a friendly reminder to back up your data before migrating.',
                    'growfund',
                  )}
                </ScreenDescription>
                <div>
                  <CheckboxField
                    control={form.control}
                    name="checked_migration_consent"
                    label={__(
                      `I confirm that I've backed up all data before migrating`,
                      'growfund',
                    )}
                  />
                </div>
              </div>
              <ScreenFooter>
                <div className="gf-flex gf-items-center gf-gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep('mode-selection');
                    }}
                  >
                    <ArrowLeft />
                    {__('Back', 'growfund')}
                  </Button>
                  <Button
                    onClick={() => {
                      storeOptionMutation.mutate(
                        {
                          key: OptionKeys.CHECKED_MIGRATION_CONSENT,
                          data: checkedMigrationConsent,
                        },
                        {
                          onSuccess() {
                            setStep('progress');
                            setStart(true);
                          },
                        },
                      );
                    }}
                    disabled={!checkedMigrationConsent}
                  >
                    {__('Migrate Now', 'growfund')}
                    <ArrowRight />
                  </Button>
                </div>
              </ScreenFooter>
            </Form>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default Welcome;
