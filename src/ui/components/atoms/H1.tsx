import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H1Props = HeadingVariants & ComponentProps<'h1'>;

export function H1({ size = 'h1', weight, theme, className, ...props }: H1Props) {
  return (
    <h1 className={heading({ size, weight, theme, className })} {...props} />
  );
}
