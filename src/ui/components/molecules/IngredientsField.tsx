'use client';
import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/ui/components/atoms/Button';
import { NumberField } from '@/ui/components/atoms/NumberField';
import { TextField } from '@/ui/components/atoms/TextField';

/**
 * Repeatable ingredient rows (name / quantity / unit / notes) with add & remove.
 *
 * Inputs are uncontrolled: the DOM holds the values and `readRecipeForm` lifts them
 * out on submit. Rows are keyed by a **stable id** so React keeps each row's DOM
 * (and therefore its typed values) across a removal, while each input's `name` comes
 * from the **render index** so the submitted keys stay contiguous — which is what
 * `readRecipeForm`'s probe requires. React rewrites the `name` attribute on
 * re-render, so a removal renumbers the survivors correctly.
 *
 * Validity is the platform's: `isRequired` renders a native `required`, so the
 * browser blocks submission and React Aria shows the message through `<FieldError>`.
 * Nothing is passed in and no error state is tracked here.
 *
 * At least one row is always present (the schema requires >= 1 ingredient), so the
 * last remaining row's remove control is disabled.
 */
export function IngredientsField() {
  const nextId = useRef(1);
  const [rowIds, setRowIds] = useState<number[]>([0]);

  return (
    <div className="flex flex-col gap-3">
      {rowIds.map((id, index) => (
        <div key={id} className="border-line rounded-xl border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-text-secondary text-xs font-medium">
              Ingredient {index + 1}
            </span>
            <Button
              variant="quiet"
              onPress={() =>
                setRowIds((ids) =>
                  ids.length > 1 ? ids.filter((x) => x !== id) : ids,
                )
              }
              isDisabled={rowIds.length === 1}
              aria-label={`Remove ingredient ${index + 1}`}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              name={`ingredients.${index}.name`}
              label="Name"
              placeholder="e.g., Heirloom tomatoes"
              isRequired
            />
            <TextField
              name={`ingredients.${index}.unit`}
              label="Unit"
              placeholder="optional — e.g., cups"
            />
            {/* inputMode="decimal" is load-bearing: it sets step="any", without
                which the browser rejects a fractional quantity (see NumberField). */}
            <NumberField
              name={`ingredients.${index}.quantity`}
              label="Quantity"
              inputMode="decimal"
              placeholder="e.g., 2"
              isRequired
            />
            <TextField
              name={`ingredients.${index}.notes`}
              label="Notes"
              placeholder="optional"
            />
          </div>
        </div>
      ))}
      <div>
        <Button
          variant="secondary"
          onPress={() => setRowIds((ids) => [...ids, nextId.current++])}
          aria-label="Add ingredient"
        >
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
