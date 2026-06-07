'use client';
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
}: StringListFieldProps) {
  const nextId = useRef(1);
  const [rowIds, setRowIds] = useState<number[]>(() => [0]);

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
              isRequired={required}
              rows={2}
              className="flex-1"
            />
          ) : (
            <TextField
              name={name}
              aria-label={`${itemLabel} ${index + 1}`}
              placeholder={placeholder}
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
            <svg
              viewBox="0 0 20 20"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </Button>
        </div>
      ))}
      <div>
        <Button variant="secondary" onPress={addRow}>
          Add {itemLabel.toLowerCase()}
        </Button>
      </div>
    </div>
  );
}
