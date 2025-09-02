import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('applies default variant="contained" and size="medium"', () => {
    render(<Button>Defaults</Button>);
    const btn = screen.getByRole('button', { name: 'Defaults' });
    expect(btn).toHaveClass('button', 'contained', 'medium');
  });

  test('applies variant prop', () => {
    render(
      <>
        <Button variant="text">Text</Button>
        <Button variant="outlined">Outlined</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Text' })).toHaveClass('text');
    expect(screen.getByRole('button', { name: 'Outlined' })).toHaveClass('outlined');
  });

  test('applies size prop', () => {
    render(
      <>
        <Button size="small">Small</Button>
        <Button size="large">Large</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Small' })).toHaveClass('small');
    expect(screen.getByRole('button', { name: 'Large' })).toHaveClass('large');
  });

  test('type defaults to "button"', () => {
    render(<Button>Default type</Button>);
    const btn = screen.getByRole('button', { name: 'Default type' });
    expect(btn).toHaveAttribute('type', 'button');
  });

  test('respects disabled prop', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Disabled' });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('merges className', () => {
    render(<Button className="extra">Classes</Button>);
    const btn = screen.getByRole('button', { name: 'Classes' });
    expect(btn).toHaveClass('button', 'contained', 'medium', 'extra');
  });

  test('forwards ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });
});
