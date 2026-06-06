import Image from 'next/image';
import Link from 'next/link';
import { tv, type VariantProps } from 'tailwind-variants';
import { H3 } from '@/ui/components/atoms/H3';
import type { RecipeDocument } from '@/models/recipe';

const card = tv({
  slots: {
    root: 'group flex flex-col gap-3',
    imageWrap: 'relative w-full overflow-hidden rounded-2xl bg-surface-warm',
    image:
      'object-cover transition-transform duration-500 group-hover:scale-[1.03]',
    meta: 'text-xs font-semibold uppercase tracking-wider text-text-secondary',
  },
  variants: {
    size: {
      large: { imageWrap: 'aspect-[2/1]' },
      small: { imageWrap: 'aspect-square' },
    },
  },
  defaultVariants: { size: 'small' },
});

type RecipeCardSize = NonNullable<VariantProps<typeof card>['size']>;

interface RecipeCardProps {
  recipe: RecipeDocument;
  size?: RecipeCardSize;
}

const SIZES: Record<RecipeCardSize, string> = {
  large: '(min-width: 768px) 66vw, 100vw',
  small: '(min-width: 768px) 33vw, 100vw',
};

function formatMeta(recipe: RecipeDocument): string {
  const parts: string[] = [];
  const tag = recipe.tags?.[0];
  if (tag) parts.push(tag);
  const prep = recipe.preparationTimes?.prep;
  if (prep) parts.push(`${prep} min prep`);
  return parts.join(' • ');
}

export function RecipeCard({ recipe, size = 'small' }: RecipeCardProps) {
  const styles = card({ size });
  const meta = formatMeta(recipe);
  const imageSrc = recipe.image?.source === 'url' ? recipe.image.url : null;

  return (
    // TODO(a11y): no visible focus-visible ring on the Link — keyboard users get only the browser default.
    // TODO(a11y): aria-label here overrides the link's accessible name, so the meta line ("Appetizer · 15 min prep") is not announced. Decide if meta should be discoverable or remain decorative.
    <Link
      href={`/recipes/${recipe._id.toString()}`}
      aria-label={recipe.name}
      className={styles.root()}
    >
      <div className={styles.imageWrap()}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={recipe.name}
            fill
            sizes={SIZES[size]}
            className={styles.image()}
          />
        )}
      </div>
      {meta && <div className={styles.meta()}>{meta}</div>}
      <H3 size="h5" weight="strong" className="m-0 tracking-tight">
        {recipe.name}
      </H3>
    </Link>
  );
}
