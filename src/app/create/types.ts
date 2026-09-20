import type { Ingredient } from '@/models/recipe';

/**
 * The repeatable groups, echoed back so a failed submit can re-seed them.
 * Everything else in the form is controlled (title/description in the organism,
 * NumberFields internally) and survives React 19's post-action reset on its own.
 */
export type CreateRecipeSubmittedValues = {
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
};

/**
 * useActionState state for the create-recipe form.
 *
 * Per-field validation stays on the client (native + RAC `validate`) — it's
 * inline and, unlike a server round-trip, doesn't trip React 19's automatic
 * form reset. This state carries a form-level `error` for outcomes the client
 * can't know (a persistence/validator failure from submit()), plus the values
 * needed to rebuild the uncontrolled fields that reset wipes.
 */
export type CreateRecipeState = {
  error?: string;
  values?: CreateRecipeSubmittedValues;
  /**
   * Bumped on every failed attempt. Used as a React `key` on the repeatable
   * molecules so they remount and pick up fresh `defaultValue`s — re-rendering
   * alone wouldn't, since `defaultValue` is only read on mount.
   */
  attempt: number;
};

export const CREATE_RECIPE_INITIAL_STATE: CreateRecipeState = { attempt: 0 };
