import { __ } from '@wordpress/i18n';
import { ArrowRight, Check } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { GiftPackIcon, GivingThanksIcon } from '@/app/icons';
import { LoadingSpinnerOverlay } from '@/components/layouts/loading-spinner';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { useAppConfig } from '@/contexts/app-config';
import { useMigration } from '@/features/migration/contexts/migration-context';
import { useWoocommerceConfigQuery } from '@/features/migration/services/migrate';
import DecisionBox from '@/features/onboarding/components/decision-box';
import {
  type CampaignMode,
  useOnboarding,
} from '@/features/onboarding/contexts/onboarding-context';
import {
  Screen,
  ScreenContent,
  ScreenDescription,
  ScreenFooter,
  ScreenIndicator,
  ScreenTitle,
} from '@/features/onboarding/layouts/screen';
import { useManageWordpressLayout } from '@/hooks/use-wp-layout';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const campaignModes: {
  mode: CampaignMode;
  title: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    mode: 'reward',
    title: __('Reward Based', 'growfund'),
    description: __('Fund projects by offering exclusive rewards & appreciation.', 'growfund'),
    icon: GiftPackIcon,
  },
  {
    mode: 'donation',
    title: __('Donation Based', 'growfund'),
    description: __('Raise funds for causes without offering tangible rewards.', 'growfund'),
    icon: GivingThanksIcon,
  },
];

function getImageSrc(mode: CampaignMode | null) {
  if (mode === 'reward') {
    return `/images/reward-mode.webp`;
  }

  if (mode === 'donation') {
    return `/images/donation-mode.webp`;
  }

  return `/images/mode-selection-empty.webp`;
}

const MigrationModeSelection = () => {
  const { isDonationMode } = useAppConfig();
  const { setStep } = useMigration();
  const { campaignMode, setCampaignMode, setPaymentMode, setBaseCountry, onComplete, setCurrency } =
    useOnboarding();
  const { showWordpressLayout } = useManageWordpressLayout();

  const woocommerceConfigQuery = useWoocommerceConfigQuery();

  const woocommerceConfig = useMemo(() => {
    if (!woocommerceConfigQuery.data) {
      return;
    }

    return woocommerceConfigQuery.data;
  }, [woocommerceConfigQuery.data]);

  useEffect(() => {
    if (isDefined(woocommerceConfig)) {
      setCampaignMode(isDonationMode ? 'donation' : 'reward');
      setPaymentMode('woo-commerce');
      setBaseCountry(woocommerceConfig.country);
      setCurrency(woocommerceConfig.currency);
    }
  }, [
    isDonationMode,
    setBaseCountry,
    setCampaignMode,
    setCurrency,
    setPaymentMode,
    woocommerceConfig,
  ]);

  if (woocommerceConfigQuery.isLoading || woocommerceConfigQuery.isPending) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <>
      <DecisionBox className="gf-flex gf-items-center gf-justify-center">
        <Image
          src={getImageSrc(campaignMode)}
          className="gf-size-full gf-border-none gf-max-h-[20.75rem]"
          fit="cover"
        />
      </DecisionBox>
      <DecisionBox>
        <Screen className="gf-space-y-5">
          <ScreenIndicator />
          <ScreenContent>
            <div className="gf-space-y-3">
              <ScreenTitle>{__('What will you use Growfund for?', 'growfund')}</ScreenTitle>
              <ScreenDescription>
                {__(
                  'Tell us about the type of campaign you plan to launch. We will streamline your experience accordingly.',
                  'growfund',
                )}
              </ScreenDescription>
            </div>
            <div className="gf-grid gf-grid-cols-2 gf-gap-4 gf-mt-7">
              {campaignModes.map((mode) => {
                const isActive = mode.mode === campaignMode;
                const Icon = mode.icon;
                return (
                  <Box
                    key={mode.mode}
                    className={cn(
                      'gf-shadow-none gf-border gf-cursor-pointer hover:gf-border-border-hover',
                      isActive && 'gf-border-border-brand gf-bg-[#EBFFF8]',
                    )}
                    onClick={() => {
                      setCampaignMode(mode.mode);
                    }}
                  >
                    <BoxContent className="gf-flex gf-flex-col gf-items-center gf-justify-center gf-gap-4 gf-relative gf-px-4 gf-py-4 gf-text-center">
                      <Icon className="gf-shrink-0 gf-size-[4.5rem]" />
                      <div className="gf-space-y-2">
                        <div className="gf-typo-tiny gf-font-medium gf-text-fg-primary">
                          {mode.title}
                        </div>
                        <p className="gf-typo-tiny gf-font-[11px] gf-text-fg-secondary">
                          {mode.description}
                        </p>
                      </div>

                      {isActive && (
                        <div className="gf-absolute gf-top-[-10px] gf-left-[-10px] gf-size-5 gf-bg-background-fill-brand gf-rounded-full gf-flex gf-items-center gf-justify-center">
                          <Check className="gf-size-3 gf-text-white" />
                        </div>
                      )}
                    </BoxContent>
                  </Box>
                );
              })}
            </div>
            <ScreenFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.reload();
                  window.history.back();
                  showWordpressLayout();
                }}
              >
                {__('Cancel', 'growfund')}{' '}
              </Button>
              <Button
                onClick={() => {
                  onComplete();
                  setStep('welcome');
                }}
                disabled={!isDefined(campaignMode)}
              >
                {__('Next', 'growfund')}
                <ArrowRight />
              </Button>
            </ScreenFooter>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default MigrationModeSelection;
