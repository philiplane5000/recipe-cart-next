import { ObjectId } from 'mongodb';
import type { InsertOneResult, WithoutId } from 'mongodb';
import { getDb } from '@/lib/db/client';
import { CURRENT_SCHEMA_VERSION } from '@/models/recipe';
import type { RecipeInput, RecipeDocument } from '@/models/recipe';

/**
 * Inserts a recipe into the recipes collection.
 *
 * Deliberately performs **no validation**. The collection's `$jsonSchema` is the
 * single authority, so a bad document must reach it and be refused with a code-121
 * error that `describeDocumentValidationFailure` can explain. An early guard here
 * would throw a plain Error instead, which callers can only report as a 500.
 *
 * `schemaVersion` and `createdAt` are set AFTER the spread, so a caller cannot
 * supply them.
 *
 * @returns the result of the insert operation
 * @throws a code-121 error when the document fails collection validation
 * @throws {writeError | writeConcernError} If the insert fails due to errors w/ write or write concern
 * @param recipe
 */
export async function submit(
  recipe: RecipeInput,
): Promise<InsertOneResult<RecipeDocument>> {
  const db = await getDb();
  return db.collection<WithoutId<RecipeDocument>>('recipes').insertOne({
    ...recipe,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: new Date(),
  });
}

/**
 * Fetches a single recipe by its MongoDB document ID
 * @returns the recipe document, or null if not found
 * @throws {Error} If the id is not a valid ObjectId
 * @param id
 */
export async function fetchById(id: string): Promise<RecipeDocument | null> {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid recipe id: ${id}`);
  }

  const db = await getDb();
  return db
    .collection<RecipeDocument>('recipes')
    .findOne({ _id: new ObjectId(id) });
}

/**
 * Deletes a single recipe by its MongoDB document ID
 * @returns true if deleted, false if no document matched
 * @throws {Error} If the id is not a valid ObjectId
 * @param id
 */
export async function deleteById(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid recipe id: ${id}`);
  }

  const db = await getDb();
  const result = await db
    .collection<RecipeDocument>('recipes')
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

/**
 * Lists all recipes in the recipes collection
 * @returns an array of recipe documents
 */
export async function listAll(): Promise<RecipeDocument[]> {
  const db = await getDb();
  return db.collection<RecipeDocument>('recipes').find({}).toArray();
}
