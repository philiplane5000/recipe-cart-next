import { getDb } from '@/lib/db/client';
import type { InsertOneResult } from 'mongodb';
import type { Recipe } from '@/models/recipe';

interface RecipeSubmission extends Recipe {
  createdAt: Date;
}

/**
 * Reads a recipe submission from the request body and inserts it into the recipes collections
 * @throws {Error} If required fields are missing
 * @throws {writeError | writeConcernError} If the insert fails due to errors w/ write or write concern
 * @param request
 */
export async function submit(
  request: Request,
): Promise<InsertOneResult<Recipe>> {
  // TODO: Explore Zod for production or consider a type guard
  const body = (await request.json()) as Recipe;

  // Basic validation throw any errors for handlers to catch
  if (!body.name || !body.ingredients?.length) {
    throw new Error('Name and ingredients are required');
  }

  const db = await getDb();
  return db.collection<RecipeSubmission>('recipes').insertOne({
    ...body,
    createdAt: new Date(),
  });
}
