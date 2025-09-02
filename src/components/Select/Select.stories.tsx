import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import { Select } from './Select';

const baseOptions = [
  { value: 'nl', label: 'Netherlands' },
  { value: 'pl', label: 'Poland' },
  { value: 'de', label: 'Germany' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    options: baseOptions,
    placeholder: 'Choose…',
    variant: 'outlined',
    label: 'Country',
    disabled: false,
    error: false,
    fullWidth: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'standard'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Playground: Story = {};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: 'Country',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: 'Company',
    options: [
      { value: 'acme', label: 'ACME Inc.' },
      { value: 'globex', label: 'Globex' },
      { value: 'initech', label: 'Initech' },
    ],
  },
};

export const Standard: Story = {
  args: {
    variant: 'standard',
    label: 'Phone type',
    options: [
      { value: 'mobile', label: 'Mobile' },
      { value: 'home', label: 'Home' },
      { value: 'work', label: 'Work' },
    ],
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select a country…',
    label: 'Country',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'pl',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'nl', label: 'Netherlands' },
      { value: 'pl', label: 'Poland', disabled: true },
      { value: 'de', label: 'Germany' },
    ],
  },
};

export const ManyOptionsScrolling: Story = {
  args: {
    label: 'Big list',
    options: Array.from({ length: 40 }, (_, i) => ({
      value: `opt-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const Controlled: Story = {
  render: (args) => {
    const ControlledInner = () => {
      const [val, setVal] = useState<string | undefined>('nl');
      return (
        <div style={{ display: 'grid', gap: 12 }}>
          <Select
            {...args}
            value={val}
            onChange={(v) => {
              setVal(v);
            }}
          />
          <div style={{ fontSize: 12, color: '#666' }}>Selected: {val ?? '—'}</div>
        </div>
      );
    };
    return <ControlledInner />;
  },
  args: {
    label: 'Country',
    options: baseOptions,
  },
};
