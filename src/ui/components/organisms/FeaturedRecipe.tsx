import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/ui/components/atoms/Badge';
import type { RecipeDocument } from '@/models/recipe';

interface FeaturedRecipeProps {
  recipe: RecipeDocument;
  badge?: string;
}

export function FeaturedRecipe({
  recipe,
  badge = 'Seasonal Special',
}: FeaturedRecipeProps) {
  const imageSrc =
    recipe.image?.source === 'url' ? recipe.image.url : null;

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
          <h1 className="m-0 text-h1 font-bold tracking-tight text-cream-50">
            {recipe.name}
          </h1>
          <p className="m-0 max-w-md text-cream-50/90">{recipe.description}</p>
          <Link
            href={`/recipes/${recipe._id.toString()}`}
            className="mt-2 inline-flex h-10 items-center gap-2 self-start rounded-lg bg-primary-700 px-4 text-sm font-medium text-cream-50 transition hover:bg-primary-800"
          >
            View Full Recipe
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
