import React, { forwardRef, useId } from 'react';
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

    return (
      <div
        className={[
          styles.root,
          styles[variant],
          error && styles.error,
          disabled && styles.disabled,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {variant === 'outlined' ? (
          <div className={styles.inputWrapper}>
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
          </div>
        ) : (
          <div className={styles.inputWrapper}>
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
          </div>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
