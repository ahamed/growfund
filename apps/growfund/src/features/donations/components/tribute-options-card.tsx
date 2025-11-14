import { __, sprintf } from '@wordpress/i18n';
import { Edit3, Flower2, Mail, Mailbox, MapPin, Phone, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type TributeFields } from '@/features/donations/schemas/donation';
import { type DonationForm } from '@/features/donations/schemas/donation-form';
import { displayAddress, isDefined } from '@/utils';
interface TributeCardProps {
  tribute?: TributeFields;
  onRemove: () => void;
  onEdit: () => void;
}

const TributeCard = ({ onRemove, onEdit }: TributeCardProps) => {
  const form = useFormContext<DonationForm>();
  const tribute = form.getValues();
  const badges = tribute.tribute_notification_type
    ? {
        'send-post-mail': [
          {
            icon: Mailbox,
            label: __('Post Mail', 'growfund'),
          },
        ],
        'send-ecard': [
          {
            icon: Mail,
            label: __('eCard', 'growfund'),
          },
        ],
        'send-ecard-and-post-mail': [
          {
            icon: Mailbox,
            label: __('Post Mail', 'growfund'),
          },
          {
            icon: Mail,
            label: __('eCard', 'growfund'),
          },
        ],
      }[tribute.tribute_notification_type]
    : null;

  const fullAddress = displayAddress(tribute.tribute_notification_recipient_address);

  return (
    <>
      {isDefined(tribute) && (
        <div className="gf-group/tribute">
          <div className="gf-flex gf-items-center gf-justify-between gf-gap-2">
            <div className="gf-flex gf-items-center gf-gap-2">
              <Flower2 className="gf-size-5 gf-text-icon-primary" />
              <h6 className="gf-typo-h6 gf-font-medium gf-text-fg-primary">
                {__('Tribute', 'growfund')}
              </h6>
            </div>
            <div className="gf-opacity-0 group-hover/tribute:gf-opacity-100 gf-transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onRemove();
                }}
                className="hover:gf-text-icon-critical"
              >
                <Trash2 />
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit3 />
              </Button>
            </div>
          </div>
          <>
            <div className="gf-flex gf-flex-col gf-mb-2">
              <span className="gf-typo-tiny gf-text-fg-secondary">{tribute.tribute_type}</span>
              <span className="gf-font-medium gf-text-fg-special-3 gf-text-base">
                {sprintf('%s %s', tribute.tribute_salutation, tribute.tribute_to)}
              </span>
            </div>

            <div className="gf-mb-2">
              <span className="gf-typo-tiny gf-text-fg-secondary">
                {__('Notification Receives', 'growfund')}
              </span>
              <p className="gf-font-medium gf-text-base gf-text-fg-primary gf-flex gf-items-center gf-gap-1">
                {tribute.tribute_notification_recipient_name}
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
              <div className="gf-flex gf-gap-2">
                <Mail className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
                <div className="gf-flex gf-gap-2 gf-flex-col">
                  <span className="gf-text-fg-secondary gf-font-medium gf-typo-small">
                    {tribute.tribute_notification_recipient_email}
                  </span>
                </div>
              </div>
              <div className="gf-flex gf-gap-2 gf-items-center">
                <Phone className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
                <span className="gf-text-fg-secondary gf-font-medium gf-typo-small">
                  {tribute.tribute_notification_recipient_phone}
                </span>
              </div>
              {fullAddress && (
                <div className="gf-flex gf-gap-2">
                  <MapPin className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
                  <p className="gf-text-fg-secondary gf-font-medium gf-typo-small">{fullAddress}</p>
                </div>
              )}
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default TributeCard;
