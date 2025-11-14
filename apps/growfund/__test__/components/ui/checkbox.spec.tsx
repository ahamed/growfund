import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox Component', () => {
  it('should render with default props', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass(
      'peer',
      'gf-h-4',
      'gf-w-4',
      'gf-shrink-0',
      'gf-rounded-sm',
      'gf-border',
      'gf-border-border',
    );
  });

  it('should render as checked when checked prop is true', () => {
    render(<Checkbox checked={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('should render as unchecked when checked prop is false', () => {
    render(<Checkbox checked={false} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('should render as indeterminate when checked prop is "indeterminate"', () => {
    render(<Checkbox checked="indeterminate" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');

    // Check for minus icon
    const minusIcon = checkbox.querySelector('svg');
    expect(minusIcon).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<Checkbox className="custom-checkbox" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  it('should render as disabled when disabled prop is true', () => {
    render(<Checkbox disabled={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:gf-cursor-not-allowed', 'disabled:gf-opacity-50');
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Checkbox onClick={handleClick} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleClick).toHaveBeenCalled();
  });

  it('should handle change events', () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleCheckedChange).toHaveBeenCalled();
  });

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Checkbox onFocus={handleFocus} onBlur={handleBlur} />);

    const checkbox = screen.getByRole('checkbox');

    fireEvent.focus(checkbox);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(checkbox);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn();
    render(<Checkbox onKeyDown={handleKeyDown} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should show check icon when checked', () => {
    render(<Checkbox checked={true} />);

    const checkbox = screen.getByRole('checkbox');
    const checkIcon = checkbox.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('should show minus icon when indeterminate', () => {
    render(<Checkbox checked="indeterminate" />);

    const checkbox = screen.getByRole('checkbox');
    const minusIcon = checkbox.querySelector('svg');
    expect(minusIcon).toBeInTheDocument();
  });

  it('should not show icon when unchecked', () => {
    render(<Checkbox checked={false} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Checkbox ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should handle controlled state changes', () => {
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => {
            setChecked(value === true);
          }}
        />
      );
    };

    render(<TestComponent />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should handle all HTML button attributes', () => {
    render(
      <Checkbox
        id="test-checkbox"
        value="test-value"
        aria-label="Test checkbox"
        aria-describedby="checkbox-description"
        data-testid="checkbox-test"
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(checkbox).toHaveAttribute('value', 'test-value');
    expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
    expect(checkbox).toHaveAttribute('aria-describedby', 'checkbox-description');
    expect(checkbox).toHaveAttribute('data-testid', 'checkbox-test');
  });

  it('should have proper focus styles', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'focus-visible:gf-outline-none',
      'focus-visible:gf-ring-2',
      'focus-visible:gf-ring-ring',
      'focus-visible:gf-ring-offset-2',
    );
  });

  it('should have proper checked state styles', () => {
    render(<Checkbox checked={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'data-[state=checked]:gf-bg-background-fill-brand',
      'data-[state=checked]:gf-border-border-brand',
      'data-[state=checked]:gf-text-fg-light',
    );
  });

  it('should have proper indeterminate state styles', () => {
    render(<Checkbox checked="indeterminate" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'data-[state=indeterminate]:gf-bg-background-fill-brand',
      'data-[state=indeterminate]:gf-border-border-brand',
      'data-[state=indeterminate]:gf-text-fg-light',
    );
  });

  it('should handle form integration', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should work with labels', () => {
    render(
      <div>
        <label htmlFor="test-checkbox">Test Label</label>
        <Checkbox id="test-checkbox" />
      </div>,
    );

    const label = screen.getByText('Test Label');
    const checkbox = screen.getByRole('checkbox');

    expect(label).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
  });
});
