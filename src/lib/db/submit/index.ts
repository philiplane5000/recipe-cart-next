import { getDb } from '@/lib/db/client';
import type { InsertOneResult, WithoutId } from 'mongodb';
import { CURRENT_SCHEMA_VERSION } from '@/models/recipe';
import type { Recipe, RecipeDocument } from '@/models/recipe';

/**
 * Inserts a recipe into the recipes collection
 * @throws {Error} If required fields are missing
 * @throws {writeError | writeConcernError} If the insert fails due to errors w/ write or write concern
 * @param recipe
 */
export async function submit(
  recipe: Recipe,
): Promise<InsertOneResult<RecipeDocument>> {
  // Basic validation throw any errors for handlers to catch
  if (!recipe.name || !recipe.ingredients?.length) {
    throw new Error('Name and ingredients are required');
  }

  const db = await getDb();
  return db.collection<WithoutId<RecipeDocument>>('recipes').insertOne({
    ...recipe,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: new Date(),
  });
}
