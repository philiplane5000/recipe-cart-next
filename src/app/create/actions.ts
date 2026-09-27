'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  describeDocumentValidationFailure,
  toFieldErrors,
  toMessages,
} from '@/lib/db/documentValidation';
import { submit } from '@/lib/db/recipes';
import {
  readRecipeForm,
  toRecipeInput,
  type CreateRecipeState,
} from '@/models/recipe/form';

/**
 * Persists a recipe and redirects home.
 *
 * Signature and return shape follow React Aria's Forms guide for server functions:
 * `(prevState, formData)`, wired to `<Form action={formAction}>` through
 * `useActionState`, returning `{ errors }` keyed by input `name` for the form's
 * `validationErrors` prop.
 *
 * Taking `FormData` rather than a typed object is what makes this safe from any
 * caller: a server action is a public HTTP endpoint, and `readRecipeForm` reads only
 * the keys it knows with a `''` fallback, so a crafted payload cannot produce a
 * value of an unexpected type further down.
 *
 * ## Validation
 *
 * There is no validation step here. `toRecipeInput` shapes the values and the insert
 * is attempted; the collection's `$jsonSchema` is the authority and the only thing
 * that can reject it. A code-121 rejection is translated into per-field messages —
 * see docs/create-recipe-form.md §5.
 *
 * ## Return value
 *
 * On failure: the next `CreateRecipeState`. On success this function never returns —
 * `redirect()` throws a control-flow signal that Next catches, which is why it must
 * stay OUTSIDE the try/catch around `submit()`; catching it would swallow the
 * navigation and report a phantom save failure.
 */
export async function createRecipe(
  _prevState: CreateRecipeState,
  formData: FormData,
): Promise<CreateRecipeState> {
  try {
    await submit(toRecipeInput(readRecipeForm(formData)));
  } catch (reason) {
    console.error('createRecipe failed:', reason);

    const issues = describeDocumentValidationFailure(reason);
    if (issues) {
      // Native constraints on the inputs should have caught anything the user can
      // fix, so reaching here means those and the schema have drifted. Report every
      // message in the banner too — a path matching no input would otherwise be
      // dropped by `errors` alone, hiding the drift.
      return {
        errors: toFieldErrors(issues),
        formError: `The recipe couldn't be saved — ${toMessages(issues).join(' ')}`,
      };
    }
    return {
      errors: {},
      formError: "Sorry, we couldn't save your recipe. Please try again.",
    };
  }

  revalidatePath('/');
  // TODO(follow-up): redirect to /recipes/<insertedId> once a detail page exists.
  redirect('/');
}
