# Design

Doc references below are to the Next.js 16.2.7 docs shipped in `node_modules/next/dist/docs/` (abbreviated `docs/`). The motivation is in proposal.md (Why) and the requirements are in `specs/recipe-detail-page/spec.md`.

## Context

- **The links already exist.** `RecipeCard` and `FeaturedRecipe` both link to `` `/recipes/${recipe._id.toString()}` ``. The JSON API uses the same segment name, at `src/app/api/recipes/[id]/route.ts`.
- **The existing read.** `fetchById(id)` in `src/lib/db/recipes/index.ts` returns `RecipeDocument | null`. When `!ObjectId.isValid(id)` it **throws** a plain `Error`, and `GET /api/recipes/[id]` turns every thrown error into a 400. That is the API's documented contract, and this change keeps it.
- **What a malformed id is.** In the installed `bson` 7.2, `ObjectId.isValid(string)` is true only for a 24-character hex string (either case), and the constructor throws on anything else (checked directly against the installed driver). The collection's `$jsonSchema` requires `_id` to be an `objectId`, so **no stored recipe can have any other kind of id**.
- **The established page pattern.** `src/app/page.tsx` is an async Server Component that calls the data layer (`listAll()`) directly. That matches the docs: "Fetch data in Server Components directly from its source, not via Route Handlers" (`docs/01-app/02-guides/backend-for-frontend.md`).
- **Rendering.** The root layout awaits `headers()`, so every route already renders at request time. `cacheComponents` is not enabled, so the previous caching model applies (`docs/01-app/02-guides/caching-without-cache-components.md`): nothing is cached across requests unless asked for.
- **Fallback UI.** There is no `not-found`, `error`, or `loading` file anywhere in `src/app`, so Next.js's built-in fallbacks apply.
- **Connections in production.** `getMongoClient()` opens a **new** client on every call when `NODE_ENV=production` (pre-existing). How many times one request reads the database therefore matters.

## Goals / Non-Goals

**Goals:**

- The page component holds a non-null, fully typed `RecipeDocument` with every not-found path already handled. The UI pass only adds JSX in the page's return.
- One database read per request, even though `generateMetadata` and the page both need the recipe.
- Zero behaviour change for existing code: `fetchById`, both API handlers, the home page, and `/create`.
- Only documented Next.js and React APIs. No new packages and no config changes.

**Non-Goals:**

- Route UI files (`loading.tsx`, `not-found.tsx`, `error.tsx`). They belong to the UI pass; see Risks for how `loading.tsx` affects the 404 status.
- A serialisable view type or DTO for Client Components (see D6).
- Prerendering or cross-request caching of recipe pages.
- Authorisation or `visibility` enforcement.
- A brand suffix in the tab title (for example a root-layout `title.template` of `'%s | Recipe Cart'`). That touches every route, and a later change would MODIFY the metadata requirement.

## Decisions

### D1. Route at `src/app/recipes/[id]/page.tsx`, with the param named `id`

This matches the hrefs the cards already render, the API's `[id]` segment, and the TODO in `src/app/create/actions.ts` (`/recipes/<insertedId>`). Folder conventions follow `docs/01-app/01-getting-started/03-layouts-and-pages.md` (Creating a dynamic segment).

_Alternatives:_ `/recipe/[id]`, or slug URLs (`/recipes/[slug]`). Both are rejected: the first breaks the existing links, and the schema has no slug field.

### D2. Read through one new, request-memoised data-layer function that wraps `fetchById`

The new function goes in `src/lib/db/recipes/index.ts`, next to the read it reuses:

```ts
export const getRecipe = cache(
  async (id: string): Promise<RecipeDocument | null> =>
    ObjectId.isValid(id) ? fetchById(id) : null,
);
```

`cache` is imported from `react`. Give the function a JSDoc block in the module's existing style that states its two differences from `fetchById`.

