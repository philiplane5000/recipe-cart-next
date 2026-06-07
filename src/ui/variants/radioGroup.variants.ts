import { tv, type VariantProps } from 'tailwind-variants';

// Reuses the field state vocabulary of textField/textArea variants
// (border-line idle → border-cta selected/focus → border-error-border invalid). The
// row owns the disabled treatment; the indicator owns selected/focus/invalid so
// the focus ring reads clearly on the small circle.
export const radioRow = tv({
  base: 'flex cursor-pointer items-start gap-2.5',
  variants: {
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
});

export const radioIndicator = tv({
  base: 'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-line bg-background transition',
  variants: {
    isSelected: {
      true: 'border-cta',
    },
    isFocusVisible: {
      true: 'border-cta ring-2 ring-cta ring-offset-2 ring-offset-background',
    },
    isInvalid: {
      true: 'border-error-border',
    },
  },
  compoundVariants: [
    {
      isFocusVisible: true,
      isInvalid: true,
      class: 'border-error-border ring-error',
    },
  ],
});

export const radioDot = tv({
  base: 'size-2 rounded-full bg-cta transition-transform',
  variants: {
    isSelected: {
      true: 'scale-100',
      false: 'scale-0',
    },
  },
});

export type RadioRowVariants = VariantProps<typeof radioRow>;
