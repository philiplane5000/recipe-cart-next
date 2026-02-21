import type { ComponentProps } from 'react';
import { heading, type HeadingVariants } from '@/ui/variants/heading.variants';

type H4Props = HeadingVariants & ComponentProps<'h4'>;

export function H4({ weight, theme, className, ...props }: H4Props) {
  return <h4 className={heading({ weight, theme, className })} {...props} />;
}
