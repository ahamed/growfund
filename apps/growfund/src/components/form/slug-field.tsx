import { Cross2Icon } from '@radix-ui/react-icons';
import { sprintf } from '@wordpress/i18n';
import { Check, Edit3, Globe } from 'lucide-react';
import { useRef, useState } from 'react';
import { type FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { type ControllerField } from '@/types/form';
import { isDefined } from '@/utils';

interface SlugFieldProps<T extends FieldValues> extends ControllerField<T> {
  noErrorMessage?: boolean;
  autoFocusVisible?: boolean;
  permalinkUrl: string;
}

function SlugField<T extends FieldValues>({
  control,
  name,
  placeholder,
  description,
  disabled = false,
  readOnly = false,
  inline = false,
  className,
  noErrorMessage = false,
  autoFocusVisible = false,
  permalinkUrl,
  ...props
}: SlugFieldProps<T>) {
  const [isSlugEditing, setIsSlugEditing] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const slug = String(field.value ?? '');
        return (
          <FormItem
            className={cn(
              'gf-w-full',
              inline ? 'gf-flex gf-items-baseline gf-gap-4' : 'gf-space-y-2',
            )}
          >
            <div className="gf-space-y-2 gf-w-full">
              <FormControl>
                <div className="gf-flex gf-items-center gf-gap-1 gf-group/slug gf-min-h-[3.25rem]">
                  <Globe size={16} className="gf-text-icon-secondary" />
                  {isSlugEditing ? (
                    <>
                      <div className="gf-typo-tiny gf-text-fg-secondary">
                        {sprintf('%s/', permalinkUrl)}
                      </div>
                      <div className="gf-flex gf-items-center gf-gap-2">
                        <Input
                          {...field}
                          ref={ref}
                          placeholder={placeholder}
                          type="text"
                          value={newSlug}
                          readOnly={readOnly}
                          autoFocusVisible={autoFocusVisible}
                          onChange={(event) => {
                            setNewSlug(event.target.value);
                          }}
                          autoComplete="off"
                          disabled={disabled}
                          className={cn(
                            'gf-w-full gf-border-b-1 gf-border-b-icon-emphasis',
                            !!fieldState.error &&
                              'gf-border-b-border-critical gf-bg-background-fill-critical-secondary',
                            className,
                          )}
                          {...props}
                        />
                        <div className="gf-flex gf-items-center gf-gap-1">
                          <Button
                            variant="ghost"
                            className="gf-size-8 gf-rounded-md"
                            onClick={() => {
                              const finalValue = newSlug
                                .replace(/[ _/]/g, '-')
                                .replace(/-*@-*/g, '-at-');
                              field.onChange(finalValue);
                              setNewSlug('');
                              setIsSlugEditing(false);
                            }}
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            className="gf-size-8 gf-rounded-md"
                            onClick={() => {
                              field.onChange(slug);
                              setNewSlug('');
                              setIsSlugEditing(false);
                            }}
                          >
                            <Cross2Icon className="gf-size-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="gf-typo-tiny gf-text-fg-secondary gf-max-w-96 gf-truncate">
                        {sprintf('%s/%s', permalinkUrl, slug)}
                      </div>
                      <Button
                        variant="ghost"
                        className="gf-size-6 gf-px-2 gf-rounded-md group-hover/slug:gf-visible gf-invisible"
                        onClick={() => {
                          setNewSlug(slug);
                          setIsSlugEditing(true);
                        }}
                      >
                        <Edit3 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </FormControl>

              {isDefined(description) && <FormDescription>{description}</FormDescription>}
              {!noErrorMessage && <FormMessage />}
            </div>
          </FormItem>
        );
      }}
    />
  );
}

export { SlugField };
