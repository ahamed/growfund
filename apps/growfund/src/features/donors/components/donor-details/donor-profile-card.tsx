import { __, sprintf } from '@wordpress/i18n';
import { format } from 'date-fns';
import { Baby, BadgeCheck, Mail, MapPin, Phone } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Box, BoxContent } from '@/components/ui/box';
import { type Donor } from '@/features/donors/schemas/donor';
import { DATE_FORMATS } from '@/lib/date';
import { createAcronym, displayAddress, isDefined } from '@/utils';

interface DonorProfileCardProps {
  donor: Donor;
}

const DonorProfileCard = ({ donor }: DonorProfileCardProps) => {
  const acronym = createAcronym({
    first_name: donor.first_name,
    last_name: donor.last_name,
  });
  return (
    <Box className="gf-border-none">
      <BoxContent className="gf-p-5 gf-h-full gf-flex gf-flex-col">
        <div className="gf-flex gf-items-center gf-gap-2">
          <Avatar className="gf-size-10 gf-rounded-full">
            <AvatarImage
              src={donor.image?.url}
              alt={sprintf('%s %s', donor.first_name, donor.last_name)}
            />
            <AvatarFallback>{acronym}</AvatarFallback>
          </Avatar>
          <div>
            <p className="gf-typo-tiny gf-text-fg-subdued">
              {/* translator: %s: Donor ID */}
              {sprintf(__('ID #%s', 'growfund'), donor.id)}
            </p>
            <p className="gf-typo-small gf-font-medium gf-text-fg-primary gf-break-all">
              {sprintf('%s %s', donor.first_name, donor.last_name)}
            </p>
          </div>
        </div>

        <div className="gf-mt-5 gf-space-y-4">
          <div className="gf-flex gf-items-start gf-gap-2">
            <Mail className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
            <div className="gf-grid gf-gap-2">
              <span className="gf-typo-small gf-font-medium gf-text-fg-primary">{donor.email}</span>
              {donor.is_verified ? (
                <Badge variant="primary">
                  <BadgeCheck className="gf-size-3 gf-text-icon-success" />
                  {__('Verified', 'growfund')}
                </Badge>
              ) : (
                <Badge variant="secondary">{__('Awaiting Verification', 'growfund')}</Badge>
              )}
            </div>
          </div>

          {isDefined(donor.phone) && (
            <div className="gf-flex gf-items-start gf-gap-2">
              <Phone className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
              <span className="gf-typo-small gf-font-medium gf-text-fg-primary">{donor.phone}</span>
            </div>
          )}

          {isDefined(donor.billing_address) && (
            <div className="gf-flex gf-items-start gf-gap-2">
              <MapPin className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
              <div className="gf-typo-small gf-font-medium gf-text-fg-primary gf-space-y-2">
                <p className="gf-text-fg-primary gf-font-medium">
                  {displayAddress(donor.billing_address)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="gf-flex gf-items-start gf-gap-2 gf-mt-auto">
          <Baby className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
          <p className="gf-text-fg-subdued gf-typo-tiny">
            {`${__('Joined', 'growfund')} ${format(donor.joined_at, DATE_FORMATS.HUMAN_READABLE)}`}
          </p>
        </div>
      </BoxContent>
    </Box>
  );
};

export default DonorProfileCard;
