import { __, sprintf } from '@wordpress/i18n';
import { Flower2, Mail, Mailbox, MapPin, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { isDefined } from '@/utils';

interface Address {
  address?: string | null;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
}

interface Donation {
  tribute_type?: string | null;
  tribute_salutation?: string | null;
  tribute_to?: string | null;
  tribute_notification_type?: 'send-post-mail' | 'send-ecard' | 'send-ecard-and-post-mail' | null;
  tribute_notification_recipient_name?: string | null;
  tribute_notification_recipient_email?: string | null;
  tribute_notification_recipient_phone?: string | null;
  tribute_notification_recipient_address?: Address | null;
}

const DonationTributeCard = ({ donation }: { donation: Donation }) => {
  const badges = donation.tribute_notification_type
    ? {
        'send-post-mail': [{ icon: Mailbox, label: __('Post Mail', 'growfund') }],
        'send-ecard': [{ icon: Mail, label: __('eCard', 'growfund') }],
        'send-ecard-and-post-mail': [
          { icon: Mailbox, label: __('Post Mail', 'growfund') },
          { icon: Mail, label: __('eCard', 'growfund') },
        ],
      }[donation.tribute_notification_type]
    : null;

  const fullAddress = [
    donation.tribute_notification_recipient_address?.address,
    donation.tribute_notification_recipient_address?.address_2,
    donation.tribute_notification_recipient_address?.city,
    donation.tribute_notification_recipient_address?.state,
    donation.tribute_notification_recipient_address?.zip_code,
    donation.tribute_notification_recipient_address?.country,
  ]
    .filter(isDefined)
    .join(', ');

  return (
    isDefined(donation.tribute_to) && (
      <div className="gf-group/tribute">
        <div className="gf-flex gf-items-center gf-gap-2 gf-mb-3">
          <Flower2 className="gf-size-5 gf-text-icon-primary" />
          <h6 className="gf-typo-h6 gf-font-medium gf-text-fg-primary">
            {__('Tribute', 'growfund')}
          </h6>
        </div>

        <div className="gf-flex gf-flex-col gf-mb-2">
          <span className="gf-typo-tiny gf-text-fg-secondary">{donation.tribute_type}</span>
          <span className="gf-font-medium gf-text-fg-special-3 gf-text-base">
            {sprintf('%s %s', donation.tribute_salutation, donation.tribute_to)}
          </span>
        </div>

        <div className="gf-mb-2">
          <span className="gf-typo-tiny gf-text-fg-secondary">
            {__('Notification Receives', 'growfund')}
          </span>
          <p className="gf-font-medium gf-text-base gf-text-fg-primary gf-flex gf-items-center gf-gap-1">
            {donation.tribute_notification_recipient_name}
            <span className="gf-typo-tiny gf-text-fg-subdued gf-pt-[6px]">
              {__('via', 'growfund')}
            </span>
          </p>
        </div>

        <div className="gf-flex gf-gap-2">
          {badges?.map(({ icon: Icon, label }) => (
            <Badge
              key={label}
              variant="secondary"
              className="gf-w-full gf-h-8 gf-flex gf-justify-center"
            >
              <Icon className="gf-size-4 gf-text-icon-primary gf-flex-shrink-0" />
              {label}
            </Badge>
          ))}
        </div>

        <div className="gf-flex gf-flex-col gf-gap-3 gf-mt-5">
          {donation.tribute_notification_recipient_email && (
            <div className="gf-flex gf-gap-2">
              <Mail className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
              <div className="gf-flex gf-gap-2 gf-flex-col">
                <span className="gf-text-fg-secondary gf-font-medium gf-typo-small">
                  {donation.tribute_notification_recipient_email}
                </span>
              </div>
            </div>
          )}

          {donation.tribute_notification_recipient_phone && (
            <div className="gf-flex gf-gap-2 gf-items-center">
              <Phone className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
              <span className="gf-text-fg-secondary gf-font-medium gf-typo-small">
                {donation.tribute_notification_recipient_phone}
              </span>
            </div>
          )}

          {fullAddress && (
            <div className="gf-flex gf-gap-2">
              <MapPin className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
              <p className="gf-text-fg-secondary gf-font-medium gf-typo-small">{fullAddress}</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default DonationTributeCard;
