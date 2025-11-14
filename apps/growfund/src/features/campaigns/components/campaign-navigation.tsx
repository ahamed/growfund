import { Button } from '@/components/ui/button';
import { useCampaignBuilderContext } from '@/features/campaigns/contexts/campaign-builder';
import { cn } from '@/lib/utils';

const CampaignNavigation = () => {
  const { steps, activeStep, navigateToStep, errorOn } = useCampaignBuilderContext();

  return (
    <div className="gf-h-16 gf-flex gf-flex-1 gf-gap-4 gf-justify-center gf-items-center">
      {steps.map((step) => {
        return (
          <Button
            key={step.value}
            variant="ghost"
            className={cn(
              'hover:gf-bg-background-surface-subdued',
              step.value === activeStep && 'gf-bg-background-white gf-text-fg-brand',
            )}
            onClick={() => {
              navigateToStep(step.value);
            }}
          >
            <div className="gf-relative">
              {errorOn?.includes(step.value) && (
                <span className="gf-absolute gf-w-2 gf-h-2 gf-bg-background-fill-critical gf-rounded-full gf-top-[-2px] gf-left-[-2px] gf-animate-bounce" />
              )}
              {step.icon}
            </div>
            {step.label}
          </Button>
        );
      })}
    </div>
  );
};

export default CampaignNavigation;
