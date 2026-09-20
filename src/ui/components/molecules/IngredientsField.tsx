'use client';
import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Ingredient } from '@/models/recipe';
import { Button } from '@/ui/components/atoms/Button';
import { NumberField } from '@/ui/components/atoms/NumberField';
import { TextField } from '@/ui/components/atoms/TextField';

export interface IngredientsFieldProps {
  /**
   * Rows to seed on mount, used to restore what the user typed after a failed
   * submit. Row ids start at the seed index, so `defaultItems[id]` addresses
   * the right seed and rows added later (id >= length) get no seed. Only read
   * on mount — the caller remounts via `key` to re-seed.
   */
  defaultItems?: Ingredient[];
}

/**
 * Repeatable ingredient rows (name / quantity / unit / notes) with add & remove.
 * Inputs are uncontrolled and read from FormData on submit: every row always
 * emits all four fields under the same repeated names, so the server can zip the
 * parallel `formData.getAll(...)` arrays by index. See createRecipe in
 * src/app/create/actions.ts. At least one row is always present (ingredients are
 * required), so the last remaining row's remove control is disabled.
 */
export function IngredientsField({ defaultItems }: IngredientsFieldProps = {}) {
  const seedCount = defaultItems?.length ?? 0;
  const nextId = useRef(Math.max(seedCount, 1));
  const [rowIds, setRowIds] = useState<number[]>(() =>
    seedCount ? defaultItems!.map((_, i) => i) : [0],
  );

  const addRow = () => setRowIds((ids) => [...ids, nextId.current++]);
  const removeRow = (id: number) =>
    setRowIds((ids) => (ids.length > 1 ? ids.filter((x) => x !== id) : ids));

  return (
    <div className="flex flex-col gap-3">
      {rowIds.map((id, index) => {
        const seed = defaultItems?.[id];
        return (
          <div key={id} className="border-line rounded-xl border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-text-secondary text-xs font-medium">
                Ingredient {index + 1}
              </span>
              <Button
                variant="quiet"
                onPress={() => removeRow(id)}
                isDisabled={rowIds.length === 1}
                aria-label={`Remove ingredient ${index + 1}`}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                name="ingredientName"
                label="Name"
                placeholder="e.g., Heirloom tomatoes"
                defaultValue={seed?.name}
                isRequired
              />
              <TextField
                name="ingredientUnit"
                label="Unit"
                placeholder="optional — e.g., cups"
                defaultValue={seed?.unit}
              />
              <NumberField
                name="ingredientQuantity"
                label="Quantity"
                inputMode="decimal"
                placeholder="e.g., 2"
                defaultValue={seed ? String(seed.quantity) : undefined}
                isRequired
              />
              <TextField
                name="ingredientNotes"
                label="Notes"
                placeholder="optional"
                defaultValue={seed?.notes}
              />
            </div>
          </div>
        );
      })}
      <div>
        <Button
          variant="secondary"
          onPress={addRow}
          aria-label="Add ingredient"
        >
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
