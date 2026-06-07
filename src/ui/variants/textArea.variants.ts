import { tv, type VariantProps } from 'tailwind-variants';

// Shares the state vocabulary of textFieldInput (src/ui/variants/textField.variants.ts):
// border-line idle (a visible resting boundary — WCAG 1.4.11), border-cta on
// focus, border-error-border when invalid, opacity-50 + cursor-not-allowed disabled.
// The geometry deliberately differs: a textarea is multi-line, so it uses a
// rectangular radius (rounded-2xl, matching the form's fieldset cards), vertical
// padding, a taller min-height, and vertical-only resize. As with the input, the
// 1px border width is constant across states so no state causes layout shift.
export const textAreaInput = tv({
  base: 'w-full min-h-24 box-border resize-y rounded-2xl border border-line bg-background px-4 py-2 font-sans text-sm leading-relaxed text-text outline-none transition placeholder:text-text-secondary',
  variants: {
    isFocusVisible: {
      true: 'border-cta',
    },
    isInvalid: {
      true: 'border-error-border',
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
  compoundVariants: [
    {
      isFocusVisible: true,
      isInvalid: true,
      class: 'border-error-border',
    },
  ],
});

export type TextAreaInputVariants = VariantProps<typeof textAreaInput>;
