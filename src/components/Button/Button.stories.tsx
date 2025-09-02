import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Click me',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['text', 'contained', 'outlined'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Contained: Story = {
  args: { variant: 'contained' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Text: Story = {
  args: { variant: 'text' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};
