import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Label',
    placeholder: 'Введите текст',
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
};

export const WithPassword: Story = {
  args: {
    label: 'Пароль',
    type: 'password',
    placeholder: '••••••••',
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    placeholder: 'Неактивно',
    disabled: true,
  },
};
