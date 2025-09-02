import React, { forwardRef, useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
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

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const toggleOpen = () => {
    if (!disabled) setOpen((prev) => !prev);
  };

  const focusButton = () => {
    buttonRef.current?.focus();
  };

  const handleOptionChoose = (selectedValue: string) => {
    setValue(selectedValue);
    setOpen(false);
    focusButton();
  };

  const handleListMouseDown = (event: React.MouseEvent<HTMLUListElement>) => {
    event.preventDefault();
  };

  const handleListClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target as HTMLElement | null;
    const item = target?.closest('li[data-value]') as HTMLLIElement | null;
    if (!item) return;

    const isDisabled = item.getAttribute('data-disabled') != null;
    if (isDisabled) return;

    const selectedValue = item.getAttribute('data-value');
    if (selectedValue != null) {
      handleOptionChoose(selectedValue);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleDocumentMouseDown = (event: globalThis.MouseEvent) => {
      if (!rootRef.current) return;
      if (event.target instanceof Node && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [open]);

  const displayLabel =
    options.find((option) => option.value === currentValue)?.label ?? placeholder ?? '';

  const rootClassName = clsx(
    styles.root,
    styles[variant],
    {
      [styles.error]: error,
      [styles.disabled]: disabled,
      [styles.fullWidth]: fullWidth,
    },
    className,
  );

  const trigger = (
    <button
      ref={mergedButtonRef}
      type="button"
      className={styles.trigger}
      onClick={toggleOpen}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <span className={styles.value}>
        {displayLabel || <span className={styles.placeholder}>{placeholder ?? ''}</span>}
      </span>
      <span className={clsx(styles.icon, { [styles.iconOpen]: open })} />
    </button>
  );

  const list = open ? (
    <ul
      className={styles.listbox}
      role="listbox"
      onMouseDown={handleListMouseDown}
      onClick={handleListClick}
    >
      {options?.map((option) => {
        const selected = option.value === currentValue;
        return (
          <li
            key={option.value}
            role="option"
            aria-selected={selected}
            data-selected={selected || undefined}
            data-disabled={option.disabled || undefined}
            data-value={option.value}
            className={styles.option}
          >
            {option.label}
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div ref={rootRef} className={rootClassName}>
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
