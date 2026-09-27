'use client';
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?:
    | 'primary'
    | 'secondary'
    | 'coral'
    | 'tertiary'
    | 'destructive'
    | 'quiet';
}

const button = tv({
  base: 'relative inline-flex items-center justify-center gap-2 border border-transparent h-10 box-border px-4 py-0 [&:has(>svg:only-child)]:px-0 [&:has(>svg:only-child)]:h-9 [&:has(>svg:only-child)]:w-9 font-sans text-base text-center transition rounded-lg cursor-default [-webkit-tap-highlight-color:transparent]',
  variants: {
    variant: {
      primary:
        'bg-cta hover:bg-cta-hover pressed:bg-cta-pressed text-text-on-dark',
      destructive:
        'bg-destructive hover:bg-destructive-hover pressed:bg-destructive-pressed text-text-on-dark',
      // 3.25:1 / 4.13:1 / 6.28:1. `text-2xl` lives here, not in `base`: at 24px
      // the label is WCAG "large text" (3:1 floor), which is the only thing
      // keeping the rest state compliant. Do not shrink it, and keep it a fixed
      // size — the project's fluid clamp() steps can drop under 24px when narrow.
      secondary:
        'bg-secondary-500 hover:bg-secondary-600 pressed:bg-secondary-700 text-text-on-dark text-2xl',
      tertiary:
        'bg-tertiary-300 hover:bg-tertiary-400 pressed:bg-tertiary-500 text-text',
      coral: 'bg-coral-300 hover:bg-coral-400 pressed:bg-coral-500 text-text',
      quiet:
        'border-0 bg-transparent hover:bg-cream-200 pressed:bg-cream-300 text-primary-800',
    },
    isDisabled: {
      true: 'border-transparent opacity-50 cursor-default',
    },
    isPending: {
      true: 'text-transparent',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
  compoundVariants: [
    {
      variant: 'quiet',
      isDisabled: true,
      class: 'bg-transparent',
    },
  ],
});

/** Light-filled variants need a dark spinner; `isPending` makes text
 *  transparent, so `currentColor` can't be used. */
const DARK_SPINNER_VARIANTS = new Set(['tertiary', 'coral', 'quiet']);

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className }),
      )}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {children}
          {isPending && (
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                className="h-6 w-6 animate-spin"
                viewBox="0 0 24 24"
                stroke={
                  DARK_SPINNER_VARIANTS.has(props.variant ?? '')
                    ? 'var(--color-text)'
                    : 'var(--color-text-on-dark)'
                }
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                  fill="none"
                  className="opacity-25"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  pathLength="100"
                  strokeDasharray="60 140"
                  strokeDashoffset="0"
                />
              </svg>
            </span>
          )}
        </>
      ))}
    </RACButton>
  );
}
