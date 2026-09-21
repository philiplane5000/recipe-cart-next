import {
  CURRENT_SCHEMA_VERSION,
  DESCRIPTION_MAX_LENGTH,
  type Ingredient,
  type NutritionInfo,
  type Recipe,
  type RecipeImage,
  type RecipeVisibility,
} from '@/models/recipe';

/**
 * Thrown when untrusted input can't be coerced into a Recipe. Callers should
 * map this to a 400 — it means the client sent something wrong, not that we
 * failed.
 */
export class RecipeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecipeValidationError';
  }
}

const fail = (message: string): never => {
  throw new RecipeValidationError(message);
};

function asString(value: unknown, field: string): string {
  if (typeof value !== 'string') fail(`${field} must be a string`);
  return (value as string).trim();
}

/** Finite, non-negative number. Rejects NaN/Infinity and numeric strings. */
function asNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(`${field} must be a finite number`);
  }
  if ((value as number) < 0) fail(`${field} must not be negative`);
  return value as number;
}

function asOptionalNumber(value: unknown, field: string): number | undefined {
  return value == null ? undefined : asNumber(value, field);
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) fail(`${field} must be an array`);
  return (value as unknown[])
    .map((entry, i) => asString(entry, `${field}[${i}]`))
    .filter(Boolean);
}

function parseIngredient(value: unknown, i: number): Ingredient {
  if (typeof value !== 'object' || value === null) {
    fail(`ingredients[${i}] must be an object`);
  }
  const raw = value as Record<string, unknown>;
  const name = asString(raw.name, `ingredients[${i}].name`);
  if (!name) fail(`ingredients[${i}].name is required`);
  const notes =
    raw.notes == null ? '' : asString(raw.notes, `ingredients[${i}].notes`);
  const unit =
    raw.unit == null ? '' : asString(raw.unit, `ingredients[${i}].unit`);
  return {
    name,
    quantity: asNumber(raw.quantity, `ingredients[${i}].quantity`),
    ...(unit ? { unit } : {}),
    ...(notes ? { notes } : {}),
  };
}

/** Mirrors the schema's `image.oneOf`: upload needs `key`, url needs `url`. */
function parseImage(value: unknown): RecipeImage {
  if (typeof value !== 'object' || value === null) {
    fail('image must be an object');
  }
  const raw = value as Record<string, unknown>;
  if (raw.source === 'upload') {
    const key = asString(raw.key, 'image.key');
    if (!key) fail('image.key is required when source is "upload"');
    return { source: 'upload', key };
  }
  if (raw.source === 'url') {
    const url = asString(raw.url, 'image.url');
    if (!url) fail('image.url is required when source is "url"');
    return { source: 'url', url };
  }
  return fail("image.source must be 'upload' or 'url'");
}

const NUTRITION_KEYS = [
  'calories',
  'carbohydrates',
  'fat',
  'protein',
  'saturatedFat',
  'sodium',
  'sugar',
] as const satisfies readonly (keyof NutritionInfo)[];

/**
 * Validates untrusted input (an HTTP body, typically) into a Recipe.
 *
 * This is the boundary that `POST /api/recipes` was missing: `request.json()`
 * is typed `any`, so it satisfies `Recipe` at compile time no matter what it
 * actually contains, and a body with no `visibility` produced a document
 * missing a field both the TS model and the Mongo validator require.
 *
 * `visibility` therefore defaults to 'private' HERE rather than in submit():
 * the DB layer should be able to trust its typed argument, while anything
 * arriving off the wire gets checked. Server-owned fields (_id, createdAt,
 * schemaVersion) are ignored if supplied — submit() sets them.
 *
 * @throws {RecipeValidationError} with a field-specific message.
 */
export function parseRecipe(input: unknown): Recipe {
  if (typeof input !== 'object' || input === null) {
    fail('body must be a JSON object');
  }
  const raw = input as Record<string, unknown>;

  const name = asString(raw.name, 'name');
  if (!name) fail('name is required');

  const description = asString(raw.description, 'description');
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    fail(`description must be at most ${DESCRIPTION_MAX_LENGTH} characters`);
  }

  if (!Array.isArray(raw.ingredients) || raw.ingredients.length === 0) {
    fail('ingredients must be a non-empty array');
  }
  const ingredients = (raw.ingredients as unknown[]).map(parseIngredient);

  const steps = asStringArray(raw.steps, 'steps');
  if (steps.length === 0)
    fail('steps must contain at least one non-empty step');

  if (
    raw.visibility != null &&
    raw.visibility !== 'private' &&
    raw.visibility !== 'public'
  ) {
    fail("visibility must be 'private' or 'public'");
  }
  const visibility = (raw.visibility ?? 'private') as RecipeVisibility;

  const tags = raw.tags == null ? [] : asStringArray(raw.tags, 'tags');

  let preparationTimes: Recipe['preparationTimes'];
  if (raw.preparationTimes != null) {
    const times = raw.preparationTimes as Record<string, unknown>;
    const prep = asNumber(times.prep, 'preparationTimes.prep');
    const cook = asNumber(times.cook, 'preparationTimes.cook');
    // Recomputed rather than trusted, matching createRecipe's behaviour.
    preparationTimes = { prep, cook, total: prep + cook };
  }

  const nutrition: NutritionInfo = {};
  if (raw.nutrition != null) {
    const source = raw.nutrition as Record<string, unknown>;
    for (const key of NUTRITION_KEYS) {
      const value = asOptionalNumber(source[key], `nutrition.${key}`);
      if (value != null) nutrition[key] = value;
    }
  }

  const contributorId =
    raw.contributorId == null
      ? undefined
      : asString(raw.contributorId, 'contributorId');
  const image = raw.image == null ? undefined : parseImage(raw.image);

  return {
    name,
    description,
    servings: asNumber(raw.servings, 'servings'),
    visibility,
    ingredients,
    steps,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...(tags.length ? { tags } : {}),
    ...(preparationTimes ? { preparationTimes } : {}),
    ...(Object.keys(nutrition).length ? { nutrition } : {}),
    ...(contributorId ? { contributorId } : {}),
    ...(image ? { image } : {}),
  };
}
