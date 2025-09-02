import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders input with placeholder', () => {
    render(<TextField placeholder="type here" />);
    expect(screen.getByPlaceholderText('type here')).toBeInTheDocument();
  });

  it('renders standard variant with <label> linking to input', () => {
    render(<TextField label="Name" variant="standard" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.tagName.toLowerCase()).toBe('input');
    expect(input.id).toBeTruthy();
  });

  it('renders filled variant with <label>', () => {
    render(<TextField label="Company" variant="filled" />);
    const label = screen.getByText('Company');
    expect(label.tagName.toLowerCase()).toBe('label');
  });

  it('renders outlined with fieldset and legend containing label', () => {
    const { container } = render(<TextField label="Email" variant="outlined" />);
    const fieldset = container.querySelector('fieldset');
    const legend = container.querySelector('legend');
    expect(fieldset).toBeTruthy();
    expect(legend).toBeTruthy();
    expect(legend!.textContent).toContain('Email');
  });

  it('outlined without label still renders legend (span exists)', () => {
    const { container } = render(<TextField variant="outlined" />);
    const legend = container.querySelector('legend');
    expect(legend).toBeTruthy();
    const span = legend!.querySelector('span');
    expect(span).toBeTruthy();
  });

  it('applies error styles and aria-invalid', () => {
    const { container } = render(<TextField label="Email" error variant="outlined" />);
    const input = container.querySelector('input')!;
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const root = container.firstElementChild!;
    expect(root.className).toMatch(/error/);
  });

  it('disabled propagates to input and adds .disabled on root', async () => {
    const user = userEvent.setup();
    const { container } = render(<TextField label="Disabled" disabled variant="outlined" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toBeDisabled();

    await user.click(input);

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/disabled/);
  });

  it('respects native size prop (character width)', () => {
    const { container } = render(<TextField size={12} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toHaveAttribute('size', '12');
  });

  it('focuses when enabled', async () => {
    const user = userEvent.setup();
    render(<TextField placeholder="focus me" />);
    const input = screen.getByPlaceholderText('focus me') as HTMLInputElement;
    await user.click(input);
    expect(document.activeElement).toBe(input);
  });

  it('uses provided id and links label (standard/filled)', () => {
    render(<TextField id="my-id" label="Username" variant="standard" />);
    const input = screen.getByLabelText('Username') as HTMLInputElement;
    expect(input.id).toBe('my-id');
  });
});
