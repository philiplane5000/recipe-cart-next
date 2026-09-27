'use client';
import { useActionState } from 'react';
import { Form as RACForm } from 'react-aria-components';
import { DESCRIPTION_MAX_LENGTH } from '@/models/recipe';
import {
  CREATE_RECIPE_INITIAL_STATE,
  type CreateRecipeState,
} from '@/models/recipe/form';
import { Button } from '@/ui/components/atoms/Button';
import { NumberField } from '@/ui/components/atoms/NumberField';
import { TextArea } from '@/ui/components/atoms/TextArea';
import { TextField } from '@/ui/components/atoms/TextField';
import { IngredientsField } from '@/ui/components/molecules/IngredientsField';
import { PreparationTimesField } from '@/ui/components/molecules/PreparationTimesField';
import { StringListField } from '@/ui/components/molecules/StringListField';

export interface CreateRecipeFormProps {
  /**
   * `useActionState`-shaped server action that persists the recipe. Injected by the
   * page so this organism stays decoupled from any specific route — an edit page can
   * pass `updateRecipe` with the same signature.
   *
   * Resolves to the next state on failure, or never returns (it redirects) on
   * success.
   */
  action: (
    prevState: CreateRecipeState,
    formData: FormData,
  ) => Promise<CreateRecipeState>;
}

/** The six macro/micro fields, which differ only by label. */
const NUTRITION_MACROS = [
  { name: 'nutrition.carbohydrates', label: 'Carbs (g)' },
  { name: 'nutrition.fat', label: 'Fat (g)' },
  { name: 'nutrition.protein', label: 'Protein (g)' },
  { name: 'nutrition.saturatedFat', label: 'Saturated fat (g)' },
  { name: 'nutrition.sodium', label: 'Sodium (mg)' },
  { name: 'nutrition.sugar', label: 'Sugar (g)' },
] as const;

/**
 * ONE <Form> for the whole recipe; each visual card is a <fieldset>. Fields map to
 * the Recipe model (src/models/recipe), and the authority on what is storable is the
 * collection's `$jsonSchema` (src/models/recipe/schema/).
 *
 * Server-owned fields are NOT inputs: _id, createdAt, schemaVersion, contributorId.
 *
 * ## How validation works
 *
 * **The platform does it.** `validationBehavior="native"` means React Aria renders a
 * real `required` attribute for `isRequired`, so the browser blocks submission,
 * reports the first problem, and React Aria focuses the offending input for us
 * (`useFormValidation`'s `onInvalid` → `getFirstInvalidInput(form)`, plus
 * `preventDefault()` to suppress the browser's own tooltip). Messages render through
 * each atom's `<FieldError>`.
 *
 * So this component tracks **no** validation state of its own — no error map, no
 * touched set, no blur or change handlers.
 *
 * ## How submission works
 *
 * The React Aria Forms guide's server-function pattern, verbatim: the action is wired
 * to `<Form action={formAction}>` via `useActionState`, and its returned `errors`
 * (keyed by input `name`) go to `validationErrors`, which routes each message to its
 * field. React serialises the form and the action receives the `FormData` on the
 * server, so nothing here reads the DOM and `isPending` comes from the hook.
 *
 * > ⚠️ **React resets this form once the action settles** — on any settle, including
 * > a returned error. That is inherent to the `action` prop: `startHostTransition`
 * > wraps a non-null action with `requestFormReset`. Every field is uncontrolled with
 * > no `defaultValue`, so a failed save clears the whole form and the user retypes.
 * >
 * > That is an accepted trade: native constraints catch everything a user can
 * > actually fix, so a returned error means either schema drift or an outage. To
 * > preserve input instead, echo each submitted value back in `CreateRecipeState` and
 * > seed every field with `defaultValue` — the pattern the guide's server-validation
 * > example shows. See docs/create-recipe-form.md §8.
 *
 * Visibility is intentionally NOT surfaced yet — there's no auth or per-user
 * ownership, so "public" would be meaningless; `toRecipeInput` hard-wires 'private'.
 * Resurface the RadioGroup atom here once auth lands.
 *
 * Deferred to a follow-up PR: image (optional in the schema, so save works without
 * it).
 */
export function CreateRecipeForm({ action }: CreateRecipeFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    CREATE_RECIPE_INITIAL_STATE,
  );

  return (
    <RACForm
      // native (not aria): React Aria then renders real `required` attributes and
      // lets the browser block submission and manage focus. The schema in the
      // database is the authority; these attributes are the inline UX for it.
      validationBehavior="native"
      action={formAction}
      validationErrors={state.errors}
      className="flex flex-col gap-6"
    >
      {state.formError && (
        <div
          role="alert"
          className="border-error/40 bg-error/10 text-error-text rounded-xl border px-4 py-3 text-sm"
        >
          {state.formError}
        </div>
      )}

      {/* Basics — name (required), description (required) */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Basics
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          <TextField
            name="name"
            label="Title"
            placeholder="e.g., Heirloom Tomato & Basil Galette"
            isRequired
          />
          <TextArea
            name="description"
            label="Description"
            placeholder="A short blurb — what makes this dish worth cooking?"
            maxLength={DESCRIPTION_MAX_LENGTH}
            isRequired
          />
        </div>
      </fieldset>

      {/* Details — servings (required), preparationTimes (optional).
          Visibility is omitted for now; see the component doc above. */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Details
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* min/step are enforced by the browser here, and mirror the schema's
              `minimum: 1` and `multipleOf: 1`. */}
          <NumberField
            name="servings"
            label="Servings"
            placeholder="e.g., 4"
            min={1}
            isRequired
          />
          <PreparationTimesField />
        </div>
      </fieldset>

      {/* Ingredients — required, array of { name, quantity, unit?, notes? } */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Ingredients
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          <IngredientsField />
        </div>
      </fieldset>

      {/* Steps — required, ordered array of strings */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Steps
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          <StringListField
            name="steps"
            itemLabel="Step"
            placeholder="Describe this step…"
            multiline
            ordered
            required
          />
        </div>
      </fieldset>

      {/* ---- Optional sections ---- */}

      {/* Nutrition (optional) — per-serving numbers */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Nutrition <span className="text-text-secondary">(optional)</span>
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* Calories leads as the headline total (nutrition-label convention),
              divided from the six macro/micro components below, which fill an even
              3×2 (2×3 on mobile) grid so no lone input orphans a row. */}
          <div className="border-line border-b pb-4">
            <NumberField
              name="nutrition.calories"
              label="Total Calories"
              placeholder="kcal per serving"
              className="sm:max-w-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {NUTRITION_MACROS.map(({ name, label }) => (
              <NumberField
                key={name}
                name={name}
                label={label}
                inputMode="decimal"
              />
            ))}
          </div>
        </div>
      </fieldset>

      {/* Tags (optional) — array of strings */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Tags <span className="text-text-secondary">(optional)</span>
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          <StringListField
            name="tags"
            itemLabel="Tag"
            placeholder="e.g., vegetarian"
          />
        </div>
      </fieldset>

      {/* Image (optional, oneOf upload | url) is intentionally deferred to a
          follow-up PR. It's optional in the schema, so recipes save without it. */}

      <div className="flex justify-end">
        {/* isPending only — RAC blocks the press, swaps type to "button" so it
            can't re-submit, and sets aria-disabled while keeping it focusable.
            Adding isDisabled would render the native `disabled` attribute and drop
            focus to <body> mid-submit. */}
        <Button type="submit" isPending={isPending}>
          Save recipe
        </Button>
      </div>
    </RACForm>
  );
}
