'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { submit } from '@/lib/db/recipes';
import { CURRENT_SCHEMA_VERSION } from '@/models/recipe';
import type {
  Ingredient,
  NutritionInfo,
  Recipe,
  RecipeVisibility,
} from '@/models/recipe';
import type { CreateRecipeState } from './types';

/** Parse a FormData value to a finite number, or undefined when blank/invalid. */
function toNumber(value: FormDataEntryValue | null): number | undefined {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  if (trimmed === '') return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
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
 * Server action wired to the create form via useActionState. Parses the
 * submitted FormData into a Recipe, persists it, then redirects home
 * (revalidating so it appears in the listing). Repeatable groups arrive as
 * repeated field names and are read with getAll — ingredients as four
 * index-aligned parallel arrays (every row emits all four), steps/tags as
 * ordered string lists with blanks dropped.
 *
 * Per-field validation lives on the client (native + RAC `validate`). This
 * action's only user-facing failure mode is persistence: if submit() or the
 * collection validator throws, it returns a form-level `error` for the banner
 * instead of crashing the route. On success it redirects (never returns).
 */
export async function createRecipe(
  _prevState: CreateRecipeState,
  formData: FormData,
): Promise<CreateRecipeState> {
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const servings = toNumber(formData.get('servings')) ?? 0;
  // Visibility is not surfaced in the form yet (no auth / per-user ownership),
  // so this defaults to 'private' when the field is absent. It already honors a
  // 'public' value, so re-adding the control later needs no change here.
  const visibility: RecipeVisibility =
    formData.get('visibility') === 'public' ? 'public' : 'private';

  // Ingredients: parallel getAll arrays, index-aligned because every rendered
  // row emits all four inputs (see IngredientsField). Fully-empty rows dropped.
  const names = formData.getAll('ingredientName');
  const quantities = formData.getAll('ingredientQuantity');
  const units = formData.getAll('ingredientUnit');
  const notes = formData.getAll('ingredientNotes');
  const ingredients: Ingredient[] = names
    .map((rawName, i): Ingredient => {
      const note = String(notes[i] ?? '').trim();
      return {
        name: String(rawName).trim(),
        quantity: toNumber(quantities[i]) ?? 0,
        unit: String(units[i] ?? '').trim(),
        ...(note ? { notes: note } : {}),
      };
    })
    .filter((ing) => ing.name !== '' || ing.unit !== '' || ing.quantity !== 0);

  // Steps / tags: repeated inputs read in document order; blanks dropped.
  const steps = formData
    .getAll('step')
    .map((s) => String(s).trim())
    .filter(Boolean);
  const tags = formData
    .getAll('tag')
    .map((t) => String(t).trim())
    .filter(Boolean);

  // preparationTimes: the schema requires cook/prep/total together. Fill-either
  // semantics — if either prep or cook is given, the other defaults to 0 and
  // total is recomputed here authoritatively (the read-only totalMinutes field
  // is derived client-side and intentionally ignored). Omitted only when both
  // prep and cook are blank.
  const prep = toNumber(formData.get('prepMinutes'));
  const cook = toNumber(formData.get('cookMinutes'));
  const preparationTimes =
    prep != null || cook != null
      ? { prep: prep ?? 0, cook: cook ?? 0, total: (prep ?? 0) + (cook ?? 0) }
      : undefined;

  // nutrition: every field independently optional; include only those provided,
  // and omit the object entirely when none were.
  const nutrition: NutritionInfo = {};
  for (const key of NUTRITION_KEYS) {
    const value = toNumber(formData.get(key));
    if (value != null) nutrition[key] = value;
  }
  const hasNutrition = Object.keys(nutrition).length > 0;

  const recipe: Recipe = {
    name,
    description,
    servings,
    visibility,
    ingredients,
    steps,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...(tags.length ? { tags } : {}),
    ...(preparationTimes ? { preparationTimes } : {}),
    ...(hasNutrition ? { nutrition } : {}),
  };

  // submit() throws on missing name/ingredients or a collection-validator
  // failure. Catch it and surface a friendly banner rather than crashing the
  // route; the raw reason is logged server-side for debugging. redirect() must
  // stay OUT of the try/catch — it signals via a thrown error.
  try {
    await submit(recipe);
  } catch (reason) {
    console.error('createRecipe failed:', reason);
    return { error: "Sorry, we couldn't save your recipe. Please try again." };
  }

  revalidatePath('/');
  // TODO(follow-up): redirect to /recipes/<insertedId> once a detail page exists.
  redirect('/');
}
