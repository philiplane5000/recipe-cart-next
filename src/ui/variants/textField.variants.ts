import { tv, type VariantProps } from 'tailwind-variants';

// Styling vocabulary intentionally mirrors SearchBar's field shell
// (src/ui/components/molecules/SearchBar.tsx): bg-background near-white fill,
// border-line idle (a visible resting boundary so the field is discoverable —
// WCAG 1.4.11), border-cta on focus, opacity-50 + cursor-not-allowed when
// disabled. TextField adds the invalid state. The 1px border width is constant
// across states; only its color changes, so no state causes layout shift.
export const textFieldInput = tv({
  base: 'w-full min-h-10 box-border rounded-full border border-line bg-background px-4 py-0 font-sans text-sm text-text outline-none transition placeholder:text-text-secondary',
  variants: {
    isFocusVisible: {
      true: 'border-cta',
    },
    isInvalid: {
      true: 'border-error',
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
  compoundVariants: [
    {
      isFocusVisible: true,
      isInvalid: true,
      class: 'border-error',
    },
  ],
});

export type TextFieldInputVariants = VariantProps<typeof textFieldInput>;
