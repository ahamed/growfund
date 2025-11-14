import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface DonorInfoProps {
  currentDonor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    billing_address?: string;
    payment_method?: string;
    account_number?: string;
    verification_status?: string;
    image?: string;
  };
  wrapperClass?: string;
}

const DonorInfo = ({ currentDonor, wrapperClass }: DonorInfoProps) => {
  return (
    <div className={cn('gf-flex gf-gap-3 gf-items-center', wrapperClass)}>
      <Avatar>
        <AvatarImage src={currentDonor.image} />
      </Avatar>
      <div className="gf-typo-tiny gf-flex gf-flex-col gf-gap-1">
        <div className="gf-text-fg-primary gf-font-medium gf-max-w-96">{currentDonor.name}</div>
        <div className="gf-text-fg-secondary gf-max-w-96 gf-truncate" title={currentDonor.email}>
          {currentDonor.email}
        </div>
      </div>
    </div>
  );
};

export default DonorInfo;
