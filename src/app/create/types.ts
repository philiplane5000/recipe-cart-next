/**
 * useActionState state for the create-recipe form.
 *
 * Per-field validation stays on the client (native + RAC `validate`) — it's
 * inline and, unlike a server round-trip, doesn't trip React 19's automatic
 * form reset. This state only carries a form-level `error` for outcomes the
 * client can't know: a persistence/validator failure from submit().
 */
export type CreateRecipeState = {
  error?: string;
};

export const CREATE_RECIPE_INITIAL_STATE: CreateRecipeState = {};
