import { submit, listAll } from '@/lib/db/recipes';
import { parseRecipe, RecipeValidationError } from '@/models/recipe/parse';

/**
 * Creates a new recipe in the recipes collection.
 *
 * The body is untrusted and `request.json()` is typed `any`, so it must go
 * through parseRecipe before reaching submit() — otherwise a malformed body
 * type-checks as a Recipe and is inserted as-is. Bad input is a 400; only a
 * genuine persistence failure is a 500.
 *
 * @param request
 */
export async function POST(request: Request) {
  let recipe;
  try {
    recipe = parseRecipe(await request.json());
  } catch (reason) {
    const message =
      reason instanceof RecipeValidationError
        ? reason.message
        : 'Request body must be valid JSON';
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    const result = await submit(recipe);
    return Response.json({ id: result.insertedId }, { status: 201 });
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';
    console.error(message);

    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * Lists all recipes in the recipes collection
 */
export async function GET() {
  try {
    const result = await listAll();
    return Response.json(result);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';
    console.error(message);

    return Response.json({ error: message }, { status: 500 });
  }
}