- **Why `cache`.** `generateMetadata` and the page both need the recipe. Automatic `fetch` memoisation does not cover the MongoDB driver. For direct database access the docs prescribe React `cache`, so the read runs once per request (`docs/01-app/01-getting-started/14-metadata-and-og-images.md` → Memoizing data requests; `docs/01-app/02-guides/caching-without-cache-components.md` → Deduplicating requests). In production this also halves the clients the page would otherwise open (see Context).
- **Why `null` for a malformed id.** No stored recipe can have one, so "can't exist" and "doesn't exist" fall into the same case. The docs' `notFound()` example does the same: its data function returns `undefined` for any unusable response and the page checks only that (`docs/01-app/03-api-reference/04-functions/not-found.md`). Database failures still reject, so they are never mistaken for a missing recipe. This is the spec's "Load failures are errors" requirement.
- **Why the data layer, not the page.** It keeps `mongodb` (`ObjectId`) out of `src/app`, per the data-security guide's audit item "verify that database packages … are not imported outside the Data Access Layer". It is also where the guide puts authorisation checks, so it is the place for a `visibility` check once auth exists (`docs/01-app/02-guides/data-security.md`).
- **Why it is safe for existing callers.** It only adds code. `fetchById`, and so the API's 400 for malformed ids, is untouched. In the react-server build, `cache` memoises within a render and calls straight through elsewhere. In the plain build that `tsx` scripts resolve, it is a passthrough (both confirmed in `node_modules/react/cjs`). Scripts that load this module therefore keep working, for example docs/create-recipe-form.md §12, which runs the create action under `tsx`.
- **Why the name `getRecipe`.** It is the docs' naming for memoised readers (`getPost`, `getUser`, `getItem`). It also reads as a different contract from `fetchById`, which throws on a malformed id and is not memoised.

_Alternatives considered:_

1. **Check validity in the page with `ObjectId.isValid`, then call `cache(fetchById)`.** This follows the shape of the docs' `[locale]` validation example, but it imports the driver into `src/app` and repeats the check in both `generateMetadata` and the page.
2. **`try { await fetchById(id) } catch { notFound() }`.** This reports an outage as a 404, which breaks the spec. The docs separate expected errors (not found) from uncaught exceptions, which go to error boundaries (`docs/01-app/01-getting-started/10-error-handling.md`).
3. **Make `fetchById` return `null` for malformed ids.** This changes `GET /api/recipes/:id` from 400 to 404, leaves it inconsistent with `deleteById`, and is out of scope.
4. **Wrap `fetchById` itself in `cache`.** This changes an existing export with no benefit to its only current caller, a Route Handler, which runs outside a render where `cache` does nothing.
5. **Fetch `GET /api/recipes/[id]` from the page.** The docs advise against fetching your own Route Handlers from Server Components: it adds an HTTP round trip and needs an absolute URL.

### D3. Page shape: inline `params` type, `notFound()` on `null`, and `<H1>` only

```tsx
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  return { title: recipe.name, description: recipe.description };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  return <H1>{recipe.name}</H1>;
}
```

- **Props type.** `{ params: Promise<{ id: string }> }` is the primary example in `docs/01-app/03-api-reference/03-file-conventions/page.md`. It is also the pattern CLAUDE.md documents and the existing route handler uses. `PageProps<'/recipes/[id]'>` is documented too and would check the route literal. But it exists only after `next dev`, `next build` or `next typegen` writes `.next/` (which is gitignored), and nothing in the codebase uses it yet. Adopting it should be a codebase-wide decision.
- **Type narrowing.** `notFound()` is typed `never`, so `recipe` narrows to `RecipeDocument` after the guard and the UI pass never null-checks it. Optional fields stay optional: `image`, `nutrition`, `preparationTimes`, `tags`, `contributorId`. `image` can also be `{ source: 'upload', key }`, which nothing resolves to a URL yet; existing components render only `source: 'url'`.
- **`notFound()` in both functions.** The docs allow `notFound()` in `generateMetadata` (`docs/01-app/03-api-reference/04-functions/generate-metadata.md` → Returns). Guarding both keeps each one correct on its own if the other later changes.
- **Heading.** The `H1` atom is used with default variants, because the atomic-design rule keeps primitive elements in atoms. There is no wrapper element and there are no classes; layout belongs to the UI pass.
- **Metadata values.** A plain `title` string is enough: the root layout's `title: 'Recipe Cart'` has no template, so the tab reads exactly the recipe name. `description` is a required field of at most 280 characters (the schema's limit), which is a good size for a meta description.

