'use client';
import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/ui/components/atoms/Button';
import { NumberField } from '@/ui/components/atoms/NumberField';
import { TextField } from '@/ui/components/atoms/TextField';

/**
 * Repeatable ingredient rows (name / quantity / unit / notes) with add & remove.
 * Inputs are uncontrolled and read from FormData on submit: every row always
 * emits all four fields under the same repeated names, so the server can zip the
 * parallel `formData.getAll(...)` arrays by index. See createRecipe in
 * src/app/create/actions.ts. At least one row is always present (ingredients are
 * required), so the last remaining row's remove control is disabled.
 */
export function IngredientsField() {
  const nextId = useRef(1);
  const [rowIds, setRowIds] = useState<number[]>(() => [0]);

  const addRow = () => setRowIds((ids) => [...ids, nextId.current++]);
  const removeRow = (id: number) =>
    setRowIds((ids) => (ids.length > 1 ? ids.filter((x) => x !== id) : ids));

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
              isRequired
            />
            <TextField
              name="ingredientUnit"
              label="Unit"
              placeholder="e.g., cups"
              isRequired
            />
            <NumberField
              name="ingredientQuantity"
              label="Quantity"
              inputMode="decimal"
              placeholder="e.g., 2"
              isRequired
            />
            <TextField
              name="ingredientNotes"
              label="Notes"
              placeholder="optional"
            />
          </div>
        </div>
      ))}
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
