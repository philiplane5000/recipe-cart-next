import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H1Props = HeadingVariants & ComponentProps<'h1'>;

export function H1({ weight, theme, className, ...props }: H1Props) {
  return <h1 className={heading({ weight, theme, className })} {...props} />;
}
