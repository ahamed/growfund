import { __ } from '@wordpress/i18n';
import { Link } from 'react-router';

import { BrandIcon } from '@/app/icons';
import placeholder from '@/assets/images/placeholder.svg';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import {
  EmailPreviewProvider,
  useEmailPreviewContext,
} from '@/features/settings/context/email-preview-context';
import { type EmailTemplate } from '@/features/settings/schemas/email-default-template';
import { cn } from '@/lib/utils';

const EmailCard = ({
  emailTemplate,
  children,
  className,
}: {
  emailTemplate?: EmailTemplate | null;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <EmailPreviewProvider emailTemplate={emailTemplate}>
      <Card
        className={className}
        style={{
          backgroundColor: emailTemplate?.colors?.background ?? '',
          color: emailTemplate?.colors?.text ?? '',
        }}
      >
        {children}
      </Card>
    </EmailPreviewProvider>
  );
};

const EmailContent = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <CardContent className={cn('gf-py-4 gf-px-16 gf-flex gf-flex-col gf-gap-5', className)}>
      {children}
    </CardContent>
  );
};

const EmailHeader = ({ className, heading }: { className?: string; heading: string }) => {
  const { emailTemplate } = useEmailPreviewContext();

  return (
    <CardTitle
      className={cn('gf-pt-6', className)}
      style={{ color: emailTemplate?.colors?.label ?? '' }}
    >
      {heading}
    </CardTitle>
  );
};

const EmailMessage = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const { emailTemplate } = useEmailPreviewContext();

  if (typeof children === 'string') {
    return (
      <CardDescription
        className={className}
        style={{
          color: emailTemplate?.colors?.text ?? '',
        }}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    );
  }

  return (
    <CardDescription
      className={className}
      style={{
        color: emailTemplate?.colors?.text ?? '',
      }}
    >
      {children}
    </CardDescription>
  );
};

const EmailAdditionalContent = ({ className }: { className?: string }) => {
  const { emailTemplate } = useEmailPreviewContext();

  return (
    <>
      {emailTemplate?.content?.additional && (
        <div
          className={cn('gf-mt-4', className)}
          dangerouslySetInnerHTML={{ __html: emailTemplate.content.additional }}
        ></div>
      )}
    </>
  );
};

const EmailLogo = () => {
  const { emailTemplate } = useEmailPreviewContext();

  return (
    <>
      <CardHeader className="gf-py-6 gf-px-16">
        {emailTemplate?.media?.image?.url ? (
          <div
            className="gf-flex gf-gap-2 gf-items-center"
            style={{
              justifyContent: emailTemplate.media.position,
            }}
          >
            <Image
              src={emailTemplate.media.image.url}
              alt="Logo"
              rounded="none"
              style={{
                height: emailTemplate.media.height ? `${emailTemplate.media.height}px` : '',
              }}
              className="gf-bg-transparent gf-border-none"
            />
          </div>
        ) : (
          <div className="gf-flex gf-gap-2 gf-items-center">
            <BrandIcon className="gf-h-5" />
          </div>
        )}
      </CardHeader>
      <Separator />
    </>
  );
};

const EmailFooter = () => {
  const { emailTemplate } = useEmailPreviewContext();
  const hasCustomFooter = !!emailTemplate?.content?.footer;

  return (
    <>
      <Separator />
      <CardFooter className="gf-py-6 gf-px-16 gf-justify-center">
        {hasCustomFooter ? (
          <div dangerouslySetInnerHTML={{ __html: emailTemplate.content?.footer ?? '' }} />
        ) : (
          <div className="gf-text-center gf-text-base">
            <div className="gf-mb-1 gf-text-fg-subdued gf-typo-tiny">
              {__('Add footer from default email template.', 'growfund')}
            </div>
          </div>
        )}
      </CardFooter>
    </>
  );
};

const EmailDefaultContent = ({ className }: { className?: string }) => {
  const { emailTemplate } = useEmailPreviewContext();

  return (
    <Card className={cn('gf-bg-background-surface-alt gf-rounded-lg', className)}>
      <CardContent
        className="gf-mt-2 gf-space-y-2"
        style={{ color: emailTemplate?.colors?.text ?? '' }}
      >
        <p className="gf-typo-small gf-font-bold">
          {__('February 24th, 2025 by', 'growfund')}{' '}
          <span className="gf-font-normal">Rick Horan</span>
        </p>
        <Image src={placeholder} alt="image" className="gf-h-[190px]" />
        <p className="gf-typo-small ">
          {__(
            'Once upon a time in a small town, there lived a brave little girl named Lily. At just eight years old, she faced the biggest challenge of her life: cancer. With her bright smile and unyielding spirit, she fought through countless treatments...',
            'growfund',
          )}
        </p>
        <EmailButton label={__('See Update', 'growfund')} />
      </CardContent>
    </Card>
  );
};

const EmailButton = ({ label, className }: { label: string; className?: string }) => {
  const { emailTemplate } = useEmailPreviewContext();

  return (
    <Button
      className={cn('gf-w-full', className)}
      variant="primary"
      style={{
        color: emailTemplate?.colors?.button ?? '',
        backgroundColor: emailTemplate?.colors?.button_background ?? '',
      }}
    >
      {label}
    </Button>
  );
};

const EmailLink = ({ to, text, className }: { to: string; text: string; className?: string }) => {
  const { emailTemplate } = useEmailPreviewContext();

  return (
    <Link to={to} className={className} style={{ color: emailTemplate?.colors?.link ?? '' }}>
      {text}
    </Link>
  );
};

export {
  EmailAdditionalContent,
  EmailButton,
  EmailCard,
  EmailContent,
  EmailDefaultContent,
  EmailFooter,
  EmailHeader,
  EmailLink,
  EmailLogo,
  EmailMessage,
};
