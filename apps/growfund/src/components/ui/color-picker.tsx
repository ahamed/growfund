import { Cross2Icon } from '@radix-ui/react-icons';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  defaultValue?: string;
  color?: string;
  onChange: (color: string) => void;
  closePopover?: () => void;
}

const ColorPicker = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & ColorPickerProps
>(({ className, color, defaultValue, onChange, closePopover, ...props }, ref) => {
  return (
    <>
      <div
        ref={ref}
        className={cn(
          'gf-color-picker-layout gf-bg-background-surface gf-rounded-md gf-shadow-md',
          className,
        )}
        {...props}
      >
        <div className="gf-flex gf-justify-between gf-items-center gf-p-4">
          <span className="gf-typo-small gf-font-semibold">{__('Color Picker', 'growfund')}</span>
          <Button size="icon" variant="ghost" onClick={closePopover} className="gf-size-6">
            <Cross2Icon />
          </Button>
        </div>
        <Separator />
        <div className="gf-space-y-4 gf-p-4">
          <HexColorPicker color={color ?? defaultValue} onChange={onChange} />
          <HexColorInput
            className="gf-w-full gf-p-1 gf-border gf-border-border gf-rounded-sm focus-visible:gf-outline-none"
            prefixed
            color={color ?? defaultValue}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
});

export default ColorPicker;
