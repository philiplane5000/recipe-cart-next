import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H3Props = HeadingVariants & ComponentProps<'h3'>;

export function H3({ size = 'h3', weight, theme, className, ...props }: H3Props) {
  return (
    <h3 className={heading({ size, weight, theme, className })} {...props} />
  );
}
