import Link from 'next/link';
import { UserRoundPen } from 'lucide-react';
import { Brand } from '@/ui/components/molecules/Brand';

export function MainNavigation() {
  return (
    <nav className="grid h-full grid-cols-3">
      <div className="flex items-center justify-start ps-3">
        <Brand />
      </div>
      <div className="flex items-center justify-center gap-6">
        <Link href="/typography">Typography</Link>
        <Link href="/colors">Colors</Link>
        <Link href="/">Recipes</Link>
      </div>
      <div className="flex items-center justify-end gap-6">
        <input
          className="bg-surface-raised/80 flex-1 rounded-sm border border-neutral-500 p-2 text-sm"
          type="search"
          placeholder="Search culinary secrets"
        />
        <button
          type="button"
          disabled
          aria-label="Account"
          className="pe-3 disabled:opacity-50"
        >
          <UserRoundPen color="var(--color-cta)" />
        </button>
      </div>
    </nav>
  );
}
