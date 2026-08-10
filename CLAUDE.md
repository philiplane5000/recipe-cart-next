# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run format       # Prettier write (auto-sorts Tailwind classes)
npm run format:check # Prettier check without writing
```

No test runner is configured yet.

**Local MongoDB** (required for API routes):

```bash
docker compose up -d   # Start MongoDB 8 on port 27017
```

Set `MONGODB_URI` in `.env.local`:

```
MONGODB_URI="mongodb://recipe-admin:Gr33np3As@localhost:27017/recipecart?authSource=admin"
```

`.env` is committed and contains `MONGODB_APP_NAME`, `MONGODB_DB_NAME`, and Docker credentials. `.env.local` is gitignored and must be created locally.

## Architecture

**Stack**: Next.js 16 App Router · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · React Aria Components · MongoDB 8

### Routing & Data

All routes live under `src/app/`. The default is Server Components; mark files `"use client"` only when required (event handlers, React Aria interactive components). Dynamic API params use the Next.js 15+ `Promise`-based pattern:

```typescript
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
}
```

MongoDB connection (`src/lib/db/client/`) uses a global singleton in development (HMR-safe) and a fresh client per invocation in production (serverless). The `recipes` collection is typed against `RecipeDocument` in `src/models/recipe/`.

### UI Component System

Components follow strict **atomic design**: `src/ui/components/atoms/` → `molecules/` → `organisms/`. Atoms are the only place primitive HTML elements are used; molecules and organisms compose atoms only.

Style variants are defined with `tailwind-variants` in `src/ui/variants/`. Use the variant API rather than inline conditional class strings. `tailwind-merge` handles class conflicts at the call site.

**React Aria Components** is the default for any interactive element (buttons, inputs, dialogs, etc.) to get ARIA semantics and keyboard navigation for free.

RAC ships **unstyled** primitives — styling them ourselves is the intended usage, not a workaround. Import primitives from the `'react-aria-components'` barrel and style them with our `tv` variants + semantic tokens. Do **not** copy RAC's "starter kit" example files: their docs import from local helpers like `./Field`, `./Form`, and `./utils` (e.g. `composeTailwindRenderProps`, `focusRing`, `fieldBorderStyles`, a `Description` component), none of which are part of the npm package — they're sibling files in a template you'd have to copy wholesale, and they conflict with our token system. Equivalents here:

- `composeTailwindRenderProps` → `composeRenderProps` (real barrel export) + `tailwind-merge`.
- `Description` → RAC's `<Text slot="description">`.
- Drive variant state from RAC render-prop booleans (`isFocusVisible`, `isInvalid`, `isDisabled`, `isPending`, …) passed into a `tv`, as in `Button.tsx` / `TextField.tsx`. There is **no** `tailwindcss-react-aria-components` plugin and no `@custom-variant`, so `pressed:` / `data-*` Tailwind variant prefixes do **not** work — use the render-prop pattern instead.

### Design System

All design tokens are defined as CSS custom properties in `src/app/globals.css` using Tailwind v4's `@theme` block.

**Color system** — use semantic tokens, not palette tokens directly:
| Token | Role |
|---|---|
| `--color-background` | Page canvas |
| `--color-surface` | Base surface |
| `--color-surface-raised` | Cards / elevated surfaces |
| `--color-text` / `--color-text-secondary` / `--color-text-muted` | Text hierarchy |
| `--color-cta` | Primary call-to-action (teal) |
| `--color-error` | Destructive / error states |

The palette (primary, secondary, tertiary, neutral, cream, coral) uses OKLCH values with 50–900 scales.

**Typography** uses a fluid scale with `clamp()` — classes `text-xs` through `text-h1` are defined in `@theme`. Headings default to `font-weight: 700`.

### Internationalisation

A `ClientProviders` wrapper in `src/app/provider.tsx` holds the I18n context. The root layout (`src/app/layout.tsx`) reads the `accept-language` header and sets `dir="rtl"` when appropriate.
