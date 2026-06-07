'use server';

/**
 * Server action wired to the create form's `action` prop.
 *
 * Foundational stub: for now it only proves the submit pipeline fires. The real
 * implementation is intentionally left as TODOs so the form (frontend) can be
 * built out first. When server-side validation error display is needed, switch
 * the signature to `(prevState, formData)` and read it via `useActionState` in a
 * client `RecipeForm`, passing the result to the Form's `validationErrors` prop.
 */
export async function createRecipe(formData: FormData) {
  // Observable in the dev server log so we can confirm the action runs and see
  // which field names actually made it into the submission.
  console.log('createRecipe payload:', Object.fromEntries(formData));

  // TODO: Parse FormData into a Recipe (src/models/recipe). Watch out for:
  //   - Numbers arrive as strings -> coerce (servings, preparationTimes, nutrition).
  //   - Array fields (ingredients, steps, tags) need an agreed FormData
  //     convention: repeated names read via formData.getAll('step'), or indexed
  //     keys like `ingredient[0].name` reassembled here.
  // TODO: Validate against recipe-validation-schema.json before persisting
  //       (no Zod for now — manual checks or a shared validator).
  // TODO: Set the server-owned fields: schemaVersion (CURRENT_SCHEMA_VERSION),
  //       createdAt, and contributorId (from auth/session once that exists).
  // TODO: Insert into the `recipes` collection via src/lib/db, then
  //       redirect('/recipes/<id>') and revalidate as needed.
}
