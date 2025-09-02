/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, type SelectOption } from './Select';

const options: SelectOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

const getTrigger = () => screen.getByRole('button');
const getListbox = () => screen.getByRole('listbox');

describe('Select', () => {
  test('renders placeholder when no value is set', () => {
    render(<Select options={options} placeholder="Choose one" />);
    expect(getTrigger()).toHaveTextContent('Choose one');
  });

  test('renders label for filled/standard variant as a text label', () => {
    render(<Select variant="filled" label="My Label" options={options} />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  test('renders legend inside fieldset for outlined variant', () => {
    render(<Select variant="outlined" label="Outlined Label" options={options} />);
    expect(screen.getByText('Outlined Label')).toBeInTheDocument();
  });

  test('opens and closes the list on trigger click', async () => {
    const user = userEvent.setup();
    render(<Select options={options} />);

    await user.click(getTrigger());
    expect(getListbox()).toBeInTheDocument();

    await user.click(getTrigger());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('closes when clicking outside the component', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Select options={options} />
        <div data-testid="outside">outside</div>
      </>,
    );

    await user.click(getTrigger());
    expect(getListbox()).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('calls onChange and closes when an option is selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Select options={options} onChange={onChange} />);

    await user.click(getTrigger());
    const listbox = getListbox();
    await user.click(within(listbox).getByRole('option', { name: 'Beta' }));

    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  test('disabled option cannot be selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Select options={options} onChange={onChange} />);

    await user.click(getTrigger());
    const listbox = getListbox();
    await user.click(within(listbox).getByRole('option', { name: 'Gamma' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(getListbox()).toBeInTheDocument();
  });

  test('disabled select does not open', async () => {
    const user = userEvent.setup();
    render(<Select options={options} disabled />);

    await user.click(getTrigger());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('uncontrolled: defaultValue sets initial label', () => {
    render(<Select options={options} defaultValue="b" />);
    expect(getTrigger()).toHaveTextContent('Beta');
  });

  test('controlled: value is shown and onChange updates external state', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [val, setVal] = React.useState('a');
      return (
        <>
          <Select value={val} onChange={setVal} options={options} />
          <div data-testid="current">{val}</div>
        </>
      );
    }

    render(<Controlled />);

    expect(getTrigger()).toHaveTextContent('Alpha');
    await user.click(getTrigger());
    await user.click(within(getListbox()).getByRole('option', { name: 'Beta' }));

    expect(screen.getByTestId('current')).toHaveTextContent('b');
    expect(getTrigger()).toHaveTextContent('Beta');
  });

  test('applies error, disabled and fullWidth classes', () => {
    const { container } = render(<Select options={options} error disabled fullWidth />);
    const root = container.querySelector('div');
    expect(root?.className).toMatch(/error/);
    expect(root?.className).toMatch(/disabled/);
    expect(root?.className).toMatch(/fullWidth/);
  });
});
