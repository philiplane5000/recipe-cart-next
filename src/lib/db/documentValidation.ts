/**
 * Translates MongoDB's document-validation failure (error code 121) into issues
 * the UI and the API can show a person.
 *
 * The collection's `$jsonSchema` is the **single authority** on what a valid
 * recipe is — the one boundary nothing can write around, whether it arrives from
 * the create form, `POST /api/recipes`, a script or a shell. So reaching this code
 * is the normal validation path, not a sign of drift.
 *
 * Mongo reports a nested `errInfo.details` tree naming exactly which rules failed.
 * Surfacing it raw leaks BSON jargon ("specified string length was not
 * satisfied"), so this flattens it into `{ path, message }` pairs where:
 *
 * - `path` is dotted and matches the form input's `name` (`ingredients.1.name`),
 *   so the create form can hand them straight to React Aria's `validationErrors`
 *   and each message lands on the field it is about;
 * - `message` is a sentence with the field's human label, not its schema key.
 *
 * Message wording lives here because Mongo reports field *paths* and knows nothing
 * about labels. This is the one place that maps the two.
 */

/**
 * Safety cap on issues surfaced. Mongo does report every failing rule — a wholly
 * malformed document can fail dozens — so this is generous rather than the four a
 * banner could show.
 */
const MAX_ISSUES = 20;

const DOCUMENT_VALIDATION_FAILURE = 121;

export type DocumentValidationIssue = {
  /** Dotted path matching the input's `name`, e.g. `ingredients.1.name`. */
  path: string;
  /** Human sentence, e.g. "Servings must be at least 1." */
  message: string;
};

type Rule = Record<string, unknown>;

const isRecord = (v: unknown): v is Rule =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const asArray = (v: unknown): Rule[] =>
  Array.isArray(v) ? v.filter(isRecord) : [];

const joinPath = (path: string, key: string | number) =>
  path ? `${path}.${key}` : String(key);

/** Leaf field names → the label the user sees on the form. */
const FIELD_LABELS: Record<string, string> = {
  name: 'Title',
  description: 'Description',
  servings: 'Servings',
  visibility: 'Visibility',
  ingredients: 'Ingredients',
  steps: 'Steps',
  tags: 'Tags',
  quantity: 'Quantity',
  unit: 'Unit',
  notes: 'Notes',
  calories: 'Calories',
  carbohydrates: 'Carbs',
  fat: 'Fat',
  protein: 'Protein',
  saturatedFat: 'Saturated fat',
  sodium: 'Sodium',
  sugar: 'Sugar',
  prep: 'Prep time',
  cook: 'Cook time',
  total: 'Total time',
  contributorId: 'Contributor',
  image: 'Image',
  createdAt: 'Created date',
  schemaVersion: 'Schema version',
};

/** Repeatable arrays → the singular noun used for one of its rows. */
const ROW_LABELS: Record<string, string> = {
  ingredients: 'Ingredient',
  steps: 'Step',
  tags: 'Tag',
};

/**
 * A dotted path → the words a person reads. `ingredients.1.name` becomes
 * "Ingredient 2 name", `steps.0` becomes "Step 1", `nutrition.calories` becomes
 * "Calories". Positions are 1-based, matching the numbering the form renders.
 */
function label(path: string): string {
  if (!path) return 'This recipe';
  const parts = path.split('.');
  const row = ROW_LABELS[parts[0]];

  if (row && /^\d+$/.test(parts[1] ?? '')) {
    const position = Number(parts[1]) + 1;
    const leaf = parts[2];
    // Deliberately NOT FIELD_LABELS here: a row's sub-field names are already
    // plain words, and that map is scoped to the recipe's own fields — it would
    // render an ingredient's `name` as "title".
    return leaf ? `${row} ${position} ${leaf}` : `${row} ${position}`;
  }

  // Grouped scalars (`nutrition.calories`, `preparationTimes.prep`) read best as
  // the leaf alone — the group adds nothing the label doesn't already say.
  const leaf = parts[parts.length - 1];
  return FIELD_LABELS[leaf] ?? leaf;
}

/** Plural noun for a `minItems` message: "Add at least one ingredient." */
const rowNoun = (path: string) =>
  (ROW_LABELS[path.split('.').pop() ?? ''] ?? 'item').toLowerCase();

/**
 * Renders one leaf rule as a sentence. Every branch here corresponds to an
 * operator the schema actually uses; the shapes were read off real code-121
 * rejections, not inferred.
 */
