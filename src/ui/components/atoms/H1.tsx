import React, { ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export const h1 = tv({
  base: 'text-4xl mb-2 font-sans',
  variants: {
    variant: {
      normal: 'font-semibold text-stone-800',
      strong: 'font-bold text-stone-900',
    },
  },
  defaultVariants: {
    variant: 'normal',
  },
});

type H1Variants = VariantProps<typeof h1>;

interface H1Props extends H1Variants {
  className?: string;
  children: ReactNode;
}

export function H1(props: H1Props) {
  return <h1 className={h1(props)}>{props.children}</h1>;
}
