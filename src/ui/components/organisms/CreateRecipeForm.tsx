'use client';
import { useActionState, useState } from 'react';
import { Form as RACForm } from 'react-aria-components';
import {
  CREATE_RECIPE_INITIAL_STATE,
  type CreateRecipeState,
} from '@/app/create/types';
import { DESCRIPTION_MAX_LENGTH } from '@/models/recipe';
import { Button } from '@/ui/components/atoms/Button';
import { NumberField } from '@/ui/components/atoms/NumberField';
import { TextArea } from '@/ui/components/atoms/TextArea';
import { TextField } from '@/ui/components/atoms/TextField';
import { IngredientsField } from '@/ui/components/molecules/IngredientsField';
import { PreparationTimesField } from '@/ui/components/molecules/PreparationTimesField';
import { StringListField } from '@/ui/components/molecules/StringListField';

export interface CreateRecipeFormProps {
  /**
   * useActionState-shaped server action that persists the recipe. Injected by
   * the page so this organism stays decoupled from any specific route. Resolves
   * to a form-level error on a persistence failure, or never returns (redirects)
   * on success.
   */
  action: (
    prevState: CreateRecipeState,
    formData: FormData,
  ) => Promise<CreateRecipeState>;
}

/**
 * ONE <Form> for the whole recipe; each visual card is a <fieldset>. Fields map
 * to the Recipe model (src/models/recipe) and validation schema
 * (src/models/recipe/schema/recipe-validation-schema.json).
 *
 * Server-owned fields are NOT inputs: _id, createdAt, schemaVersion, contributorId.
 *
 * Fields wired: name, description, servings, preparationTimes, ingredients,
 * steps, nutrition, tags. Repeatable groups (ingredients/steps/tags) are
 * molecules that emit uncontrolled inputs under repeated names; createRecipe
 * (src/app/create/actions.ts) reassembles them.
 *
 * Visibility is intentionally NOT surfaced yet — there's no auth or per-user
 * ownership, so "public" would be meaningless. The action defaults an absent
 * visibility to 'private'. Resurface the RadioGroup atom here once auth lands.
 *
 * Errors: per-field validation is client-side (native `isRequired`/`type` plus
 * RAC `validate`) so it's inline and never triggers React 19's post-action form
 * reset. useActionState surfaces only server-side persistence failures, shown as
 * a banner; `isPending` drives the submit button.
 *
 * Form reset: a returned (error) state resets *uncontrolled* fields. Title and
 * description are controlled here so they survive it; the NumberFields are
 * internally controlled too, so they persist as well. The remaining uncontrolled
 * fields (ingredient text, steps, tags) still reset — a fuller preservation pass
 * is a follow-up if it proves annoying.
 *
 * Deferred to a follow-up PR: image (optional in the schema, so save works
 * without it).
 */
export function CreateRecipeForm({ action }: CreateRecipeFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    CREATE_RECIPE_INITIAL_STATE,
  );
  // Controlled so their values survive the post-action form reset (see above).
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <RACForm
      action={formAction}
      validationBehavior="native"
      className="flex flex-col gap-6"
    >
      {state.error && (
        <div
          role="alert"
          className="border-error/40 bg-error/10 text-error-text rounded-xl border px-4 py-3 text-sm"
        >
          {state.error}
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
            value={title}
            onChange={setTitle}
            isRequired
          />
          <TextArea
            name="description"
            label="Description"
            placeholder="A short blurb — what makes this dish worth cooking?"
            maxLength={DESCRIPTION_MAX_LENGTH}
            value={description}
            onChange={setDescription}
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
          <NumberField
            name="servings"
            label="Servings"
            placeholder="e.g., 4"
            isRequired
            // Floor is 0 (NumberField); this adds the business minimum of 1.
            validate={(value) =>
              value && Number(value) < 1 ? 'Servings must be at least 1.' : null
            }
          />
          <PreparationTimesField />
        </div>
      </fieldset>

      {/* Ingredients — required, array of { name, quantity, unit, notes? } */}
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
            name="step"
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
              divided from the six macro/micro components below, which fill an
              even 3×2 (2×3 on mobile) grid so no lone input orphans a row. */}
          <div className="border-line border-b pb-4">
            <NumberField
              name="calories"
              label="Total Calories"
              placeholder="kcal per serving"
              className="sm:max-w-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <NumberField
              name="carbohydrates"
              label="Carbs (g)"
              inputMode="decimal"
            />
            <NumberField name="fat" label="Fat (g)" inputMode="decimal" />
            <NumberField
              name="protein"
              label="Protein (g)"
              inputMode="decimal"
            />
            <NumberField
              name="saturatedFat"
              label="Saturated fat (g)"
              inputMode="decimal"
            />
            <NumberField
              name="sodium"
              label="Sodium (mg)"
              inputMode="decimal"
            />
            <NumberField name="sugar" label="Sugar (g)" inputMode="decimal" />
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
            name="tag"
            itemLabel="Tag"
            placeholder="e.g., vegetarian"
          />
        </div>
      </fieldset>

      {/* Image (optional, oneOf upload | url) is intentionally deferred to a
          follow-up PR. It's optional in the schema, so recipes save without it. */}

      <div className="flex justify-end">
        <Button type="submit" isPending={isPending} isDisabled={isPending}>
          Save recipe
        </Button>
      </div>
    </RACForm>
  );
}
