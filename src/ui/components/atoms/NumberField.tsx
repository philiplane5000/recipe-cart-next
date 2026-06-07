'use client';
import { useState } from 'react';
import {
  composeRenderProps,
  FieldError,
  Input,
  Label,
  Text,
  TextField as RACTextField,
  type TextFieldProps as RACTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { textFieldInput } from '@/ui/variants/textField.variants';

export interface NumberFieldProps extends Omit<RACTextFieldProps, 'type'> {
  label?: string;
  description?: string;
  placeholder?: string;
  /** Hard floor. Typing or stepping below it snaps back here. @default 0 */
  min?: number;
  inputMode?: 'numeric' | 'decimal';
  errorMessage?: string | ((validation: ValidationResult) => string);
}

/**
 * Numeric sibling of TextField, controlled so the value can never fall below
 * `min` (default 0): a below-floor entry is clamped on change and the input also
 * carries a native `min`. A clamp raises a polite, screen-reader-announced
 * warning wired to the input via RAC's description slot (WCAG 3.3.1). Being
 * controlled, its value also survives React 19's post-action form reset.
 *
 * Works controlled (`value` + `onChange`, e.g. PreparationTimesField deriving a
 * total) or self-managed (omit them; seed with `defaultValue`). Either way it
 * submits its current value under `name`.
 */
export function NumberField({
  label,
  description,
  placeholder,
  min = 0,
  inputMode = 'numeric',
  value: controlledValue,
  defaultValue,
  onChange,
  errorMessage,
  ...props
}: NumberFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [warning, setWarning] = useState<string | null>(null);
  const value = controlledValue ?? internalValue;

  const handleChange = (next: string) => {
    let outgoing = next;
    if (next.trim() !== '') {
      const parsed = Number(next);
      if (Number.isFinite(parsed) && parsed < min) {
        outgoing = String(min);
        setWarning(`Value can’t be below ${min}, so it was set to ${min}.`);
      } else {
        setWarning(null);
      }
    } else {
      setWarning(null);
    }
    // Only own the state when uncontrolled; always forward to a parent.
    if (controlledValue == null) setInternalValue(outgoing);
    onChange?.(outgoing);
  };

  const message = warning ?? description;

  return (
    <RACTextField
      {...props}
      value={value}
      onChange={handleChange}
      className={composeRenderProps(props.className, (className) =>
        twMerge('flex flex-col gap-1.5 font-sans', className),
      )}
    >
      {label && (
        <Label className="text-text text-sm font-medium">{label}</Label>
      )}
      <Input
        type="number"
        min={min}
        inputMode={inputMode}
        placeholder={placeholder}
        className={composeRenderProps('', (className, renderProps) =>
          textFieldInput({ ...renderProps, className }),
        )}
      />
      {/* Persistent polite live region: empty by default, announces on clamp. */}
      <Text
        slot="description"
        aria-live="polite"
        className={twMerge(
          'text-xs',
          warning ? 'text-error-text' : 'text-text-secondary',
        )}
      >
        {message ?? ''}
      </Text>
      <FieldError className="text-error-text text-xs">
        {errorMessage}
      </FieldError>
    </RACTextField>
  );
}
