import { __, sprintf } from '@wordpress/i18n';
import { format } from 'date-fns';
import { Baby, BadgeCheck, Edit3, Mail, MapPin, Phone, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { type Backer } from '@/features/backers/schemas/backer';
import { type Donor } from '@/features/donors/schemas/donor';
import { DATE_FORMATS } from '@/lib/date';
import { type Address } from '@/schemas/address';
import { createAcronym, displayAddress, isDefined } from '@/utils';
import { User as CurrentUser } from '@/utils/user';

interface UserCardProps<T extends Backer | Donor> {
  user?: T;
  title?: string;
  onRemove?: () => void;
  onEdit?: () => void;
}

const UserPreviewCard = <T extends Backer | Donor>({
  user,
  title,
  onRemove,
  onEdit,
}: UserCardProps<T>) => {
  if (!user) {
    return null;
  }

  const acronym = createAcronym(user);

  return (
    <Box className="gf-group/user-card gf-h-fit">
      <BoxContent className="gf-space-y-3">
        <div className="gf-flex gf-items-center gf-justify-between">
          <h6 className="gf-typo-h6 gf-font-medium gf-text-fg-primary">
            {title ?? __('User', 'growfund')}
          </h6>
          <div className="gf-opacity-0 group-hover/user-card:gf-opacity-100 gf-transition-opacity">
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:gf-text-icon-critical"
                onClick={onRemove}
              >
                <Trash2 />
              </Button>
            )}

            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="gf-size-8 gf-text-icon-primary"
                onClick={onEdit}
              >
                <Edit3 />
              </Button>
            )}
          </div>
        </div>
        <div className="gf-space-y-5">
          <div className="gf-flex gf-gap-3 gf-items-center">
            <Avatar className="gf-size-10">
              <AvatarImage src={user.image?.url ?? undefined} />
              <AvatarFallback>{acronym}</AvatarFallback>
            </Avatar>

            <div className="gf-flex gf-flex-col gf-gap-1">
              <span className="gf-text-fg-subdued gf-typo-tiny">
                {/* translators: %s: user ID */}
                {sprintf(__('ID #%s', 'growfund'), user.id)}
              </span>
              <span className="gf-text-fg-secondary gf-typo-small gf-font-medium gf-break-all gf-line-clamp-2">
                {sprintf('%s %s', user.first_name, user.last_name)}
              </span>
            </div>
          </div>
          <div className="gf-space-y-3">
            <div className="gf-grid gf-grid-cols-[1rem_auto] gf-gap-2">
              <Mail className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0 gf-mt-[0.125rem]" />
              <div className="gf-space-y-2">
                <div className="gf-text-fg-secondary gf-typo-small gf-font-medium">
                  {user.email}
                </div>
                {user.is_verified ? (
                  <Badge variant="primary">
                    <BadgeCheck className="gf-size-3 gf-text-icon-brand" />
                    {__('Verified', 'growfund')}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{__('Awaiting Verification', 'growfund')}</Badge>
                )}
              </div>
            </div>

            {isDefined(user.phone) && (
              <div className="gf-flex gf-gap-2 gf-items-start">
                <Phone className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
                <div className="gf-text-fg-secondary gf-font-medium gf-typo-small">
                  {user.phone}
                </div>
              </div>
            )}

            {('shipping_address' in user || 'billing_address' in user) &&
              (isDefined(user.billing_address) ||
                ('shipping_address' in user && isDefined(user.shipping_address))) && (
                <div className="gf-grid gf-grid-cols-[1rem_auto] gf-gap-2">
                  <MapPin className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0 gf-mt-1" />
                  <div className="gf-space-y-3">
                    {user.billing_address && (
                      <div className="gf-space-y-2">
                        <span className="gf-typo-tiny gf-text-fg-secondary">
                          {__('Billing Address', 'growfund')}
                        </span>
                        <div className="gf-text-fg-primary gf-font-medium gf-typo-small">
                          {displayAddress(user.billing_address as Address)}
                        </div>
                      </div>
                    )}
                    {CurrentUser.isBacker() &&
                      'shipping_address' in user &&
                      user.shipping_address && (
                        <div className="gf-space-y-2">
                          <span className="gf-typo-tiny gf-text-fg-secondary">
                            {__('Shipping Address', 'growfund')}
                          </span>
                          <div className="gf-text-fg-primary gf-font-medium gf-typo-small">
                            {displayAddress(user.shipping_address)}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

            {isDefined(user.joined_at) && (
              <div className="gf-flex gf-gap-2 gf-items-start">
                <Baby className="gf-size-4 gf-text-icon-secondary gf-flex-shrink-0" />
                <div className="gf-text-fg-secondary gf-font-medium gf-typo-tiny">
                  {sprintf(
                    /* translators: %s: joined date */
                    __('Joined %s', 'growfund'),
                    format(new Date(user.joined_at), DATE_FORMATS.HUMAN_READABLE),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default UserPreviewCard;
