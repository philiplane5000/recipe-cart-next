import { submit, listAll } from '@/lib/db/recipes';

/**
 * Creates a new recipe in the recipes collection
 * @param request
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submit(body);
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
