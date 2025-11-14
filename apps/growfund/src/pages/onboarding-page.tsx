import { useEffect } from 'react';

import OnboardingLayout from '@/features/onboarding/layouts/onboarding-layout';
import { useManageWordpressLayout } from '@/hooks/use-wp-layout';

const OnboardingPage = () => {
  const { hideWordpressLayout } = useManageWordpressLayout();
  useEffect(() => {
    hideWordpressLayout();
  }, [hideWordpressLayout]);
  return (
    <div className="gf-w-[100vw] gf-h-[100svh] gf-flex gf-items-center gf-justify-center gf-bg-[#406B52]">
      <OnboardingLayout />
    </div>
  );
};

export default OnboardingPage;
