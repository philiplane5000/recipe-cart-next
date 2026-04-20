import { tv, type VariantProps } from 'tailwind-variants';

export const heading = tv({
  base: 'font-sans',
  variants: {
    size: {
      h1: 'text-h1',
      h2: 'text-h2',
      h3: 'text-h3',
      h4: 'text-h4',
      h5: 'text-h5',
      h6: 'text-h6',
    },
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
