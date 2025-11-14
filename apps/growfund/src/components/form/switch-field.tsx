import { Edit } from 'lucide-react';
import { type FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

type SwitchFieldProps<T extends FieldValues> = Omit<
  ControllerField<T>,
  'readOnly' | 'placeholder' | 'inline'
> & {
  allowEdit?: boolean;
  onEdit?: () => void;
  allowHoverEffect?: boolean;
  hideToggle?: boolean;
};

function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
  allowEdit = false,
  onEdit,
  allowHoverEffect = false,
  hideToggle = false,
}: SwitchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn(
              'gf-w-full gf-flex gf-items-center gf-justify-between gf-gap-4 gf-group/switch',
              allowHoverEffect && 'hover:gf-bg-background-surface-secondary gf-rounded-lg gf-p-2',
            )}
          >
            <div className="gf-space-y-2">
              {isDefined(label) && <FormLabel className="gf-flex-shrink-0">{label}</FormLabel>}
              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>
            <div className="gf-flex gf-items-center gf-gap-2">
              {allowEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className={cn(
                    allowHoverEffect &&
                      'gf-opacity-0 gf-transition-opacity group-hover/switch:gf-opacity-100',
                  )}
                >
                  <Edit className="gf-text-icon-primary" />
                </Button>
              )}
              {!hideToggle && (
                <FormControl>
                  <Switch
                    {...field}
                    disabled={disabled}
                    className={className}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
              )}
            </div>
          </FormItem>
        );
      }}
    ></FormField>
  );
}

export { SwitchField };
