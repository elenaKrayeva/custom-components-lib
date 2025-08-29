import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Closed: Story = {
  args: {
    open: false,
    children: (
      <>
        <h2>Modal title</h2>
        <p>Content goes here.</p>
      </>
    ),
  },
};

function OpenInteractive(props: React.ComponentProps<typeof Modal>) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Modal
        {...props}
        open={open}
        onClose={() => {
          props.onClose?.();
          setOpen(false);
        }}
      >
        {props.children}
      </Modal>
      <button onClick={() => setOpen(true)}>Open modal</button>
    </div>
  );
}

function WithLongContentInteractive(props: React.ComponentProps<typeof Modal>) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Modal
        {...props}
        open={open}
        onClose={() => {
          props.onClose?.();
          setOpen(false);
        }}
      >
        {props.children}
      </Modal>
      <button onClick={() => setOpen(true)}>Open modal</button>
    </div>
  );
}

export const Open: Story = {
  render: (args) => (
    <OpenInteractive {...args}>
      <h2>Open modal</h2>
      <p>Click the backdrop or press Esc to close.</p>
    </OpenInteractive>
  ),
};

export const WithLongContent: Story = {
  render: (args) => (
    <WithLongContentInteractive {...args}>
      <div>
        <h2>Scrollable content</h2>
        {Array.from({ length: 30 }).map((_, i) => (
          <p key={i}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        ))}
      </div>
    </WithLongContentInteractive>
  ),
};

function ControlledExample(props: React.ComponentProps<typeof Modal>) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        {...props}
        open={open}
        onClose={() => {
          props.onClose?.();
          setOpen(false);
        }}
      >
        {props.children ?? (
          <>
            <h2>Controlled modal</h2>
            <p>Click backdrop or press Esc to close.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};
