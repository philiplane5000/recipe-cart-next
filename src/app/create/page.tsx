import { H1 } from '@/ui/components/atoms/H1';
import { CreateRecipeForm } from '@/ui/components/organisms/CreateRecipeForm';
import { createRecipe } from './actions';

export default async function CreatePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-1">
        <H1>Create Recipe</H1>
        <p className="text-text-secondary">
          Define ingredients, methods, and the essence of your dish
        </p>
      </header>

      {/* Server shell injects the server action into the client form organism. */}
      <CreateRecipeForm action={createRecipe} />
    </div>
  );
}
