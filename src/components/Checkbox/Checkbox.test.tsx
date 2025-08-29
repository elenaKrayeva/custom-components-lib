import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  test('renders unchecked by default', () => {
    render(<Checkbox />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;
    expect(cb).not.toBeChecked();
  });

  test('respects defaultChecked (uncontrolled)', () => {
    render(<Checkbox defaultChecked />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;
    expect(cb).toBeChecked();
  });

  test('toggles in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;

    expect(cb).not.toBeChecked();
    await user.click(cb);
    expect(cb).toBeChecked();
    await user.click(cb);
    expect(cb).not.toBeChecked();
  });

  test('calls onChange with next state', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Checkbox onChange={onChange} />);
    const cb = screen.getByRole('checkbox');

    await user.click(cb);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0].target as HTMLInputElement).checked).toBe(true);
  });

  test('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Checkbox disabled onChange={onChange} />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;

    expect(cb).toBeDisabled();
    await user.click(cb);
    expect(cb).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders label and toggles on label click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept terms" />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;
    const label = screen.getByText('Accept terms');

    await user.click(label);
    expect(cb).toBeChecked();
  });

  test('indeterminate shows bar initially and becomes checked on first click', async () => {
    const user = userEvent.setup();
    render(<Checkbox indeterminate />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;

    expect(cb).toHaveAttribute('aria-checked', 'mixed');
    expect(cb).not.toBeChecked();

    await user.click(cb);
    expect(cb).toBeChecked();
    expect(cb).not.toHaveAttribute('data-indeterminate');
    expect(cb).toHaveAttribute('aria-checked', 'true');
  });

  test('controlled: value is driven by props', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="C" />
          <div data-testid="state">{checked ? '1' : '0'}</div>
        </>
      );
    }

    render(<Controlled />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;

    expect(cb).not.toBeChecked();
    await user.click(cb);
    expect(cb).toBeChecked();
    expect(screen.getByTestId('state')).toHaveTextContent('1');
  });

  test('controlled + indeterminate: bar disappears after first interaction', async () => {
    const user = userEvent.setup();

    function ControlledIndeterminate() {
      const [checked, setChecked] = React.useState(false);
      const [indeterminate, setIndeterminate] = React.useState(true);
      return (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={(e) => {
            if (indeterminate) setIndeterminate(false);
            setChecked(e.target.checked);
          }}
          label="CI"
        />
      );
    }

    render(<ControlledIndeterminate />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;

    expect(cb).toHaveAttribute('aria-checked', 'mixed');
    expect(cb).not.toBeChecked();

    await user.click(cb);
    expect(cb).toBeChecked();
    expect(cb).not.toHaveAttribute('data-indeterminate');
    expect(cb).toHaveAttribute('aria-checked', 'true');
  });
});
