import { UserRoundPen } from 'lucide-react';
export function AccountButton() {
  return (
    <button type="button" aria-label="Account">
      <UserRoundPen color="var(--color-cta)" />
    </button>
  );
}
