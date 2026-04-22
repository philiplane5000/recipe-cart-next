import { FooterLink } from '@/ui/components/atoms/FooterLink';

export function LegalLinks() {
  return (
    <div className="flex items-center gap-6">
      <FooterLink href="#">Privacy Policy</FooterLink>
      <FooterLink href="#">Terms of Service</FooterLink>
      <FooterLink href="#">Cookie Policy</FooterLink>
    </div>
  );
}
