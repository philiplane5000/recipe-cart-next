import Link from 'next/link';
import { heading } from '@/ui/variants/heading.variants';

export function Brand() {
  return (
    <Link href="/">
      <span className={heading({ size: 'h3' })}>The Editorial Kitchen</span>
    </Link>
  );
}
