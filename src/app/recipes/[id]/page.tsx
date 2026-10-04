import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRecipe } from '@/lib/db/recipes';
import { H1 } from '@/ui/components/atoms/H1';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  return { title: recipe.name, description: recipe.description };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  return (
    <header className="bg-surface-warm relative my-6 overflow-hidden rounded-3xl px-6 py-12 sm:px-10 sm:py-16 md:px-14 md:py-20">
      {/* Decorative: soft teal and golden circles echo the palette. */}
      <span
        aria-hidden
        className="bg-primary-100 pointer-events-none absolute -top-20 -right-16 size-72 rounded-full opacity-70"
      />
      <span
        aria-hidden
        className="bg-secondary-200 pointer-events-none absolute -right-4 -bottom-24 size-56 rounded-full opacity-50"
      />
      <div className="relative flex max-w-3xl flex-col gap-5">
        <span
          aria-hidden
          className="bg-secondary-400 block h-1.5 w-16 rounded-full"
        />
        <H1
          weight="strong"
          className="text-primary-800 m-0 text-balance md:tracking-tight"
        >
          {recipe.name}
        </H1>
      </div>
    </header>
  );
}
