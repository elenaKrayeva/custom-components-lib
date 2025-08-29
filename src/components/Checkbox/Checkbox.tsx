import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  ChangeEvent,
} from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    indeterminate = false,
    value = 'on',
    name,
    id,
    required = false,
    readOnly = false,
    className,
    label,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const currentChecked = isControlled ? !!checked : internalChecked;
  const [interacted, setInteracted] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate && !interacted;
    }
  }, [indeterminate, interacted]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!interacted) setInteracted(true);
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  };

  return (
    <label className={[styles.root, className].filter(Boolean).join(' ')}>
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isControlled ? currentChecked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        onChange={handleChange}
        onClick={() => {
          if (inputRef.current?.indeterminate) {
            inputRef.current.indeterminate = false;
          }
          if (!interacted) setInteracted(true);
        }}
        className={styles.input}
        data-indeterminate={indeterminate && !interacted && !currentChecked ? true : undefined}
        aria-checked={indeterminate && !interacted ? 'mixed' : currentChecked}
        {...rest}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
