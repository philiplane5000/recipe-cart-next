'use client';
import { useState } from 'react';
import { NumberField } from '@/ui/components/atoms/NumberField';

export interface PreparationTimesFieldProps {
  /**
   * Seed prep/cook on mount, to restore what was submitted after a failed save.
   * Read only on mount — the caller remounts via `key` to re-seed. Seeding also
   * fixes what React Aria's form-reset propagation would otherwise blank: the
   * reset restores each field to its mount-time value, so an empty mount meant
   * the user's minutes were wiped (see CreateRecipeSubmittedValues).
   */
  defaultPrep?: string;
  defaultCook?: string;
}

/**
 * Prep / cook / total minutes. Prep and cook are controlled inputs; total is
 * derived read-only. Fill-either semantics: entering just one counts the other
 * as 0 and shows the sum, so total is present whenever at least one is — the
 * server (createRecipe) applies the same rule authoritatively. Both editable
 * fields clamp at 0 via NumberField, so total is never negative.
 */
export function PreparationTimesField({
  defaultPrep,
  defaultCook,
}: PreparationTimesFieldProps = {}) {
  const [prep, setPrep] = useState(defaultPrep ?? '');
  const [cook, setCook] = useState(defaultCook ?? '');

  const toNum = (raw: string) =>
    raw.trim() !== '' && Number.isFinite(Number(raw)) ? Number(raw) : null;
  const prepNum = toNum(prep);
  const cookNum = toNum(cook);
  const total =
    prepNum != null || cookNum != null
      ? String((prepNum ?? 0) + (cookNum ?? 0))
      : '';

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-text text-sm font-medium">
        Preparation times{' '}
        <span className="text-text-secondary font-normal">
          (minutes, optional)
        </span>
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField
          name="prepMinutes"
          label="Prep"
          value={prep}
          onChange={setPrep}
        />
        <NumberField
          name="cookMinutes"
          label="Cook"
          value={cook}
          onChange={setCook}
        />
        <NumberField
          name="totalMinutes"
          label="Total"
          value={total}
          isReadOnly
          description="Auto-calculated (prep + cook)"
        />
      </div>
    </fieldset>
  );
}
