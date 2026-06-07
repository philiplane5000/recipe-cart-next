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

export interface TextFieldProps extends RACTextFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField({
  label,
  description,
  placeholder,
  errorMessage,
  ...props
}: TextFieldProps) {
  return (
    <RACTextField
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge('flex flex-col gap-1.5 font-sans', className),
      )}
    >
      {label && <Label className="text-sm font-medium text-text">{label}</Label>}
      <Input
        placeholder={placeholder}
        className={composeRenderProps('', (className, renderProps) =>
          textFieldInput({ ...renderProps, className }),
        )}
      />
      {description && (
        <Text slot="description" className="text-xs text-text-secondary">
          {description}
        </Text>
      )}
      <FieldError className="text-xs text-error">{errorMessage}</FieldError>
    </RACTextField>
  );
}
