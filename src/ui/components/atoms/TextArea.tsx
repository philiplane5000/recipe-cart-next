'use client';
import { useState } from 'react';
import {
  composeRenderProps,
  FieldError,
  Label,
  Text,
  TextArea as RACTextArea,
  TextField as RACTextField,
  type TextFieldProps as RACTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { textAreaInput } from '@/ui/variants/textArea.variants';

export interface TextAreaProps extends RACTextFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  /** Visible line count before scrolling; the field still grows via resize-y. */
  rows?: number;
  /** Hard character cap enforced natively by the browser. */
  maxLength?: number;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

/**
 * Multi-line sibling of TextField (src/ui/components/atoms/TextField.tsx). Same
 * RAC <TextField> field shell — Label, description Text, FieldError — with a
 * <TextArea> swapped in for the single-line <Input>. Reach for this for
 * long-form copy (e.g. a recipe description); use TextField for single-line.
 *
 * When `maxLength` is set, a live "count/limit" readout renders beneath the
 * field. It's aria-hidden — the native maxLength already enforces (and conveys)
 * the limit, and announcing a fresh count on every keystroke is noise. The
 * enhancement path, if we want it announced, is a debounced aria-live="polite"
 * region that only speaks near the limit.
 */
export function TextArea({
  label,
  description,
  placeholder,
  rows = 4,
  maxLength,
  errorMessage,
  ...props
}: TextAreaProps) {
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(props.defaultValue ?? '').length,
  );
  // Prefer the controlled value's length when the field is driven from outside;
  // otherwise track our own via onChange. Covers both usages without an effect.
  const length = props.value != null ? props.value.length : uncontrolledLength;
  const atLimit = maxLength != null && length >= maxLength;

  return (
    <RACTextField
      {...props}
      onChange={(value) => {
        setUncontrolledLength(value.length);
        props.onChange?.(value);
      }}
      className={composeRenderProps(props.className, (className) =>
        twMerge('flex flex-col gap-1.5 font-sans', className),
      )}
    >
      {label && (
        <Label className="text-text text-sm font-medium">{label}</Label>
      )}
      <RACTextArea
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className={composeRenderProps('', (className, renderProps) =>
          textAreaInput({ ...renderProps, className }),
        )}
      />
      {(description || maxLength != null) && (
        <div className="flex items-baseline gap-2">
          {description && (
            <Text slot="description" className="text-text-secondary text-xs">
              {description}
            </Text>
          )}
          {maxLength != null && (
            <span
              aria-hidden="true"
              className={twMerge(
                'ml-auto text-xs tabular-nums',
                atLimit ? 'text-error-text' : 'text-text-secondary',
              )}
            >
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
      <FieldError className="text-error-text text-xs">
        {errorMessage}
      </FieldError>
    </RACTextField>
  );
}
