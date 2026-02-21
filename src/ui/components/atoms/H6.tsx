import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H6Props = HeadingVariants & ComponentProps<'h6'>;

export function H6({ weight, theme, className, ...props }: H6Props) {
  return <h6 className={heading({ weight, theme, className })} {...props} />;
}
