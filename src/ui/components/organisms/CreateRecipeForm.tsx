'use client';
import { Form } from 'react-aria-components';
import { Button } from '@/ui/components/atoms/Button';
import { TextField } from '@/ui/components/atoms/TextField';

export interface CreateRecipeFormProps {
  /**
   * Server action that ultimately persists the recipe. Injected by the page so
   * this organism stays decoupled from any specific route. When server-side
   * validation error display is needed, change this to a `(prevState, formData)`
   * action and read it here with `useActionState`, passing the result to the
   * Form's `validationErrors` prop.
   */
  action: (formData: FormData) => void | Promise<void>;
}

/**
 * ONE <Form> for the whole recipe; each visual card is a <fieldset>. Fields map
 * to the Recipe model (src/models/recipe) and validation schema
 * (src/models/recipe/schema/recipe-validation-schema.json).
 *
 * Server-owned fields are NOT inputs: _id, createdAt, schemaVersion, contributorId.
 *
 * Most controls below are TODO stubs — only Title is built today, using the
 * existing TextField atom. The remaining controls (a multi-line text area,
 * number fields, a visibility selector, repeatable rows) are the frontend work
 * to fill in.
 */
export function CreateRecipeForm({ action }: CreateRecipeFormProps) {
  return (
    <Form
      action={action}
      validationBehavior="native"
      className="flex flex-col gap-6"
    >
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
          {/* TODO: description (required) — multi-line, needs a TextArea-based
              field control. name="description", isRequired. */}
        </div>
      </fieldset>

      {/* Details — servings (required), visibility (required), preparationTimes (optional) */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Details
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* TODO: servings (required) — NumberField, integer >= 1. name="servings". */}
          {/* TODO: visibility (required) — RadioGroup or Select of
              'private' | 'public', default 'private'. name="visibility". */}
          {/* TODO: preparationTimes (optional) — three NumberFields in minutes:
              cook, prep, total. Schema requires all three together if provided. */}
        </div>
      </fieldset>

      {/* Ingredients — required, array of { name, quantity, unit, notes? } */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Ingredients
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* TODO: repeatable ingredient rows (add/remove). Each row:
              name (text, required), quantity (number, required),
              unit (text, required), notes (text, optional).
              Decide the FormData array convention (indexed names vs getAll). */}
        </div>
      </fieldset>

      {/* Steps — required, ordered array of strings */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Steps
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* TODO: repeatable, ordered step rows (add/remove/reorder). Each
              step is a string. name="step" read via getAll, or indexed. */}
        </div>
      </fieldset>

      {/* ---- Optional sections ---- */}

      {/* Nutrition (optional) — per-serving numbers */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Nutrition <span className="text-text-muted">(optional)</span>
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* TODO: NumberFields for calories, carbohydrates, fat, protein,
              saturatedFat, sodium, sugar. All optional. */}
        </div>
      </fieldset>

      {/* Tags (optional) — array of strings */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Tags <span className="text-text-muted">(optional)</span>
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* TODO: tag input — array of strings. name="tag" read via getAll,
              or a dedicated tags control. */}
        </div>
      </fieldset>

      {/* Image (optional) — oneOf: upload (S3 key) | external url */}
      <fieldset className="border-line bg-surface-raised rounded-2xl border p-6">
        <legend className="text-text-secondary px-2 text-sm font-medium">
          Image <span className="text-text-muted">(optional)</span>
        </legend>
        <div className="flex flex-col gap-4 pt-2">
          {/* TODO: image is oneOf — an upload (source:'upload', S3 key) OR an
              external url (source:'url', url). Build an uploader and/or a URL
              field and map to RecipeImage. */}
        </div>
      </fieldset>

      <div className="flex justify-end">
        <Button type="submit">Save recipe</Button>
      </div>
    </Form>
  );
}
