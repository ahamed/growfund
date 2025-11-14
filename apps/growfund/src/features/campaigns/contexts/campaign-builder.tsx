/* eslint-disable react-refresh/only-export-components */
import { RocketIcon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import { DollarSignIcon, Flower, HeartHandshakeIcon } from 'lucide-react';
import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router';

import { SettingsWindowIcon } from '@/app/icons';
import { growfundConfig } from '@/config/growfund';
import { RouteConfig } from '@/config/route-config';
import { useAppConfig } from '@/contexts/app-config';
import { AppConfigKeys } from '@/features/settings/context/settings-context';
import { useCurrentPath } from '@/hooks/use-current-path';
import { useRouteParams } from '@/hooks/use-route-params';
import { noop } from '@/utils';

type CampaignBuilderStep = 'basic' | 'goal' | 'rewards' | 'additional' | 'settings';

interface CampaignBuilderContextTypes {
  campaignId: string | undefined;
  activeStep: CampaignBuilderStep;
  steps: {
    value: CampaignBuilderStep;
    label: string;
    icon: React.ReactNode;
  }[];
  navigateNextStep: () => void;
  navigatePreviousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  navigateToStep: (step: CampaignBuilderStep) => void;
  errorOn?: CampaignBuilderStep[];
  setErrorOn?: (step: CampaignBuilderStep[]) => void;
}

const CampaignBuilderContext = createContext<CampaignBuilderContextTypes>({
  campaignId: undefined,
  activeStep: 'basic',
  steps: [],
  navigateNextStep: noop,
  navigatePreviousStep: noop,
  isFirstStep: true,
  isLastStep: false,
  navigateToStep: noop,
  errorOn: [],
  setErrorOn: noop,
});

const useCampaignBuilderContext = () => useContext(CampaignBuilderContext);

const baseSteps: CampaignBuilderContextTypes['steps'] = [
  {
    value: 'basic',
    label: __('Basic', 'growfund'),
    icon: <RocketIcon className="!gf-size-5" />,
  },
  {
    value: 'goal',
    label: __('Goal', 'growfund'),
    icon: <DollarSignIcon className="!gf-size-5" />,
  },
  {
    value: 'rewards',
    label: __('Rewards', 'growfund'),
    icon: <HeartHandshakeIcon className="!gf-size-5" />,
  },
  {
    value: 'additional',
    label: __('Additional', 'growfund'),
    icon: <Flower className="!gf-size-5" />,
  },
  {
    value: 'settings',
    label: __('Options', 'growfund'),
    icon: <SettingsWindowIcon className="!gf-size-5" />,
  },
];

const CampaignBuilderContextProvider = ({ children }: PropsWithChildren) => {
  const currentStepRoute = useCurrentPath() as CampaignBuilderStep;
  const { appConfig } = useAppConfig();
  const { isDonationMode } = useAppConfig();

  const [errorOn, setErrorOn] = useState<CampaignBuilderStep[]>([]);

  const steps = useMemo(() => {
    return baseSteps.filter((step) => {
      if (!isDonationMode) {
        return step.value !== 'additional';
      }

      if (
        !growfundConfig.is_pro ||
        !appConfig[AppConfigKeys.Campaign] ||
        (!appConfig[AppConfigKeys.Campaign].allow_fund &&
          !appConfig[AppConfigKeys.Campaign].allow_tribute)
      ) {
        return step.value !== 'additional' && step.value !== 'rewards';
      }

      return step.value !== 'rewards';
    });
  }, [isDonationMode, appConfig]);

  const [activeStep, setActiveStep] = useState<CampaignBuilderStep>(() => {
    if (!steps.map((step) => step.value).includes(currentStepRoute)) {
      return 'basic';
    }
    return currentStepRoute;
  });

  const navigate = useNavigate();

  const navigateToStep = useCallback(
    (step: CampaignBuilderStep) => {
      setActiveStep(step);
      switch (step) {
        case 'basic':
          void navigate(RouteConfig.CampaignStepBasic.buildLink());
          break;
        case 'goal':
          void navigate(RouteConfig.CampaignStepGoal.buildLink());
          break;
        case 'rewards':
          void navigate(RouteConfig.CampaignStepRewards.buildLink());
          break;
        case 'additional':
          void navigate(RouteConfig.CampaignStepAdditional.buildLink());
          break;
        case 'settings':
          void navigate(RouteConfig.CampaignStepSettings.buildLink());
          break;
      }
    },
    [navigate],
  );

  const navigateNextStep = useCallback(() => {
    const totalSteps = steps.length;
    const currentStepIndex = steps.findIndex((step) => step.value === activeStep);
    const nextStepIndex = Math.min(totalSteps - 1, currentStepIndex + 1);
    navigateToStep(steps[nextStepIndex].value);
  }, [activeStep, navigateToStep, steps]);
  const { id: campaignId } = useRouteParams(RouteConfig.CampaignBuilder);

  const navigatePreviousStep = useCallback(() => {
    const currentStepIndex = steps.findIndex((step) => step.value === activeStep);
    const previousStepIndex = Math.max(0, currentStepIndex - 1);
    navigateToStep(steps[previousStepIndex].value);
  }, [activeStep, navigateToStep, steps]);

  const isFirstStep = useMemo(() => {
    return steps.findIndex((step) => step.value === activeStep) === 0;
  }, [activeStep, steps]);

  const isLastStep = useMemo(() => {
    return steps.findIndex((step) => step.value === activeStep) === steps.length - 1;
  }, [activeStep, steps]);

  // Remove the error indicator from the visited pages
  useEffect(() => {
    setErrorOn((previous) => previous.filter((step) => step !== activeStep));
  }, [activeStep]);

  const value = useMemo<CampaignBuilderContextTypes>(() => {
    return {
      activeStep,
      steps,
      navigateNextStep,
      navigatePreviousStep,
      isFirstStep,
      isLastStep,
      navigateToStep,
      errorOn,
      setErrorOn,
      campaignId,
    };
  }, [
    activeStep,
    isFirstStep,
    isLastStep,
    navigateNextStep,
    navigatePreviousStep,
    navigateToStep,
    steps,
    errorOn,
    setErrorOn,
    campaignId,
  ]);

  return <CampaignBuilderContext value={value}>{children}</CampaignBuilderContext>;
};

export { CampaignBuilderContextProvider, useCampaignBuilderContext, type CampaignBuilderStep };
