import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    checked: false,
    label: 'Notifications',
  },
};

function ControlledExample(props: React.ComponentProps<typeof Switch>) {
  const [on, setOn] = useState(false);
  return (
    <Switch
      {...props}
      checked={on}
      onChange={(e) => setOn(e.target.checked)}
      label={`Controlled: ${on ? 'On' : 'Off'}`}
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};
