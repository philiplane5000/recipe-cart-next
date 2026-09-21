import type { Ingredient } from '@/models/recipe';

/**
 * The scalar fields, echoed back as the strings that were submitted. Kept as
 * strings rather than parsed numbers so a field the user left blank comes back
 * blank instead of as "0".
 */
export type CreateRecipeScalarValues = {
  name: string;
  description: string;
  servings: string;
  prepMinutes: string;
  cookMinutes: string;
  calories: string;
  carbohydrates: string;
  fat: string;
  protein: string;
  saturatedFat: string;
  sodium: string;
  sugar: string;
};

/**
 * Everything needed to rebuild the form after a failed submit: the repeatable
 * groups plus every scalar field.
 *
 * All of it has to be echoed back, because React 19 resets the form once the
 * action settles and React Aria re-emits that reset through every field. Being
 * "controlled" is NOT protection: react-aria's useTextField registers
 * `useFormReset(ref, props.defaultValue ?? initialValue, setValue)`, and
 * useControlledState invokes `onChange` even in controlled mode ("Always
 * trigger a re-render, even when controlled"). A field that mounted empty is
 * therefore restored to empty — which silently wiped title, description,
 * servings, nutrition and prep/cook on every failed save. Seeding each field
 * from these values makes that same reset restore the submitted text instead.
 */
export type CreateRecipeSubmittedValues = {
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  scalars: CreateRecipeScalarValues;
};

/**
 * useActionState state for the create-recipe form.
 *
 * Per-field validation stays on the client (native + RAC `validate`) — it's
 * inline and, unlike a server round-trip, doesn't trip React 19's automatic
 * form reset. This state carries a form-level `error` for outcomes the client
 * can't know (a persistence/validator failure from submit()), plus the values
 * needed to rebuild the fields that reset wipes.
 */
export type CreateRecipeState = {
  error?: string;
  values?: CreateRecipeSubmittedValues;
  /**
   * Bumped on every failed attempt. Used as a React `key` on the form body so
   * every field remounts and picks up fresh `defaultValue`s — re-rendering
   * alone wouldn't, since `defaultValue` is only read on mount.
   */
  attempt: number;
};

export const CREATE_RECIPE_INITIAL_STATE: CreateRecipeState = { attempt: 0 };
