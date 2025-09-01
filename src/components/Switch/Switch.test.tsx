import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  test('renders unchecked when checked=false', () => {
    render(<Switch checked={false} readOnly />);
    const sw = screen.getByRole('checkbox') as HTMLInputElement;
    expect(sw).not.toBeChecked();
  });

  test('renders checked when checked=true', () => {
    render(<Switch checked readOnly />);
    const sw = screen.getByRole('checkbox') as HTMLInputElement;
    expect(sw).toBeChecked();
  });

  test('calls onChange when clicking slider', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<Switch checked={false} onChange={onChange} />);
    const slider = container.querySelector('.slider')!;
    await user.click(slider);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<Switch checked={false} disabled onChange={onChange} />);
    const slider = container.querySelector('.slider')!;
    await user.click(slider);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('toggles in a controlled wrapper', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [on, setOn] = React.useState(false);
      return (
        <Switch
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          label={`State: ${on ? 'On' : 'Off'}`}
        />
      );
    }

    render(<Controlled />);
    const sw = screen.getByRole('checkbox') as HTMLInputElement;

    expect(sw).not.toBeChecked();
    await user.click(sw);
    expect(sw).toBeChecked();
    await user.click(sw);
    expect(sw).not.toBeChecked();
  });

  test('has accessible label from the label prop', () => {
    render(<Switch checked={false} readOnly label="Notifications" />);
    const sw = screen.getByRole('checkbox', { name: 'Notifications' });
    expect(sw).toBeInTheDocument();
  });

  test('clicking the label triggers onChange', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Switch checked={false} onChange={onChange} label="Label" />);
    await user.click(screen.getByText('Label'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
