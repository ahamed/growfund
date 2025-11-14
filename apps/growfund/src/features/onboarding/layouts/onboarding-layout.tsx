import { BrandWhiteIcon, BridgeIcon } from '@/app/icons';
import StepNavigator from '@/features/onboarding/components/step-navigator';
import { OnboardingProvider } from '@/features/onboarding/contexts/onboarding-context';

const OnboardingLayout = () => {
  return (
    <OnboardingProvider>
      <div className="gf-flex gf-flex-col gf-gap-5 gf-items-start">
        <BrandWhiteIcon className="gf-h-6 gf-ms-10" />
        <div className="gf-relative gf-h-full gf-flex gf-items-center gf-justify-center gf-w-[min(100vw,58.75rem)] gf-mx-10">
          <div className="gf-grid gf-grid-cols-[42.5532%_1fr] gf-gap-[2.625rem] gf-min-h-[min(28.25rem,90svh)] gf-w-full">
            <StepNavigator />
          </div>
          <div className="gf-absolute gf-top-[50%] gf-left-[42.5532%] gf-translate-y-[-50%]">
            <BridgeIcon />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
