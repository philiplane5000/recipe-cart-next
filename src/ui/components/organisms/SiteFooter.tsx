import { Copyright } from '@/ui/components/molecules/Copyright';
import { LegalLinks } from '@/ui/components/molecules/LegalLinks';

export function SiteFooter() {
  return (
    <div className="flex h-full items-center justify-between">
      <Copyright />
      <LegalLinks />
    </div>
  );
}
