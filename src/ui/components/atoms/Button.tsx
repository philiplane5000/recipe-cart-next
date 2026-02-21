'use client';
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: 'primary' | 'secondary' | 'coral' | 'blush' | 'destructive' | 'quiet';
}

const button = tv({
  base: 'relative inline-flex items-center justify-center gap-2 border border-transparent h-9 box-border px-3.5 py-0 [&:has(>svg:only-child)]:px-0 [&:has(>svg:only-child)]:h-8 [&:has(>svg:only-child)]:w-8 font-sans text-sm text-center transition rounded-lg cursor-default [-webkit-tap-highlight-color:transparent]',
  variants: {
    variant: {
      primary:
        'bg-primary-500 hover:bg-primary-600 pressed:bg-primary-700 text-cream-50',
      secondary:
        'bg-secondary-400 hover:bg-secondary-500 pressed:bg-secondary-600 text-cream-50',
      coral:
        'bg-coral-500 hover:bg-coral-600 pressed:bg-coral-700 text-cream-50',
      blush:
        'bg-blush-400 hover:bg-blush-500 pressed:bg-blush-600 text-cream-50',
      destructive:
        'bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white',
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

const LIGHT_TEXT_VARIANTS = new Set(['secondary', 'quiet']);

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
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                stroke={
                  LIGHT_TEXT_VARIANTS.has(props.variant ?? '')
                    ? 'black'
                    : 'white'
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
