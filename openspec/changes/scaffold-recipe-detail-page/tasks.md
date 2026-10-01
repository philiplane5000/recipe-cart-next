# Tasks

Checks that call the running app assume Mongo and the dev server are up (`docker compose up -d`, then `npm run dev`). `$ID` is the id of any stored recipe, for example:

```bash
ID=$(curl -s localhost:3000/api/recipes | node -pe 'JSON.parse(require("fs").readFileSync(0))[0]._id')
```

## 1. Data layer: a request-memoised recipe read

- [ ] 1.1 In `src/lib/db/recipes/index.ts`, import `cache` from `react` and export `getRecipe(id)` as in design D2. It is wrapped in `cache`, resolves `null` without touching the database when `ObjectId.isValid(id)` is false, and otherwise returns `fetchById(id)`. Give it a JSDoc block in the module's style that states its two differences from `fetchById`: it is memoised per request, and a malformed id resolves `null` rather than throwing. Verify: `npx tsc --noEmit` and `npm run lint` exit 0, and `git diff src/lib/db/recipes/index.ts` contains only added lines (`submit`, `fetchById`, `deleteById` and `listAll` untouched).

## 2. Recipe detail route

- [ ] 2.1 Create `src/app/recipes/[id]/page.tsx` as a Server Component following design D3. Define `type Props = { params: Promise<{ id: string }> }`. The default export `RecipePage` awaits `params`, calls `getRecipe(id)`, calls `notFound()` from `next/navigation` when the result is `null`, and returns only `<H1>{recipe.name}</H1>` using the `H1` atom. Add no wrapper element, no classes, no `'use client'`, no route-segment config and no `generateStaticParams`. Verify:
  - `curl -s -o /dev/null -w '%{http_code}' localhost:3000/recipes/$ID` prints `200`.
  - `curl -s localhost:3000/recipes/$ID | grep -o '<h1[^>]*>[^<]*</h1>'` prints exactly one heading, and its text is that recipe's name.
  - `/recipes/000000000000000000000000`, `/recipes/not-a-recipe` and `/recipes/` followed by 23 hex characters each print `404`, show Next's default not-found page, and log no `Invalid recipe id` error in the dev-server output.
- [ ] 2.2 Add `generateMetadata` to the same file as in design D3. It takes the same `Props`, awaits `params`, calls `getRecipe(id)`, calls `notFound()` on `null`, and returns `{ title: recipe.name, description: recipe.description }` typed `Promise<Metadata>` (`import type { Metadata } from 'next'`). Verify: the HTML for `/recipes/$ID` contains a `<title>` with the recipe's name and a `<meta name="description" content="…">` with its description; `/` still has `<title>Recipe Cart</title>`; the three not-found URLs from 2.1 still print `404`.
- [ ] 2.3 Confirm that `generateMetadata` and the page share one database read. Temporarily add a `console.log` inside `getRecipe`'s callback, request `/recipes/$ID` once, and check that the dev-server output shows the log exactly once for that request. Then remove the log. Verify: `git diff src/lib/db/recipes/index.ts` again contains only task 1.1's additions, with no logging left behind.

## 3. Integration checks

- [ ] 3.1 Check freshness and visibility with a throwaway recipe, so seeded data is left alone:
  - Create it with `POST /api/recipes` using the valid body from docs/create-recipe-form.md §12. It is stored as `private`.
  - Confirm `/recipes/<new id>` returns `200` with its name in the `h1`.
  - Rename it with an `updateOne` through `mongosh` (the `docker exec … getSiblingDB("recipes")` form from §12) and confirm the next request shows the new name.
  - Delete it with `curl -X DELETE localhost:3000/api/recipes/<new id>` and confirm the page now returns `404`.
- [ ] 3.2 Check that a load failure is reported as an error:
  - With the dev server running, run `docker compose stop mongodb`. Confirm `/recipes/$ID` returns `500`, not `404`. The first failure takes about 30 s.
  - Run `docker compose start mongodb`, then restart `npm run dev`; the dev client caches the rejected connection (docs/create-recipe-form.md §11.9). Confirm `/recipes/$ID` returns `200` again.
- [ ] 3.3 In a browser on `/`, open the featured recipe's "View Full Recipe" link and at least one grid card. Verify that each lands on that recipe's page, with the recipe's name as both the heading and the tab title.
- [ ] 3.4 Confirm the JSON API is unchanged. Verify: `curl -s -w ' [%{http_code}]' localhost:3000/api/recipes/not-a-recipe` still prints `{"error":"Invalid recipe id: not-a-recipe"} [400]`, and `GET /api/recipes/$ID` still returns `200` with the recipe JSON.
- [ ] 3.5 Run the static checks. Verify:
  - `npm run lint`, `npx tsc --noEmit` and `npm run build` exit 0, and the build's route table lists `/recipes/[id]` as dynamic (`ƒ`).
  - `npx prettier --check src openspec/changes/scaffold-recipe-detail-page` passes.
  - The repo-wide `npm run format:check` already fails on the untracked OpenSpec command and skill files under `.claude/`. That predates this change and is not part of it.
