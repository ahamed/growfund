import { BrandWhiteIcon, BridgeIcon } from '@/app/icons';
import { Image } from '@/components/ui/image';
import StepNavigator from '@/features/migration/components/step-navigator';
import { useMigration } from '@/features/migration/contexts/migration-context';

const MigrationLayout = () => {
  const { step } = useMigration();
  return (
    <div className="gf-w-[100vw] gf-h-[100svh] gf-flex gf-items-center gf-justify-center gf-bg-[#406B52] gf-relative">
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
      {step === 'successful' && (
        <div className="gf-absolute gf-left-44 gf-bottom-0">
          <Image src="/images/party.webp" className="gf-size-96 gf-border-none gf-bg-transparent" />
        </div>
      )}
    </div>
  );
};

export default MigrationLayout;
