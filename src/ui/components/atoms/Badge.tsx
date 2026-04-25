import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badge = tv({
  base: 'inline-flex items-center text-xs font-semibold uppercase tracking-wider',
  variants: {
    variant: {
      seasonal:
        'rounded-md bg-tertiary-300 px-2.5 py-1 text-tertiary-900',
      meta: 'text-text-secondary',
    },
  },
  defaultVariants: {
    variant: 'seasonal',
  },
});

type BadgeProps = VariantProps<typeof badge> & ComponentProps<'span'>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badge({ variant, className })} {...props} />;
}
