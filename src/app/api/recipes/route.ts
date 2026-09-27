import {
  describeDocumentValidationFailure,
  toMessages,
} from '@/lib/db/documentValidation';
import { listAll, submit } from '@/lib/db/recipes';
import { normalizeRecipeBody } from '@/models/recipe/normalize';
import type { RecipeInput } from '@/models/recipe';

/**
 * Creates a new recipe in the recipes collection.
 *
 * The body is untrusted and `request.json()` is typed `any`, so it is never
 * believed: `normalizeRecipeBody` shapes it without judging it, and the
 * collection's `$jsonSchema` decides whether it is storable. That is the same
 * authority the create form answers to, so neither write path can persist what the
 * other would reject.
 *
 * Bad input is a 422 naming the failing rules; only a genuine persistence failure
 * is a 500.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = normalizeRecipeBody(await request.json());
  } catch {
    return Response.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 },
    );
  }

  try {
    // Cast, not trust: the collection validator is what actually checks this.
    // The cast keeps submit()'s signature honest for its other caller.
    const result = await submit(body as RecipeInput);
    return Response.json({ id: result.insertedId }, { status: 201 });
  } catch (reason) {
    const issues = describeDocumentValidationFailure(reason);
    if (issues) {
      return Response.json(
        { error: 'Recipe failed validation', details: toMessages(issues) },
        { status: 422 },
      );
    }

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
