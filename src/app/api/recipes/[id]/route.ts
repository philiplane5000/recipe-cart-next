import { fetchById, deleteById } from '@/lib/db/recipes';

/**
 * Returns a single recipe by its MongoDB document ID
 * @param _request
 * @param params
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const recipe = await fetchById(id);

    if (!recipe) {
      return Response.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return Response.json(recipe);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';
    console.error(message);

    return Response.json({ error: message }, { status: 400 });
  }
}

/**
 * Deletes a single recipe by its MongoDB document ID
 * @param _request
 * @param params
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const deleted = await deleteById(id);

    if (!deleted) {
      return Response.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';
    console.error(message);

    return Response.json({ error: message }, { status: 400 });
  }
}
