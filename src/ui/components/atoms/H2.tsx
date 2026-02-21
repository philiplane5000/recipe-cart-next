import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H2Props = HeadingVariants & ComponentProps<'h2'>;

export function H2({ weight, theme, className, ...props }: H2Props) {
  return <h2 className={heading({ weight, theme, className })} {...props} />;
}
