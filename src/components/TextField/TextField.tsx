import React, { forwardRef, useId } from 'react';
import clsx from 'clsx';
import styles from './TextField.module.css';

export type TextFieldVariant = 'outlined' | 'standard' | 'filled';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  variant?: TextFieldVariant;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error = false, id, className, variant = 'outlined', disabled, ...rest }, ref) => {
    const reactId = useId();
    const inputId = id ?? `textfield-${reactId}`;

    const rootClassName = clsx(
      styles.root,
      styles[variant],
      {
        [styles.error]: error,
        [styles.disabled]: disabled,
      },
      className,
    );

    return (
      <div className={rootClassName}>
        <div className={styles.inputWrapper}>
          {variant === 'outlined' ? (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                {label ? <span>{label}</span> : <span>&#8203;</span>}
              </legend>
              <input
                id={inputId}
                ref={ref}
                className={styles.input}
                aria-invalid={error || undefined}
                disabled={disabled}
                {...rest}
              />
            </fieldset>
          ) : (
            <>
              {label && (
                <label htmlFor={inputId} className={styles.label}>
                  {label}
                </label>
              )}
              <input
                id={inputId}
                ref={ref}
                className={styles.input}
                aria-invalid={error || undefined}
                disabled={disabled}
                {...rest}
              />
            </>
          )}
        </div>
      </div>
    );
  },
);

TextField.displayName = 'TextField';
