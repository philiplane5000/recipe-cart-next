# Proposal

## Why

Every recipe card and the featured recipe on the home page already link to `/recipes/{id}`, but no route exists there, so each of those links leads to a 404. `src/app/create/actions.ts` also has a TODO waiting for a detail page. Before designing the detail UI, the route and data plumbing need to be in place. That plumbing should follow the Next.js 16 docs and the project's existing patterns, so the UI work starts with a typed recipe already loaded and nothing else to wire up.

## What Changes

- **New route `/recipes/[id]`**: a Server Component page reads the `id` param, loads the recipe through the existing data layer, and renders only the recipe's name as the page `<h1>` (using the `H1` atom). The full `RecipeDocument` is in scope in the page component, ready for the UI.
- **Not-found handling**: an id that matches no recipe, or one that cannot be a recipe id at all (not a 24-character hex ObjectId), calls `notFound()` and gets Next.js's 404 response. Real failures such as the database being unreachable stay errors and are not reported as "not found".
- **Generated metadata**: the document `<title>` becomes the recipe's name and the meta description its description. Other routes keep their current title.
- **Request-memoised read in the data layer**: `src/lib/db/recipes` gains one export that wraps the existing `fetchById` in React's `cache`. `generateMetadata` and the page then share a single database query per request, and a malformed id resolves to `null` instead of throwing. This is an addition only: `fetchById` and `GET /api/recipes/[id]` behave exactly as before.
- **No new dependencies and no other UI.** `loading.tsx`, `not-found.tsx`, `error.tsx` and every recipe section beyond the `<h1>` are left for the UI pass. Next.js's built-in fallbacks cover those cases until then.

### Out of scope

- Detail UI of any kind beyond the `<h1>`: image, description, ingredients, steps, times, nutrition, tags, layout.
- Pointing the create action's redirect at the new recipe. The TODO stays, as a follow-up for the UI pass.
- Enforcing `visibility`. There is no auth yet, and the home page already lists private recipes.
- Any change to the `/api/recipes` route handlers.

## Capabilities

### New Capabilities

- `recipe-detail-page`: Serving a single stored recipe at `/recipes/[id]`. Covers how a URL id resolves to a recipe, the not-found behaviour for unknown and malformed ids, the page heading, and the document metadata derived from the recipe.

### Modified Capabilities

None. No specs exist yet, and no existing behaviour changes.

## Impact

- **Added**: `src/app/recipes/[id]/page.tsx`.
- **Modified (additive)**: `src/lib/db/recipes/index.ts` gains one request-memoised read and an import of `cache` from `react`.
- **Unchanged**: `fetchById`, the `GET`/`DELETE` handlers in `src/app/api/recipes/[id]/route.ts`, `src/app/create/actions.ts`, and the recipe card components. The cards' existing `/recipes/{id}` links start resolving.
- **Dependencies**: none added. `next` 16.2.7 and `react` 19.2.7 already provide everything used.
- **Rendering**: the page renders at request time, like every route in the app (the root layout reads `headers()`). No caching or route-segment config is introduced.
