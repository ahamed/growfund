import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Braces, Loader2Icon } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { useController, type FieldValues } from 'react-hook-form';

import ManageEditorShortCodes from '@/components/editor/manage-editor-shortcodes';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface TextFieldProps<T extends FieldValues> extends ControllerField<T> {
  type?: 'text' | 'password' | 'number' | 'search' | 'email' | 'file';
  noErrorMessage?: boolean;
  labelIcon?: React.ReactNode;
  autoFocusVisible?: boolean;
  shortCodes?: { label: string; value: string }[];
}

function TextField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  description,
  disabled = false,
  readOnly = false,
  inline = false,
  className,
  noErrorMessage = false,
  labelIcon,
  autoFocusVisible = false,
  loading = false,
  shortCodes,
  ...props
}: TextFieldProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const isPasswordField = type === 'password';
  const shortcodePopoverRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const [openShortcodes, setOpenShortcodes] = useState(false);
  const { field } = useController({ control: control, name: name });

  return (
    <>
      {isDefined(shortCodes) && shortCodes.length > 0 && (
        <ManageEditorShortCodes
          popoverRef={shortcodePopoverRef}
          open={openShortcodes}
          onOpenChange={(open) => {
            setOpenShortcodes(open);
            if (open) return;

            if (ref.current) {
              ref.current.focus();
            }
          }}
          allShortcodes={shortCodes}
          onSelect={(shortcode) => {
            if (!ref.current) return;

            const input = ref.current;
            const oldValue = input.value;
            const start = input.selectionStart ?? 0;
            const end = input.selectionEnd ?? 0;
            const newValue = `${oldValue.substring(0, start)}${shortcode}${oldValue.substring(
              end,
            )}`;
            field.onChange(newValue);

            setTimeout(() => {
              input.focus();
              const newCursorPos = start + shortcode.length;
              input.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
          }}
          popoverContainer={document.querySelector(`#${inputId}`)}
        />
      )}
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <FormItem
              className={cn(
                'gf-w-full',
                inline ? 'gf-flex gf-items-baseline gf-gap-4' : 'gf-space-y-2',
              )}
            >
              {(isDefined(label) || isDefined(shortCodes)) && (
                <div className="gf-flex gf-items-center gf-justify-between">
                  {isDefined(label) && (
                    <FormLabel className="gf-flex-shrink-0">
                      {label}
                      {loading && (
                        <Loader2Icon className="gf-size-3 gf-text-icon-secondary gf-animate-spin" />
                      )}
                      {isDefined(labelIcon) && labelIcon}
                    </FormLabel>
                  )}
                  {isDefined(shortCodes) && shortCodes.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setOpenShortcodes(true);
                      }}
                    >
                      <Braces className="gf-text-icon-primary" />
                    </Button>
                  )}
                </div>
              )}
              <div className="gf-space-y-2 gf-w-full">
                <div className="gf-relative">
                  <FormControl>
                    <Input
                      {...field}
                      id={inputId}
                      ref={ref}
                      placeholder={placeholder}
                      type={isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type}
                      value={String(field.value ?? '')}
                      readOnly={readOnly}
                      autoFocusVisible={autoFocusVisible}
                      onChange={(event) => {
                        if (type === 'number') {
                          if (!event.target.value) {
                            field.onChange(null);
                            return;
                          }
                          field.onChange(event.target.valueAsNumber);
                          return;
                        }
                        field.onChange(event.target.value);
                      }}
                      autoComplete="off"
                      disabled={disabled}
                      className={cn(
                        'gf-w-full',
                        !!fieldState.error &&
                          'gf-border-border-critical gf-bg-background-fill-critical-secondary',
                        className,
                      )}
                      onFocus={() => {
                        if (type === 'number') {
                          ref.current?.select();
                        }
                      }}
                      onWheel={(event) => {
                        if (type !== 'number') {
                          return;
                        }
                        event.currentTarget.blur();
                      }}
                      {...props}
                    />
                  </FormControl>
                  {isPasswordField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="gf-absolute gf-right-0 gf-top-0 gf-rounded-tl-none gf-rounded-bl-none"
                      onClick={() => {
                        setIsPasswordVisible((previous) => !previous);
                      }}
                    >
                      {isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </Button>
                  )}
                </div>

                {isDefined(description) && <FormDescription>{description}</FormDescription>}
                {!noErrorMessage && <FormMessage />}
              </div>
            </FormItem>
          );
        }}
      />
    </>
  );
}

export { TextField };
