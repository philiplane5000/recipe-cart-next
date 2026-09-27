/**
 * Shapes an untrusted request body into the document the database stores.
 *
 * > 🔒 **This function never rejects and never throws.** It shapes what it
 * > recognises and passes everything else through **unchanged**, so the collection
 * > validator sees the offending value and explains it. Write
 * > `typeof v === 'string' ? v.trim() : v`, never `v.trim()`.
 *
 * That rule is what makes the architecture work: validation lives in exactly one
 * place (`recipe-validation-schema.json`), and this module's only job is the work a
 * schema cannot do — trimming, dropping blanks, omitting empty optionals, deriving
 * the total, and defaulting `visibility`. See docs/create-recipe-form.md §5.
 *
 * `toRecipeInput` (src/models/recipe/form.ts) is the same contract for the create
 * form, whose values are already known to be strings.
 */

type Body = Record<string, unknown>;

const isRecord = (value: unknown): value is Body =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Trims strings, leaves anything else alone for the validator to judge. */
const trimmed = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Copies `key` across only when it survives trimming, so an optional field that
 * arrived as `""` is omitted rather than stored — the schema's `minLength: 1`
 * would otherwise reject a blank unit, which means "no unit", not "invalid".
 */
function copyOptionalString(from: Body, to: Body, key: string): void {
  const value = trimmed(from[key]);
  if (typeof value === 'string') {
    if (value) to[key] = value;
    return;
  }
  // Not a string at all — pass it through so bsonType reports it.
  if (value !== undefined) to[key] = value;
}

function normalizeIngredient(value: unknown): unknown {
  if (!isRecord(value)) return value;
  const row: Body = { ...value };
  row.name = trimmed(row.name);
  // quantity is deliberately NOT coerced: a numeric string is a caller error the
  // validator should name, not something to quietly fix.
  delete row.unit;
  delete row.notes;
  copyOptionalString(value, row, 'unit');
  copyOptionalString(value, row, 'notes');
  return row;
}

/** Drops blank entries from a string array, passing non-arrays through. */
function normalizeStringList(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value
    .map(trimmed)
    .filter((entry) => (typeof entry === 'string' ? entry !== '' : true));
}

/**
 * Recomputes `total` from `prep` + `cook` rather than trusting the caller — a
 * supplied total is trivially inconsistent with its parts. Left untouched unless
 * both are numbers, so a bad type still reaches the validator.
 */
function normalizePreparationTimes(value: unknown): unknown {
  if (!isRecord(value)) return value;
  const { prep, cook } = value;
  if (typeof prep !== 'number' || typeof cook !== 'number') return value;
  return { ...value, prep, cook, total: prep + cook };
}

/**
 * @param input an untrusted JSON body (`request.json()` is typed `any`)
 * @returns the same data, shaped for storage. Still `unknown`: whether it is a
 *   valid recipe is the collection validator's call, not this function's.
 */
export function normalizeRecipeBody(input: unknown): unknown {
  if (!isRecord(input)) return input;
  const body: Body = { ...input };

  // Server-owned. Taken from the caller they would either be overwritten by
  // submit() anyway or produce a confusing type error, so drop them outright.
  delete body._id;
  delete body.createdAt;
  delete body.schemaVersion;

  body.name = trimmed(body.name);
  body.description = trimmed(body.description);

  // The only default: there is no visibility UI and no per-user ownership yet, so
  // an omitted visibility means private rather than invalid.
  if (body.visibility == null) body.visibility = 'private';

  if (Array.isArray(body.ingredients)) {
    body.ingredients = body.ingredients.map(normalizeIngredient);
  }
  if ('steps' in body) body.steps = normalizeStringList(body.steps);
  if ('tags' in body) {
    const tags = normalizeStringList(body.tags);
    // An emptied list is the same as no list; the key is optional.
    if (Array.isArray(tags) && tags.length === 0) delete body.tags;
    else body.tags = tags;
  }
  if ('preparationTimes' in body) {
    body.preparationTimes = normalizePreparationTimes(body.preparationTimes);
  }

  delete body.contributorId;
  copyOptionalString(input, body, 'contributorId');

  return body;
}
