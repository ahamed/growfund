import { __ } from '@wordpress/i18n';
import { type PropsWithChildren } from 'react';
import { type Control, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';

import AlignmentSelectorField from '@/components/form/alignment-selector-field';
import { ColorPickerField } from '@/components/form/color-picker-field';
import { MediaField } from '@/components/form/media-field';
import RangeSliderField from '@/components/form/range-slider-field';
import { Box, BoxContent, BoxTitle } from '@/components/ui/box';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';
import { MediaType } from '@/utils/media';

interface TemplateFormProps<TFields extends FieldValues>
  extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  ref: React.RefObject<HTMLFormElement | null>;
  form: UseFormReturn<TFields>;
}

const TemplateForm = <TFields extends FieldValues>({
  ref,
  className,
  form,
  children,
  ...props
}: TemplateFormProps<TFields>) => {
  return (
    <Form {...form}>
      <form ref={ref} className={cn(className)} {...props}>
        {children}
      </form>
    </Form>
  );
};

interface TemplateFormImageSectionProps<TValues extends FieldValues> {
  header: string;
  description?: string;
  control: Control<TValues>;
  namePrefix?: Path<TValues>;
  minRangeHeight?: number;
  maxRangeHeight?: number;
}
const TemplateFormImageSection = <TValues extends FieldValues>({
  header,
  description,
  control,
  namePrefix,
  minRangeHeight = 12,
  maxRangeHeight = 80,
}: TemplateFormImageSectionProps<TValues>) => {
  return (
    <Box className="gf-p-4">
      <BoxTitle>{header}</BoxTitle>
      {isDefined(description) && (
        <p className="gf-typo-small gf-text-fg-secondary gf-mt-1">{description}</p>
      )}
      <BoxContent className="gf-p-0 gf-mt-4 gf-space-y-6">
        <MediaField
          control={control}
          name={namePrefix ? (`${namePrefix}.image` as Path<TValues>) : ('image' as Path<TValues>)}
          uploadButtonLabel={__('Upload Image', 'growfund')}
          dropzoneLabel={__('Drag and drop, or upload image', 'growfund')}
          accept={[MediaType.IMAGES]}
        />
        <RangeSliderField
          control={control}
          name={
            namePrefix ? (`${namePrefix}.height` as Path<TValues>) : ('height' as Path<TValues>)
          }
          label="Height"
          min={minRangeHeight}
          max={maxRangeHeight}
        />
        <AlignmentSelectorField
          control={control}
          name={
            namePrefix ? (`${namePrefix}.position` as Path<TValues>) : ('position' as Path<TValues>)
          }
          label="Position"
        />
      </BoxContent>
    </Box>
  );
};

interface TemplateFormContentProps {
  header: string;
  description?: string;
  className?: string;
}
const TemplateFormContentSection = ({
  children,
  header,
  description,
  className,
}: PropsWithChildren<TemplateFormContentProps>) => {
  return (
    <Box className="gf-p-4">
      <BoxTitle>{header}</BoxTitle>
      {isDefined(description) && (
        <p className="gf-typo-small gf-text-fg-secondary gf-mt-1">{description}</p>
      )}
      <BoxContent className={cn('gf-p-0 gf-mt-4', className)}>{children}</BoxContent>
    </Box>
  );
};

interface TemplateFormColorSectionProps<TValues extends FieldValues> {
  header: string;
  description?: string;
  fields: {
    name: Path<TValues>;
    label: string;
  }[];
  control: Control<TValues>;
}
const TemplateFormColorSection = <TValues extends FieldValues>({
  fields,
  header,
  description,
  control,
}: TemplateFormColorSectionProps<TValues>) => {
  return (
    <Box className="gf-p-4">
      <BoxTitle>{header}</BoxTitle>
      {isDefined(description) && (
        <p className="gf-typo-small gf-text-fg-secondary gf-mt-1">{description}</p>
      )}
      <BoxContent className="gf-p-0 gf-mt-4 gf-space-y-4">
        {fields.map((field) => (
          <ColorPickerField
            key={field.name}
            control={control}
            name={field.name}
            label={field.label}
          />
        ))}
      </BoxContent>
    </Box>
  );
};

export {
  TemplateForm,
  TemplateFormColorSection,
  TemplateFormContentSection,
  TemplateFormImageSection,
};
