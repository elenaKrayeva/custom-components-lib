import React, { ChangeEvent, forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'onChange' | 'disabled'
  > {
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: React.ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked = false, onChange, disabled = false, className, label, ...rest }, ref) => {
    const rootClassName = clsx(styles.root, className, {
      [styles.disabled]: disabled,
    });

    return (
      <label className={rootClassName}>
        <input
          ref={ref}
          className={styles.input}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        <span className={styles.slider} aria-hidden />
        {label != null && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
