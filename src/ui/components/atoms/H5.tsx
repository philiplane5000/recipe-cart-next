import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H5Props = HeadingVariants & ComponentProps<'h5'>;

export function H5({ size = 'h5', weight, theme, className, ...props }: H5Props) {
  return (
    <h5 className={heading({ size, weight, theme, className })} {...props} />
  );
}
