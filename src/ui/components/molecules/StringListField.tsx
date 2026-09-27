'use client';
import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/ui/components/atoms/Button';
import { TextArea } from '@/ui/components/atoms/TextArea';
import { TextField } from '@/ui/components/atoms/TextField';

export interface StringListFieldProps {
  /**
   * Which `string[]` field of the form this list edits. Inputs are named
   * `steps.0`, `tags.1` — the same path the database stores, so a validator
   * message about `steps.0` lands on the input that produced it.
   */
  name: 'steps' | 'tags';
  /** Singular noun for a row, used in aria-labels and the add button. */
  itemLabel: string;
  placeholder?: string;
  /** Render a TextArea instead of a single-line TextField. */
  multiline?: boolean;
  /** Prefix each row with its 1-based position (for ordered lists like steps). */
  ordered?: boolean;
  /** Keep a minimum of one row, and mark each row required. */
  required?: boolean;
}

/**
 * Repeatable list of single-string rows with add & remove — shared by Steps
 * (multiline, ordered, required) and Tags (single-line, optional).
 *
 * Same uncontrolled, stable-id/render-index arrangement as IngredientsField; see
 * that component's doc for why the two numbers differ.
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
  const [rowIds, setRowIds] = useState<number[]>(() => (required ? [0] : []));

  return (
    <div className="flex flex-col gap-2">
      {rowIds.map((id, index) => {
        const label = `${itemLabel} ${index + 1}`;
        const fieldProps = {
          name: `${name}.${index}`,
          'aria-label': label,
          placeholder,
          isRequired: required,
          className: 'flex-1',
        };
        return (
          <div key={id} className="flex items-start gap-2">
            {ordered && (
              <span className="text-text-secondary mt-2.5 w-5 shrink-0 text-right text-sm tabular-nums">
                {index + 1}.
              </span>
            )}
            {multiline ? (
              <TextArea {...fieldProps} rows={2} />
            ) : (
              <TextField {...fieldProps} />
            )}
            <Button
              variant="quiet"
              onPress={() =>
                setRowIds((ids) =>
                  // Optional lists may empty out entirely; required keep one.
                  ids.length > (required ? 1 : 0)
                    ? ids.filter((x) => x !== id)
                    : ids,
                )
              }
              isDisabled={required && rowIds.length === 1}
              aria-label={`Remove ${label}`}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        );
      })}
      <div>
        <Button
          variant="secondary"
          onPress={() => setRowIds((ids) => [...ids, nextId.current++])}
          aria-label={`Add ${itemLabel.toLowerCase()}`}
        >
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
