import { __ } from '@wordpress/i18n';
import { useFormContext } from 'react-hook-form';

import { Container } from '@/components/layouts/container';
import {
  TemplateFormColorSection,
  TemplateFormContentSection,
  TemplateFormImageSection,
} from '@/components/template-form/template-form';
import ECardContentForm from '@/features/settings/components/templates/campaign-ecard/ecard-content-form';
import EcardPreview from '@/features/settings/components/templates/campaign-ecard/ecard-preview';
import { type EcardTemplateForm } from '@/features/settings/schemas/ecard';

const EcardTemplateForm = ({ shortCodes }: { shortCodes?: { value: string; label: string }[] }) => {
  const form = useFormContext<EcardTemplateForm>();

  return (
    <Container className="gf-mt-6">
      <div className="gf-flex gf-justify-center gf-gap-6">
        <div className="gf-flex-col">
          <div className="gf-w-[29rem] gf-space-y-4">
            <TemplateFormImageSection
              namePrefix="media"
              control={form.control}
              header={__('eCard Image', 'growfund')}
              minRangeHeight={12}
              maxRangeHeight={480}
            />
            <TemplateFormContentSection
              header={__('Contents', 'growfund')}
              description={__('Manage the pdf contents from here', 'growfund')}
            >
              <ECardContentForm shortCodes={shortCodes} />
            </TemplateFormContentSection>
            <TemplateFormColorSection
              control={form.control}
              fields={[
                {
                  name: 'colors.background',
                  label: __('Background', 'growfund'),
                },
                {
                  name: 'colors.greetings',
                  label: __('Greetings', 'growfund'),
                },
                {
                  name: 'colors.text_color',
                  label: __('Text Color', 'growfund'),
                },
                {
                  name: 'colors.secondary_text_color',
                  label: __('Secondary Text Color', 'growfund'),
                },
              ]}
              header={__('Colors', 'growfund')}
              description={__('Style how the emails look like', 'growfund')}
            />
          </div>
        </div>
        <div className="gf-flex-col gf-sticky gf-top-[calc(var(--gf-topbar-height)+var(--gf-spacing)_*_1.5)] gf-h-full">
          <EcardPreview />
        </div>
      </div>
    </Container>
  );
};

export default EcardTemplateForm;
