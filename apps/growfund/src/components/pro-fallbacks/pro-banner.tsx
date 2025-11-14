import { ProButton } from '@/components/ui/pro-button';
import { cn } from '@/lib/utils';

const ProBanner = ({ title, description, className }: { title: string; description?: string, className?: string }) => {
  return (
    <div
      className={cn(
        'gf-bg-background-surface-alt gf-w-full gf-max-w-[34rem] gf-flex gf-flex-col gf-items-center gf-justify-center gf-gap-6 gf-rounded-lg gf-p-8 gf-shadow-sm',
        className,
      )}
    >
      <div className="gf-flex gf-flex-col gf-gap-2">
        <h4 className="gf-typo-h4 gf-text-fg-primary gf-text-center">{title}</h4>
        {description && (
          <div className="gf-typo-small gf-text-fg-secondary gf-text-center">{description}</div>
        )}
      </div>
      <ProButton />
    </div>
  );
};

export default ProBanner;
