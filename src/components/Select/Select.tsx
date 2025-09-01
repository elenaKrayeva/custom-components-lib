import React, { forwardRef, useRef, useState, useEffect } from 'react';
import styles from './Select.module.css';

export type SelectVariant = 'outlined' | 'filled' | 'standard';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps {
  label?: string;
  error?: boolean;
  disabled?: boolean;
  variant?: SelectVariant;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    label,
    error = false,
    disabled = false,
    variant = 'outlined',
    value,
    defaultValue,
    onChange,
    options,
    className,
    placeholder,
    fullWidth,
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const mergedButtonRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (!rootRef.current) return;
      if (e.target instanceof Node && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const setValue = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  const toggleOpen = () => {
    if (!disabled) setOpen((o) => !o);
  };

  const handleOptionClick = (opt: SelectOption) => {
    if (opt.disabled) return;
    setValue(opt.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const displayLabel = options.find((o) => o.value === currentValue)?.label ?? placeholder ?? '';

  const rootClass = [
    styles.root,
    styles[variant],
    error && styles.error,
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trigger = (
    <button
      ref={mergedButtonRef}
      type="button"
      className={styles.trigger}
      onClick={toggleOpen}
      disabled={disabled}
    >
      <span className={styles.value}>
        {displayLabel || <span className={styles.placeholder}>{placeholder ?? ''}</span>}
      </span>
      <span className={[styles.icon, open && styles.iconOpen].filter(Boolean).join(' ')} />
    </button>
  );

  const list = open ? (
    <ul className={styles.listbox}>
      {options.map((opt) => {
        const selected = opt.value === currentValue;
        return (
          <li
            key={opt.value}
            data-selected={selected || undefined}
            data-disabled={opt.disabled || undefined}
            className={styles.option}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleOptionClick(opt)}
          >
            {opt.label}
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div ref={rootRef} className={rootClass}>
      <div className={styles.control}>
        {variant === 'outlined' ? (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              {label ? <span>{label}</span> : <span>&#8203;</span>}
            </legend>
            {trigger}
            {list}
          </fieldset>
        ) : (
          <>
            {label && <label className={styles.label}>{label}</label>}
            {trigger}
            {list}
          </>
        )}
      </div>
    </div>
  );
});
