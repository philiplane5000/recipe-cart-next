import {
  type Ingredient,
  type NutritionInfo,
  type RecipeInput,
} from '@/models/recipe';

/**
 * The create/edit recipe form: the shape of its values, how to lift them out of a
 * submitted form, and how to map them to the shape the database stores.
 *
 * **There is no validation here.** Per-field rules are native HTML constraints on
 * the inputs (`isRequired`, `min`, `step`, `maxLength`), and the authority on what
 * is actually storable is the collection's `$jsonSchema`. See
 * docs/create-recipe-form.md §5.
 *
 * Every numeric field is held as a **string**, exactly as the input element reports
 * it ('' when untouched). That keeps an untouched field distinguishable from a
 * deliberate 0, and puts coercion in exactly one place — `toRecipeInput`.
 */

/** Scalar fields, as the strings their inputs report. */
export type RecipeFormScalars = {
  name: string;
  description: string;
  servings: string;
};

export type RecipeFormIngredient = {
  name: string;
  quantity: string;
  unit: string;
  notes: string;
};

export type RecipeFormValues = RecipeFormScalars & {
  preparationTimes: { prep: string; cook: string };
  ingredients: RecipeFormIngredient[];
  /**
   * Plain strings, and the input names match: `steps.0`, `tags.1`. Keeping the
   * path identical to the stored path is what lets a database-reported issue at
   * `steps.0` land on the input that produced it.
   */
  steps: string[];
  tags: string[];
  nutrition: Record<keyof NutritionInfo, string>;
};

/**
 * Indexing `values.nutrition` with these keys is what keeps the form's nutrition
 * fields and `NutritionInfo` in sync: drop one from either side and this module
 * stops compiling.
 */
export const NUTRITION_KEYS = [
  'calories',
  'carbohydrates',
  'fat',
  'protein',
  'saturatedFat',
  'sodium',
  'sugar',
] as const satisfies readonly (keyof NutritionInfo)[];

/**
 * Lifts a submitted form into `RecipeFormValues`.
 *
 * The **shape** is guaranteed by construction — every key is read with a `''`
 * fallback — so the return type is honest about structure. Nothing here judges the
 * values.
 *
 * Row counts are **probed** (`ingredients.0.*`, `ingredients.1.*`, … until a gap)
 * rather than passed in, which keeps this a pure function of the FormData. The form
 * renders row names from the render index, so those keys stay contiguous; a list
 * the user emptied simply yields `[]`, with no special case.
 *
 * Fields the form does not submit are absent by design and must stay that way:
 * total minutes is derived for display only, and `visibility` is set in
 * `toRecipeInput`.
 */
export function readRecipeForm(formData: FormData): RecipeFormValues {
  const field = (key: string) => String(formData.get(key) ?? '');

  const ingredients: RecipeFormIngredient[] = [];
  for (let i = 0; formData.has(`ingredients.${i}.name`); i++) {
    ingredients.push({
      name: field(`ingredients.${i}.name`),
      quantity: field(`ingredients.${i}.quantity`),
      unit: field(`ingredients.${i}.unit`),
      notes: field(`ingredients.${i}.notes`),
    });
  }

  const stringRows = (name: 'steps' | 'tags') => {
    const rows: string[] = [];
    for (let i = 0; formData.has(`${name}.${i}`); i++) {
      rows.push(field(`${name}.${i}`));
    }
    return rows;
  };

  const nutrition = {} as RecipeFormValues['nutrition'];
  for (const key of NUTRITION_KEYS) nutrition[key] = field(`nutrition.${key}`);

  return {
    name: field('name'),
    description: field('description'),
    servings: field('servings'),
    preparationTimes: {
      prep: field('preparationTimes.prep'),
      cook: field('preparationTimes.cook'),
    },
    ingredients,
    steps: stringRows('steps'),
    tags: stringRows('tags'),
    nutrition,
  };
}

const toOptionalNumber = (raw: string): number | undefined =>
  raw.trim() === '' ? undefined : Number(raw);

/**
 * Form values → the document shape. Pure shaping: trims, drops blank rows, omits
 * empty optional keys rather than storing `""`, derives the total, and defaults
 * `visibility`.
 *
 * It does **not** reject anything: a value the user shouldn't have been able to
 * enter is passed through for the collection validator to refuse and explain — the
 * same contract `normalizeRecipeBody` follows for API input.
 *
 * It may assume every field is a string, because its only caller feeds it
 * `readRecipeForm` output and the action reads the `FormData` itself. Widen that and
 * this has to become defensive (`typeof v === 'string' ? v.trim() : v`) to keep the
 * no-throw contract.
 */
export function toRecipeInput(values: RecipeFormValues): RecipeInput {
  const ingredients: Ingredient[] = values.ingredients.map((row) => ({
    name: row.name.trim(),
    quantity: Number(row.quantity),
    ...(row.unit.trim() ? { unit: row.unit.trim() } : {}),
    ...(row.notes.trim() ? { notes: row.notes.trim() } : {}),
  }));

  const steps = values.steps.map((row) => row.trim()).filter(Boolean);
  const tags = values.tags.map((row) => row.trim()).filter(Boolean);

  const prep = toOptionalNumber(values.preparationTimes.prep);
  const cook = toOptionalNumber(values.preparationTimes.cook);
  const preparationTimes =
    prep != null || cook != null
      ? { prep: prep ?? 0, cook: cook ?? 0, total: (prep ?? 0) + (cook ?? 0) }
      : undefined;

  const nutrition: NutritionInfo = {};
  for (const key of NUTRITION_KEYS) {
    const value = toOptionalNumber(values.nutrition[key]);
    if (value != null) nutrition[key] = value;
  }

  return {
    name: values.name.trim(),
    description: values.description.trim(),
    servings: Number(values.servings),
    // No visibility control yet — there's no auth or per-user ownership, so
    // 'public' would be meaningless. See docs/create-recipe-form.md §11.
    visibility: 'private',
    ingredients,
    steps,
    ...(tags.length ? { tags } : {}),
    ...(preparationTimes ? { preparationTimes } : {}),
    ...(Object.keys(nutrition).length ? { nutrition } : {}),
  };
}

/**
 * `useActionState` state for a form-backed write action.
 *
 * Shaped as React Aria's Forms guide prescribes for server functions: the action
 * returns `{ errors }` keyed by input `name`, and the form passes it straight to
 * `<Form validationErrors={…}>`.
 *
 * `formError` is the addition the guide's minimal example has no need for: a save
 * can fail for reasons no single field explains (the database being unreachable),
 * and a message whose key matches no input would otherwise be dropped silently by
 * React Aria.
 *
 * Only the failure path produces a value — the success path redirects.
 */
export type CreateRecipeState = {
  /** Messages keyed by input `name`, for React Aria's `validationErrors`. */
  errors: Record<string, string>;
  /** Form-level message for the banner. */
  formError?: string;
};

export const CREATE_RECIPE_INITIAL_STATE: CreateRecipeState = { errors: {} };
