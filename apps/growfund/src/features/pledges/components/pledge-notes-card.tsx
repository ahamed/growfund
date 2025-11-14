import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { TextareaField } from '@/components/form/textarea-field';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { isDefined } from '@/utils';

interface AddNotesProps {
  value?: string | null;
  onChange: (notes: string | null) => void;
}

const NotesSchema = z.object({
  notes: z.string().min(1, { message: __('Notes are required', 'growfund') }),
});

type NotesFormFields = z.infer<typeof NotesSchema>;

const PledgeNotesCard = ({ value, onChange }: AddNotesProps) => {
  const form = useForm<NotesFormFields>({
    resolver: zodResolver(NotesSchema),
    values: { notes: value ?? '' },
  });
  const [openForm, setOpenForm] = useState(false);
  const hasNoteContent = isDefined(value) && value.length > 0;
  const onSubmit = (values: NotesFormFields) => {
    onChange(values.notes);
    setOpenForm(false);
  };

  return (
    <Box className="gf-group/notes">
      <BoxContent>
        <Form {...form}>
          <div className="gf-flex gf-items-center gf-justify-between gf-min-h-9">
            <h6 className="gf-typo-h6 gf-font-medium gf-text-fg-primary">
              {__('Notes', 'growfund')}
            </h6>

            {hasNoteContent && !openForm && (
              <div className="gf-flex gf-items-center gf-opacity-0 group-hover/notes:gf-opacity-100 gf-transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:gf-text-icon-critical"
                  onClick={() => {
                    onChange(null);
                  }}
                >
                  <Trash2 />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setOpenForm(true);
                  }}
                >
                  <Edit3 />
                </Button>
              </div>
            )}
          </div>
          {hasNoteContent && !openForm && (
            <span className="gf-mt-3 gf-typo-small gf-font-medium gf-text-fg-secondary">
              {value}
            </span>
          )}

          {!hasNoteContent && !openForm && (
            <Button
              variant="secondary"
              onClick={() => {
                setOpenForm(true);
              }}
              className="gf-w-full"
            >
              <Plus />
              {__('Add Notes', 'growfund')}
            </Button>
          )}

          {openForm && (
            <div className="gf-flex-col gf-flex gf-gap-3 gf-mt-2">
              <TextareaField
                control={form.control}
                name="notes"
                placeholder={__('Add notes', 'growfund')}
                autoFocus
              />
              <div className="gf-flex gf-justify-end gf-gap-2">
                <Button
                  onClick={() => {
                    form.reset({ notes: value ?? '' });
                    setOpenForm(false);
                  }}
                  variant="outline"
                >
                  {__('Cancel', 'growfund')}
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit, (errors) => {
                    console.error(errors);
                  })}
                >
                  {__('Done', 'growfund')}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </BoxContent>
    </Box>
  );
};

export default PledgeNotesCard;
