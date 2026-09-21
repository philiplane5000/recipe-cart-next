/**
 * Translates MongoDB's document-validation failure (error code 121) into short,
 * readable messages.
 *
 * Mongo reports a nested `errInfo.details` tree describing exactly which
 * `$jsonSchema` rules failed. Surfacing it raw would leak BSON jargon into the
 * UI, so this flattens it into "field — problem" lines.
 *
 * Reaching this at all means input passed parseRecipe but the collection still
 * rejected it — i.e. the two rule sets have drifted. Treat any occurrence as a
 * bug to reconcile, not as routine user error.
 */

/** Max lines surfaced; a wholly malformed document can fail dozens of rules. */
const MAX_REASONS = 4;

const DOCUMENT_VALIDATION_FAILURE = 121;

type Rule = Record<string, unknown>;

const isRecord = (v: unknown): v is Rule =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const asArray = (v: unknown): Rule[] =>
  Array.isArray(v) ? v.filter(isRecord) : [];

const joinPath = (path: string, key: string) => (path ? `${path}.${key}` : key);

/** Renders a leaf rule (one that carries a `reason`) as a single sentence. */
function describeLeaf(rule: Rule, path: string): string {
  const specifiedAs = isRecord(rule.specifiedAs) ? rule.specifiedAs : {};
  const label = path || 'document';

  if (rule.operatorName === 'bsonType' && specifiedAs.bsonType) {
    const want = [specifiedAs.bsonType].flat().join(' or ');
    const got = rule.consideredType ? ` (got ${rule.consideredType})` : '';
    return `${label} must be ${want}${got}`;
  }
  if (rule.operatorName === 'maxLength' && specifiedAs.maxLength != null) {
    return `${label} must be at most ${specifiedAs.maxLength} characters`;
  }
  if (rule.operatorName === 'minimum' && specifiedAs.minimum != null) {
    return `${label} must be at least ${specifiedAs.minimum}`;
  }
  if (rule.operatorName === 'enum' && Array.isArray(specifiedAs.enum)) {
    return `${label} must be one of: ${specifiedAs.enum.join(', ')}`;
  }
  return rule.reason ? `${label}: ${rule.reason}` : `${label} is invalid`;
}

/**
 * Depth-first walk of the errInfo tree, collecting leaf explanations.
 *
 * A rule carries either child rules (`propertiesNotSatisfied`, `details`,
 * `schemaRulesNotSatisfied`) or its own `reason`. The generic `reason` is only
 * used when no child produced something more specific — otherwise an array
 * failure reports both "At least one item did not match" and the real cause.
 */
function walk(rule: Rule, path: string, out: string[]): void {
  if (out.length >= MAX_REASONS) return;
  const before = out.length;

  if (Array.isArray(rule.missingProperties)) {
    for (const prop of rule.missingProperties) {
      if (out.length >= MAX_REASONS) return;
      out.push(`${joinPath(path, String(prop))} is required`);
    }
    return;
  }

  for (const child of asArray(rule.propertiesNotSatisfied)) {
    const childPath = joinPath(path, String(child.propertyName ?? ''));
    const details = asArray(child.details);
    if (details.length === 0) out.push(`${childPath} is invalid`);
    for (const detail of details) walk(detail, childPath, out);
  }

  // `items` failures name the offending element via itemIndex; fold it into
  // the path so nested causes read as `ingredients[1].name`.
  const childPath =
    typeof rule.itemIndex === 'number' ? `${path}[${rule.itemIndex}]` : path;

  for (const key of ['schemaRulesNotSatisfied', 'details'] as const) {
    for (const child of asArray(rule[key])) walk(child, childPath, out);
  }

  if (rule.reason && out.length === before && out.length < MAX_REASONS) {
    out.push(describeLeaf(rule, path));
  }
}

/**
 * @returns readable reasons when `error` is a Mongo document-validation
 *   failure, or `null` for any other error (connection, write concern, …).
 */
export function describeDocumentValidationFailure(
  error: unknown,
): string[] | null {
  if (!isRecord(error) || error.code !== DOCUMENT_VALIDATION_FAILURE) {
    return null;
  }
  const errInfo = isRecord(error.errInfo) ? error.errInfo : undefined;
  const details =
    errInfo && isRecord(errInfo.details) ? errInfo.details : undefined;
  if (!details) return ['the database rejected this document'];

  const reasons: string[] = [];
  walk(details, '', reasons);
  return reasons.length > 0 ? reasons : ['the database rejected this document'];
}
