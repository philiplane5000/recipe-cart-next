'use client';
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
  /**
   * Native `min`. Under `validationBehavior="native"` the browser **enforces** this
   * and blocks submission, so it should mirror the collection schema's `minimum`
   * for the same field rather than being chosen independently.
   * @default 0
   */
  min?: number;
  inputMode?: 'numeric' | 'decimal';
  /**
   * Native step granularity. **Load-bearing, not cosmetic:** an
   * `<input type="number">` with no `step` inherits HTML's default of `1` (stepping
   * from `min`), so `1.5` is a `stepMismatch` and the browser silently refuses to
   * submit the **entire form**. Any field that accepts fractions must therefore
   * carry `step="any"` — which `inputMode="decimal"` sets for you.
   *
   * It doubles as the whole-number rule for the fields that want one: `step={1}`
   * mirrors the schema's `multipleOf: 1`.
   * @default `'any'` when inputMode is 'decimal', otherwise 1
   */
  step?: number | 'any';
  errorMessage?: string | ((validation: ValidationResult) => string);
}

/**
 * Numeric sibling of TextField (src/ui/components/atoms/TextField.tsx): the same
 * field shell with `type="number"`.
 *
 * Its value is a **string**, like any text input — '' when untouched, which is
 * what keeps "blank" distinguishable from a deliberate 0. Coercion belongs to
 * the caller's schema, not here.
 *
 * Presentational only: it does not correct what the user types. An out-of-range
 * entry is refused by the browser with a message rather than silently clamped — a
 * silent correction is a WCAG 3.3.1 problem, an explicit message is not.
 *
 * Give any field that accepts fractions `inputMode="decimal"`. See `step`: without
 * it the browser blocks submission of the whole form, with no error anywhere.
 */
export function NumberField({
  label,
  description,
  placeholder,
  min = 0,
  inputMode = 'numeric',
  step = inputMode === 'decimal' ? 'any' : 1,
  errorMessage,
  ...props
}: NumberFieldProps) {
  return (
    <RACTextField
      {...props}
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
        step={step}
        inputMode={inputMode}
        placeholder={placeholder}
        className={composeRenderProps('', (className, renderProps) =>
          textFieldInput({ ...renderProps, className }),
        )}
      />
      {description && (
        <Text slot="description" className="text-text-secondary text-xs">
          {description}
        </Text>
      )}
      <FieldError className="text-error-text text-xs">
        {errorMessage}
      </FieldError>
    </RACTextField>
  );
}
