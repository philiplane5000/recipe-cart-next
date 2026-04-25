import { Brand } from '@/ui/components/molecules/Brand';
import { SearchBar } from '@/ui/components/molecules/SearchBar';
import { AccountButton } from '@/ui/components/atoms/AccountButton';
import { NavLink } from '@/ui/components/atoms/NavLink';

export function MainNavigation() {
  return (
    <nav className="mx-auto grid h-full max-w-7xl grid-cols-3 px-2">
      <div className="flex items-center justify-start">
        <Brand />
      </div>
      <div className="flex items-center justify-start gap-6">
        <NavLink href="/">Recipes</NavLink>
        <NavLink href="/typography">Typography</NavLink>
        <NavLink href="/colors">Colors</NavLink>
      </div>
      <div className="flex items-center justify-end gap-6">
        <SearchBar />
        <AccountButton />
      </div>
    </nav>
  );
}
