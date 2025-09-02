import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  test('does not render when open=false', () => {
    render(
      <Modal open={false} onClose={jest.fn()}>
        <div>content</div>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('.backdrop')).toBeNull();
  });

  test('renders dialog and children when open=true', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <h2>Title</h2>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  test('calls onClose when clicking the backdrop', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    const backdrop = document.querySelector('.backdrop') as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking inside the dialog', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <button>Inside</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { hidden: true });
    await user.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByText('Inside'));
    expect(onClose).not.toHaveBeenCalled();
  });

  test('calls onClose on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('locks body scroll while open and restores on close (rerender)', async () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Modal open onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal open={false} onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  test('restores body scroll on unmount', () => {
    const { unmount } = render(
      <Modal open onClose={() => {}}>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
