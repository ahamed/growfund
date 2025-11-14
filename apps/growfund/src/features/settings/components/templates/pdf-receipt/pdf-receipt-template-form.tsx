import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import FeatureGuard from '@/components/feature-guard';
import { Container } from '@/components/layouts/container';
import PdfReceiptSettingsColorsFallback from '@/components/pro-fallbacks/settings/pdf-receipt/colors-fallback';
import {
  TemplateFormContentSection,
  TemplateFormImageSection,
} from '@/components/template-form/template-form';
import PdfAnnualReceiptContentForm from '@/features/settings/components/templates/pdf-receipt/pdf-annual-receipt-content-form';
import PdfAnnualReceiptPreview from '@/features/settings/components/templates/pdf-receipt/pdf-annual-receipt-preview';
import PdfReceiptContentForm from '@/features/settings/components/templates/pdf-receipt/pdf-receipt-content-form';
import PdfReceiptPreview from '@/features/settings/components/templates/pdf-receipt/pdf-receipt-preview';
import {
  type PdfReceiptTemplate,
  type PdfReceiptTemplateForm,
} from '@/features/settings/schemas/pdf-receipt';
import { registry } from '@/lib/registry';
import { isDefined } from '@/utils';

const PdfReceiptTemplateForm = ({
  pdfReceiptTemplate,
  isAnnualReceiptTemplate = false,
}: {
  pdfReceiptTemplate?: PdfReceiptTemplate | null;
  isAnnualReceiptTemplate?: boolean;
}) => {
  const form = useFormContext<PdfReceiptTemplateForm>();

  useEffect(() => {
    if (isDefined(pdfReceiptTemplate) && Object.keys(pdfReceiptTemplate).length !== 0) {
      form.reset.call(null, pdfReceiptTemplate);
    }
  }, [pdfReceiptTemplate, form.reset]);

  const values = form.watch();

  const PdfReceiptSettingsColors = registry.get('PdfReceiptSettingsColors');

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
              feature="settings.pdf_receipt.colors"
              fallback={<PdfReceiptSettingsColorsFallback />}
            >
              {PdfReceiptSettingsColors && <PdfReceiptSettingsColors />}
            </FeatureGuard>
            <TemplateFormContentSection
              header={__('Contents', 'growfund')}
              description={__('Manage the pdf contents from here', 'growfund')}
            >
              {isAnnualReceiptTemplate ? (
                <PdfAnnualReceiptContentForm shortCodes={pdfReceiptTemplate?.short_codes} />
              ) : (
                <PdfReceiptContentForm shortCodes={pdfReceiptTemplate?.short_codes} />
              )}
            </TemplateFormContentSection>
          </div>
        </div>
        <div className="gf-col-span-6">
          <div className="gf-sticky gf-top-[calc(var(--gf-topbar-height)+var(--gf-spacing)_*_1.5)] gf-h-[calc(100vh+var(--gf-topbar-height)+var(--gf-spacing)_*_1.5]">
            {isAnnualReceiptTemplate ? (
              <PdfAnnualReceiptPreview pdfReceipt={values} />
            ) : (
              <PdfReceiptPreview pdfReceipt={values} />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PdfReceiptTemplateForm;
