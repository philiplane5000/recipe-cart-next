'use client';
import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/ui/components/atoms/Button';
import { TextArea } from '@/ui/components/atoms/TextArea';
import { TextField } from '@/ui/components/atoms/TextField';

export interface StringListFieldProps {
  /** Repeated input name; read server-side via formData.getAll(name). */
  name: string;
  /** Singular noun for a row, used in aria-labels and the add button. */
  itemLabel: string;
  placeholder?: string;
  /** Render a TextArea instead of a single-line TextField. */
  multiline?: boolean;
  /** Prefix each row with its 1-based position (for ordered lists like steps). */
  ordered?: boolean;
  /** Require at least one non-empty entry; keeps a minimum of one row. */
  required?: boolean;
  /**
   * Rows to seed on mount, used to restore what the user typed after a failed
   * submit. Row ids start at the seed index, so `defaultItems[id]` addresses
   * the right seed and rows added later (id >= length) get no seed. Only read
   * on mount — the caller remounts via `key` to re-seed.
   */
  defaultItems?: string[];
}

/**
 * Repeatable list of single-string rows with add & remove — shared by Steps
 * (multiline, ordered, required) and Tags (single-line, optional). Inputs are
 * uncontrolled; the server reads them in document order via
 * formData.getAll(name) and drops blanks. When `required`, one row is always
 * present and each row is marked required so native validation guarantees ≥1.
 */
export function StringListField({
  name,
  itemLabel,
  placeholder,
  multiline = false,
  ordered = false,
  required = false,
  defaultItems,
}: StringListFieldProps) {
  const seedCount = defaultItems?.length ?? 0;
  const nextId = useRef(Math.max(seedCount, 1));
  const [rowIds, setRowIds] = useState<number[]>(() =>
    seedCount ? defaultItems!.map((_, i) => i) : [0],
  );

  const addRow = () => setRowIds((ids) => [...ids, nextId.current++]);
  const removeRow = (id: number) =>
    setRowIds((ids) =>
      // Optional lists may empty out entirely; required lists keep one row.
      ids.length > (required ? 1 : 0) ? ids.filter((x) => x !== id) : ids,
    );

  return (
    <div className="flex flex-col gap-2">
      {rowIds.map((id, index) => (
        <div key={id} className="flex items-start gap-2">
          {ordered && (
            <span className="text-text-secondary mt-2.5 w-5 shrink-0 text-right text-sm tabular-nums">
              {index + 1}.
            </span>
          )}
          {multiline ? (
            <TextArea
              name={name}
              aria-label={`${itemLabel} ${index + 1}`}
              placeholder={placeholder}
              defaultValue={defaultItems?.[id]}
              isRequired={required}
              rows={2}
              className="flex-1"
            />
          ) : (
            <TextField
              name={name}
              aria-label={`${itemLabel} ${index + 1}`}
              placeholder={placeholder}
              defaultValue={defaultItems?.[id]}
              isRequired={required}
              className="flex-1"
            />
          )}
          <Button
            variant="quiet"
            onPress={() => removeRow(id)}
            isDisabled={required && rowIds.length === 1}
            aria-label={`Remove ${itemLabel} ${index + 1}`}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ))}
      <div>
        <Button
          variant="secondary"
          onPress={addRow}
          aria-label={`Add ${itemLabel.toLowerCase()}`}
        >
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
