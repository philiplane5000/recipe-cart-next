import Link from 'next/link';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

export function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-xs font-semibold tracking-wider text-neutral-500 uppercase hover:opacity-80"
    >
      {children}
    </Link>
  );
}
