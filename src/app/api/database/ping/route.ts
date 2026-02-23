import client from '@/lib/mongodb';

export async function GET() {
  try {
    const result = await client.db('admin').command({ ping: 1 });

    if (result.ok === 1) {
      console.log('Pinged your deployment. Connection successful!');
      return Response.json({ ping: true });
    }

    return Response.json({ ping: false }, { status: 500 });
  } catch (err) {
    console.error(err);
    return Response.json({ ping: false }, { status: 500 });
  }
}
