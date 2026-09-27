'use client';
import { useState } from 'react';
import { NumberField } from '@/ui/components/atoms/NumberField';

/**
 * Prep / cook / total minutes.
 *
 * The only controlled fields in the form, and only because the total has to react
 * to them. Being controlled changes nothing about submission — React Aria still
 * renders a real input carrying `name` and `value`, so `readRecipeForm` reads them
 * like any other field.
 *
 * **Total is not a form field.** It carries no `name`, so it is never submitted;
 * `toRecipeInput` computes it authoritatively. There is no client-supplied total
 * to forge and nothing for the two to disagree about.
 *
 * Fill-either semantics: entering just one counts the other as 0 and shows the
 * sum, so a total is present whenever at least one is. The schema applies the
 * same rule.
 *
 * Takes no props: validity is the platform's, and any database-reported message is
 * routed to these inputs by `name` from the form's `validationErrors`.
 */
export function PreparationTimesField() {
  const [prep, setPrep] = useState('');
  const [cook, setCook] = useState('');

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
          name="preparationTimes.prep"
          label="Prep"
          value={prep}
          onChange={setPrep}
        />
        <NumberField
          name="preparationTimes.cook"
          label="Cook"
          value={cook}
          onChange={setCook}
        />
        {/* No `name`: derived for display, never submitted. */}
        <NumberField
          label="Total"
          value={total}
          isReadOnly
          description="Auto-calculated (prep + cook)"
        />
      </div>
    </fieldset>
  );
}
