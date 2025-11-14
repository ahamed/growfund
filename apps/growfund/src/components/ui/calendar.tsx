import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('gf-p-3', className)}
      classNames={{
        months: 'gf-flex gf-flex-col sm:gf-flex-row gf-space-y-4 sm:gf-space-x-4 sm:gf-space-y-0',
        month: 'gf-space-y-4',
        caption: 'gf-flex gf-justify-center gf-pt-1 gf-relative gf-items-center',
        caption_label: 'gf-typo-small gf-font-medium gf-shrink-0',
        nav: 'gf-absolute [&:has([name="previous-month"])]:gf-left-0 [&:has([name="next-month"])]:gf-right-0 gf-p-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'gf-size-7 gf-bg-transparent gf-p-0 gf-opacity-50 hover:gf-opacity-100',
        ),
        table: 'gf-w-full gf-border-collapse gf-space-y-1',
        head_row: 'gf-flex',
        head_cell: 'gf-text-fg-muted gf-rounded-md gf-w-8 gf-font-normal gf-text-[0.8rem]',
        row: 'gf-flex gf-w-full gf-mt-2',
        cell: cn(
          'gf-relative gf-p-0 gf-text-center gf-typo-small focus-within:gf-relative focus-within:gf-z-20 [&:has([aria-selected])]:gf-bg-accent [&:has([aria-selected].gf-day-outside)]:gf-bg-accent/50 [&:has([aria-selected].gf-day-range-end)]:gf-rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.gf-day-range-end)]:gf-rounded-r-md [&:has(>.gf-day-range-start)]:gf-rounded-l-md first:[&:has([aria-selected])]:gf-rounded-l-md last:[&:has([aria-selected])]:gf-rounded-r-md'
            : '[&:has([aria-selected])]:gf-rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'gf-h-8 gf-w-8 gf-p-0 gf-font-normal aria-selected:gf-opacity-100',
        ),
        day_range_start:
          'gf-day-range-start gf-bg-background-fill-brand gf-text-fg-light hover:gf-bg-background-fill-brand hover:gf-text-fg-light focus:gf-bg-background-fill-brand focus:gf-text-fg-light',
        day_range_end:
          'gf-day-range-end gf-bg-background-fill-brand gf-text-fg-light hover:gf-bg-background-fill-brand hover:gf-text-fg-light focus:gf-bg-background-fill-brand focus:gf-text-fg-light',
        day_range_middle: 'gf-day-range-middle gf-bg-background-fill-secondary gf-text-fg-primary',
        day_selected: `gf-bg-background-fill-brand gf-text-fg-light hover:gf-bg-background-fill-brand hover:gf-text-fg-light focus:gf-bg-background-fill-brand focus:gf-text-fg-light`,
        day_today: 'gf-bg-background-surface-secondary gf-text-fg-primary',
        day_outside:
          'gf-day-outside gf-text-fg-muted aria-selected:gf-bg-accent/50 aria-selected:gf-text-fg-muted',
        day_disabled: 'gf-text-fg-muted gf-opacity-50',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('gf-h-4 gf-w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('gf-h-4 gf-w-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