function describeLeaf(rule: Rule, path: string): string {
  const specifiedAs = isRecord(rule.specifiedAs) ? rule.specifiedAs : {};
  const subject = label(path);

  switch (rule.operatorName) {
    case 'bsonType': {
      const want = [specifiedAs.bsonType].flat();
      const isNumeric = want.every((t) => t === 'int' || t === 'double');
      if (isNumeric) return `${subject} must be a number.`;
      if (want.length === 1 && want[0] === 'string')
        return `${subject} must be text.`;
      return `${subject} must be ${want.join(' or ')}.`;
    }
    case 'minLength': {
      const min = Number(specifiedAs.minLength ?? 1);
      return min <= 1
        ? `${subject} can’t be empty.`
        : `${subject} must be at least ${min} characters.`;
    }
    case 'maxLength':
      return `${subject} must be at most ${specifiedAs.maxLength} characters.`;
    case 'minimum':
      return `${subject} must be at least ${specifiedAs.minimum}.`;
    case 'maximum':
      return `${subject} must be at most ${specifiedAs.maximum}.`;
    case 'multipleOf':
      return Number(specifiedAs.multipleOf) === 1
        ? `${subject} must be a whole number.`
        : `${subject} must be a multiple of ${specifiedAs.multipleOf}.`;
    case 'minItems': {
      const min = Number(specifiedAs.minItems ?? 1);
      return min === 1
        ? `Add at least one ${rowNoun(path)}.`
        : `Add at least ${min} ${rowNoun(path)}s.`;
    }
    case 'maxItems':
      return `${subject} must have at most ${specifiedAs.maxItems} entries.`;
    case 'enum':
      return Array.isArray(specifiedAs.enum)
        ? `${subject} must be one of: ${specifiedAs.enum.join(', ')}.`
        : `${subject} is not a permitted value.`;
    default:
      return `${subject} is invalid.`;
  }
}

/**
 * Depth-first walk of the errInfo tree, collecting leaf explanations.
 *
 * A rule either names children (`propertiesNotSatisfied`, `details`,
 * `schemaRulesNotSatisfied`) or explains itself. The generic `reason` is used only
 * when no child produced something more specific — otherwise an array failure
 * reports both "At least one item did not match" and the real cause.
 */
function walk(rule: Rule, path: string, out: DocumentValidationIssue[]): void {
  if (out.length >= MAX_ISSUES) return;
  const before = out.length;

  // `required` — the only rule that names several fields at once.
  if (Array.isArray(rule.missingProperties)) {
    for (const property of rule.missingProperties) {
      if (out.length >= MAX_ISSUES) return;
      const childPath = joinPath(path, String(property));
      out.push({
        path: childPath,
        message: `${label(childPath)} is required.`,
      });
    }
    return;
  }

  // `additionalProperties: false` — carries the offending keys and NO `reason`,
  // so without this branch it falls through the tree explaining nothing.
  if (Array.isArray(rule.additionalProperties)) {
    for (const property of rule.additionalProperties) {
      if (out.length >= MAX_ISSUES) return;
      out.push({
        path: joinPath(path, String(property)),
        message: `“${String(property)}” is not a recognised field.`,
      });
    }
    return;
  }

  for (const child of asArray(rule.propertiesNotSatisfied)) {
    const childPath = joinPath(path, String(child.propertyName ?? ''));
    const details = asArray(child.details);
    if (details.length === 0) {
      out.push({ path: childPath, message: `${label(childPath)} is invalid.` });
    }
    for (const detail of details) walk(detail, childPath, out);
  }

  // `items` failures name the offending element via itemIndex. Folding it in as a
  // path SEGMENT (not `[1]`) is what makes the result match an input's `name`.
  const childPath =
    typeof rule.itemIndex === 'number' ? joinPath(path, rule.itemIndex) : path;

  for (const key of ['schemaRulesNotSatisfied', 'details'] as const) {
    for (const child of asArray(rule[key])) walk(child, childPath, out);
  }

  if (rule.operatorName && out.length === before && out.length < MAX_ISSUES) {
    out.push({ path, message: describeLeaf(rule, path) });
  }
}

/**
 * @returns the issues when `error` is a Mongo document-validation failure, or
 *   `null` for any other error (connection, write concern, …) so callers can tell
 *   "your input was wrong" from "we failed".
 */
export function describeDocumentValidationFailure(
  error: unknown,
): DocumentValidationIssue[] | null {
  if (!isRecord(error) || error.code !== DOCUMENT_VALIDATION_FAILURE) {
    return null;
  }
  const errInfo = isRecord(error.errInfo) ? error.errInfo : undefined;
  const details =
    errInfo && isRecord(errInfo.details) ? errInfo.details : undefined;
  const fallback = [
    { path: '', message: 'The database rejected this recipe.' },
  ];
  if (!details) return fallback;

  const issues: DocumentValidationIssue[] = [];
  walk(details, '', issues);
  return issues.length > 0 ? issues : fallback;
}

/** Issues → sentences, for the API's `details` array and the form's banner. */
export const toMessages = (issues: DocumentValidationIssue[]): string[] =>
  issues.map((issue) => issue.message);

/** Issues → a map keyed by input `name`, for React Aria's `validationErrors`. */
export function toFieldErrors(
  issues: DocumentValidationIssue[],
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const { path, message } of issues) {
    if (path && !(path in fieldErrors)) fieldErrors[path] = message;
  }
  return fieldErrors;
}
