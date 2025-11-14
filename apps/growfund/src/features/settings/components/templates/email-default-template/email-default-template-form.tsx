import { __ } from '@wordpress/i18n';
import { useFormContext } from 'react-hook-form';

import FeatureGuard from '@/components/feature-guard';
import { Container } from '@/components/layouts/container';
import EmailTemplateSettingsColorsFallback from '@/components/pro-fallbacks/settings/email-notifications/template-colors-fallback';
import {
  TemplateFormContentSection,
  TemplateFormImageSection,
} from '@/components/template-form/template-form';
import EmailDefaultContentForm from '@/features/settings/components/templates/email-default-template/email-default-content-form';
import {
  EmailAdditionalContent,
  EmailCard,
  EmailContent,
  EmailDefaultContent,
  EmailFooter,
  EmailHeader,
  EmailLogo,
  EmailMessage,
} from '@/features/settings/components/ui/email-preview';
import { type EmailTemplateForm } from '@/features/settings/schemas/email-default-template';
import { registry } from '@/lib/registry';

const EmailNotificationTemplateForm = () => {
  const form = useFormContext<EmailTemplateForm>();
  const emailTemplate = form.watch();

  const EmailTemplateSettingsColors = registry.get('EmailTemplateSettingsColors');

  return (
    <Container className="gf-mt-6">
      <div className="gf-grid gf-grid-cols-10 gf-gap-4">
        <div className="gf-col-span-4">
          <div className="gf-space-y-4">
            <TemplateFormImageSection
              namePrefix="media"
              control={form.control}
              header={__('Logo', 'growfund')}
              description={__('Update the logo & style your way', 'growfund')}
            />
            <FeatureGuard
              feature="settings.email_notifications.template.colors"
              fallback={<EmailTemplateSettingsColorsFallback />}
            >
              {EmailTemplateSettingsColors && <EmailTemplateSettingsColors />}
            </FeatureGuard>
            <TemplateFormContentSection
              header={__('Content', 'growfund')}
              description={__('Manage your email default contents.', 'growfund')}
            >
              <EmailDefaultContentForm />
            </TemplateFormContentSection>
          </div>
        </div>
        <div className="gf-col-span-6 gf-sticky gf-top-[calc(var(--gf-topbar-height)+var(--gf-spacing)_*_1.5)] gf-h-screen">
          <EmailCard emailTemplate={emailTemplate}>
            <EmailLogo />
            <EmailContent>
              <EmailHeader heading="Updated Campaign Status" />
              <EmailMessage>
                <p>{__('Dear Jhon!', 'growfund')}</p>
                <p>{__('The status of a campaign you supported has been updated.', 'growfund')}</p>
                <EmailDefaultContent className="gf-mt-4" />
              </EmailMessage>
              <EmailAdditionalContent />
            </EmailContent>
            <EmailFooter />
          </EmailCard>
        </div>
      </div>
    </Container>
  );
};

export default EmailNotificationTemplateForm;
