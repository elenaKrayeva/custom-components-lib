import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Default checkbox',
  },
};

export const WithDefaultChecked: Story = {
  args: {
    label: 'Checked by default',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

export const Indeterminate: Story = {
  render: (args) => <Checkbox {...args} indeterminate label="Indeterminate" />,
};

function ControlledExample(props: React.ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      {...props}
      label={`Controlled: ${checked ? 'On' : 'Off'}`}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};
