import { submit } from '@/lib/db/submit';

export async function POST(request: Request) {
  try {
    const result = await submit(request);
    return Response.json({ id: result.insertedId }, { status: 201 });
    // return Response.json({ success: true });
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';
    console.error(message);

    return new Response(message, { status: 500 });
  }
}
