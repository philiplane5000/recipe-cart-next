import { tv, type VariantProps } from 'tailwind-variants';

export const heading = tv({
  base: 'font-sans',
  variants: {
    weight: {
      normal: 'font-semibold',
      strong: 'font-bold',
    },
    theme: {
      default: '',
      brand: 'text-primary-500',
      accent: 'text-secondary-500',
    },
  },
  defaultVariants: {
    weight: 'normal',
    theme: 'default',
  },
});

export type HeadingVariants = VariantProps<typeof heading>;
