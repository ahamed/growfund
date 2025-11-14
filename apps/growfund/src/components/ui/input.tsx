import { Search } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    autoFocusVisible?: boolean;
    prefixText?: string;
    postfixText?: string;
    rootClassName?: string;
  }
>(
  (
    { className, rootClassName, type, autoFocusVisible = false, prefixText, postfixText, ...props },
    ref,
  ) => {
    React.useEffect(() => {
      if (autoFocusVisible && ref && typeof ref !== 'function') {
        ref.current?.focus();
      }
    }, [autoFocusVisible, ref]);

    return (
      <div className={cn('gf-relative gf-w-full', rootClassName)}>
        <input
          type={type}
          className={cn(
            'gf-flex gf-min-h-9 gf-w-full gf-rounded-md gf-ring-offset-2 gf-border gf-border-border gf-px-3 gf-typo-small gf-transition-colors gf-bg-background-surface placeholder:gf-text-fg-subdued disabled:gf-cursor-not-allowed disabled:gf-opacity-50',
            'file:gf-border-0 file:gf-leading-[1.7] file:gf-bg-transparent file:gf-font-bold file:gf-text-fg-primary',
            'focus-visible:gf-outline-none focus-visible:gf-ring-2 focus-visible:gf-ring-ring',
            type === 'search' && 'gf-ps-8',
            isDefined(prefixText) && 'gf-ps-8',
            type === 'search' && isDefined(prefixText) && 'gf-ps-12',
            isDefined(postfixText) && 'gf-pe-3',
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === 'search' && (
          <Search className="gf-w-4 gf-h-4 gf-text-icon-secondary gf-absolute gf-top-[50%] gf-left-3 gf-translate-y-[-50%]" />
        )}
        {prefixText && (
          <div
            className={cn(
              'gf-absolute gf-text-subdued gf-left-3 gf-top-[50%] gf-translate-y-[-50%]',
              type === 'search' && 'gf-left-8',
            )}
          >
            {prefixText}
          </div>
        )}
        {postfixText && (
          <div className=" gf-absolute gf-text-subdued gf-right-2 gf-top-[50%] gf-translate-y-[-50%]">
            {postfixText}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
