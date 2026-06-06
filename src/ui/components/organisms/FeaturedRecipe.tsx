import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/ui/components/atoms/Badge';
import { H1 } from '@/ui/components/atoms/H1';
import type { RecipeDocument } from '@/models/recipe';

interface FeaturedRecipeProps {
  recipe: RecipeDocument;
  badge?: string;
}

export function FeaturedRecipe({
  recipe,
  badge = 'Seasonal Special',
}: FeaturedRecipeProps) {
  const imageSrc = recipe.image?.source === 'url' ? recipe.image.url : null;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[16/7]">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={recipe.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center gap-4 p-6 sm:p-10 md:p-14">
        <div className="flex max-w-xl flex-col gap-4">
          <Badge variant="seasonal" className="self-start">
            {badge}
          </Badge>
          <H1 weight="strong" className="text-text-on-dark m-0 tracking-tight">
            {recipe.name}
          </H1>
          <p className="text-text-on-dark/90 m-0 max-w-md">
            {recipe.description}
          </p>
          {/* TODO(a11y): no visible focus-visible ring on the CTA Link — only the browser default. */}
          <Link
            href={`/recipes/${recipe._id.toString()}`}
            className="bg-cta text-text-on-dark hover:bg-primary-800 mt-2 inline-flex h-10 items-center gap-2 self-start rounded-lg px-4 text-sm font-medium transition"
          >
            View Full Recipe
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
