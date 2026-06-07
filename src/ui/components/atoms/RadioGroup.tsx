'use client';
import {
  composeRenderProps,
  FieldError,
  Label,
  Radio,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  Text,
  type ValidationResult,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import {
  radioDot,
  radioIndicator,
  radioRow,
} from '@/ui/variants/radioGroup.variants';

export interface RadioOption {
  value: string;
  label: string;
  /** Optional helper line under the option label. */
  description?: string;
}

export interface RadioGroupProps extends Omit<RACRadioGroupProps, 'children'> {
  label?: string;
  description?: string;
  options: RadioOption[];
  errorMessage?: string | ((validation: ValidationResult) => string);
}

/**
 * Field-shell sibling of TextField / TextArea — same Label · description Text ·
 * FieldError scaffold — wrapping a RAC RadioGroup. Pass the choices as `options`
 * so call sites stay declarative. Submits the selected `value` under `name`.
 */
export function RadioGroup({
  label,
  description,
  options,
  errorMessage,
  ...props
}: RadioGroupProps) {
  return (
    <RACRadioGroup
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge('flex flex-col gap-1.5 font-sans', className),
      )}
    >
      {label && (
        <Label className="text-text text-sm font-medium">{label}</Label>
      )}
      <div className="flex flex-col gap-2 pt-1">
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className={composeRenderProps('', (className, { isDisabled }) =>
              radioRow({ isDisabled, className }),
            )}
          >
            {({ isSelected, isFocusVisible, isInvalid }) => (
              <>
                <span
                  className={radioIndicator({
                    isSelected,
                    isFocusVisible,
                    isInvalid,
                  })}
                >
                  <span className={radioDot({ isSelected })} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-text text-sm">{option.label}</span>
                  {option.description && (
                    <span className="text-text-secondary text-xs">
                      {option.description}
                    </span>
                  )}
                </span>
              </>
            )}
          </Radio>
        ))}
      </div>
      {description && (
        <Text slot="description" className="text-text-secondary text-xs">
          {description}
        </Text>
      )}
      <FieldError className="text-error-text text-xs">
        {errorMessage}
      </FieldError>
    </RACRadioGroup>
  );
}
