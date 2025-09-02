import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'contained', size = 'medium', className, children, type, ...props }, ref) => {
    const classes = clsx(styles.button, styles[variant], styles[size], className);

    return (
      <button ref={ref} className={classes} type={type ?? 'button'} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
