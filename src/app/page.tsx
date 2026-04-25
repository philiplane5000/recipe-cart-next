import { listAll } from '@/lib/db/recipes';
import { FeaturedRecipe } from '@/ui/components/organisms/FeaturedRecipe';
import { RecipeGrid } from '@/ui/components/organisms/RecipeGrid';

export default async function Home() {
  const recipes = await listAll();

  if (recipes.length === 0) {
    return (
      <div className="py-24 text-center text-text-secondary">
        No recipes yet.
      </div>
    );
  }

  // Placeholder selection rule — random per request while the page is fully dynamic.
  // If this page becomes statically generated or revalidated (ISR/PPR), the "random"
  // pick will freeze until rebuild; replace with a real selection rule before then.
  const featuredIndex = Math.floor(Math.random() * recipes.length);
  const featured = recipes[featuredIndex];
  const rest = recipes.filter((_, i) => i !== featuredIndex);

  return (
    <div className="flex flex-col gap-12 py-6">
      <FeaturedRecipe recipe={featured} />

      <section className="flex flex-col gap-6">
        <header className="flex items-end justify-between">
          <h2 className="m-0 text-h3 font-bold">Recipes</h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Displaying {rest.length} {rest.length === 1 ? 'result' : 'results'}
          </span>
        </header>
        <RecipeGrid recipes={rest} />
      </section>
    </div>
  );
}