### D4. No route-segment config and no `generateStaticParams`

A dynamic segment without `generateStaticParams` renders at request time (`docs/01-app/01-getting-started/04-linking-and-navigating.md`). The root layout's `headers()` would force request time anyway. Together these give the spec's "reflects the recipe as currently stored" requirement without any code. They also mean creating or deleting a recipe needs no `revalidatePath` for this route.

_Alternatives:_

- `generateStaticParams` (with `dynamicParams`). This needs a database during `next build` plus a revalidation strategy for edits. Not warranted.
- `export const dynamic = 'force-dynamic'`. Redundant today and only adds noise.

### D5. Keep Next.js's built-in not-found and error UI for now

`notFound()` renders Next.js's default 404 inside the root layout. An uncaught error renders the default error page with a 500 status. Custom `not-found.tsx`, `error.tsx` and `loading.tsx` are UI, so they are left for the UI pass.

### D6. No `server-only`, no DTO, no taint APIs

- **`server-only`.** Next.js handles the import internally and installing it is optional. But adding it to `src/lib/db/*` would break the `tsx` scripts that load these modules outside Next.js: plain Node resolves the npm package, which is not installed, and if it were installed its non-react-server entry would throw. The `mongodb` import already prevents client bundling.
- **DTO.** The data layer returns the full `RecipeDocument`, as `listAll()` already does for the home page. A recipe has no secret fields, and nothing passes it to a Client Component yet. See Risks.

## Risks / Trade-offs

- **[A Client Component can't take the document as-is]** → `_id` is an `ObjectId` class instance, and only serialisable props can cross the server→client boundary (`docs/01-app/01-getting-started/05-server-and-client-components.md`). React logs an error in dev and sends the `toJSON()` string, so the prop's declared type is wrong. In the UI pass, pass plain fields (`recipe.ingredients`, `recipe._id.toString()`), or introduce a serialisable view type at that point. `createdAt` is a `Date`, which React serialises.
- **[Adding `loading.tsx` later turns 404s into 200s]** → Once a Suspense fallback streams, the status code is already sent. `notFound()` then renders the not-found UI with `noindex` but cannot change the status (`docs/01-app/03-api-reference/03-file-conventions/loading.md` → Status Codes). The spec's HTTP 404 holds only while nothing above the page streams. The docs recommend `loading.tsx` for dynamic routes, so if the UI pass adds it, either revise those requirements to "not-found page + `noindex`" or confirm the recipe exists before the boundary.
- **[Navigation to the page waits on the server]** → Without `loading.tsx`, dynamic routes are not prefetched, so a card click shows nothing until the server render finishes (`docs/01-app/01-getting-started/04-linking-and-navigating.md`). This is acceptable for groundwork on a local database, and it is the first thing for the UI pass to revisit.
- **[Verifying the 500 path in dev]** → The dev database client caches a rejected connection promise (docs/create-recipe-form.md §11.9). After an outage, every request keeps failing until `npm run dev` is restarted, and the first failure takes about 30 s (the driver's default server-selection timeout). Expect both when testing the 500 scenario.
- **[Private recipes are viewable by id]** → This is the same exposure the home list already has, and there is no auth yet. `getRecipe` is where the check goes once auth exists.
- **[Two URLs for one recipe]** → `ObjectId` parsing ignores case, so an uppercase id renders the same recipe as the lowercase link. Harmless; canonicalise later if SEO ever matters.
- **[Production connection churn (pre-existing)]** → Each production request still opens one Mongo client that is never closed, just like the home page does. Memoisation stops this page from opening two. Fixing the client lifecycle is out of scope.

## Migration Plan

Additive only: no data migration, environment variables or config changes. To roll back, delete `src/app/recipes/[id]/` and the `getRecipe` export.
