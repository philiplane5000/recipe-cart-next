import { RecipeCard } from '@/ui/components/molecules/RecipeCard';
import type { RecipeDocument } from '@/models/recipe';

interface RecipeGridProps {
  recipes: RecipeDocument[];
}

/**
 * Pattern across paired rows: row 1 → 2/3 + 1/3, row 2 → 1/3 + 2/3, repeat.
 * Pair index even: positions are [large, small]. Pair index odd: [small, large].
 */
function sizeForIndex(i: number): 'large' | 'small' {
  const pair = Math.floor(i / 2);
  const pos = i % 2;
  const evenPair = pair % 2 === 0;
  if (evenPair) return pos === 0 ? 'large' : 'small';
  return pos === 0 ? 'small' : 'large';
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-8">
      {recipes.map((recipe, i) => {
        const size = sizeForIndex(i);
        return (
          <div
            key={recipe._id.toString()}
            className={size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}
          >
            <RecipeCard recipe={recipe} size={size} />
          </div>
        );
      })}
    </div>
  );
}
