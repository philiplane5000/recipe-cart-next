export default function ColorSwatches() {
  return (
    <div className="bg-cream-50 min-h-screen p-8 font-mono text-sm">
      <header className="mb-12">
        <h1 className="text-primary-800 mb-2 text-3xl font-light tracking-tight">
          Color System
        </h1>
        <p className="text-primary-600/70 font-sans text-base">
          RecipeCart &middot; OKLCH palette reference
        </p>
      </header>

      <div className="space-y-10">
        {/* Primary - Sage Green */}
        <section>
          <h2 className="text-primary-600 mb-3 text-xs tracking-widest uppercase">
            Primary &mdash; Sage Green
          </h2>
          <div className="grid grid-cols-10 gap-1.5">
            <div className="space-y-2">
              <div className="bg-primary-50 ring-primary-200/50 aspect-square rounded-lg ring-1" />
              <p className="text-primary-700 text-center text-[10px]">50</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-100 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">100</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-200 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">200</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-300 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">300</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-400 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">400</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-500 ring-primary-700/30 ring-offset-cream-50 aspect-square rounded-lg ring-2 ring-offset-2" />
              <p className="text-primary-700 text-center text-[10px] font-bold">
                500
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-600 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">600</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-700 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">700</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-800 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">800</p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary-900 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">900</p>
            </div>
          </div>
        </section>

        {/* Secondary - Golden Orange */}
        <section>
          <h2 className="text-primary-600 mb-3 text-xs tracking-widest uppercase">
            Secondary &mdash; Golden Orange
          </h2>
          <div className="grid grid-cols-10 gap-1.5">
            <div className="space-y-2">
              <div className="bg-secondary-50 ring-secondary-200/50 aspect-square rounded-lg ring-1" />
              <p className="text-primary-700 text-center text-[10px]">50</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-100 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">100</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-200 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">200</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-300 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">300</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-400 ring-secondary-600/30 ring-offset-cream-50 aspect-square rounded-lg ring-2 ring-offset-2" />
              <p className="text-primary-700 text-center text-[10px] font-bold">
                400
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-500 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">500</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-600 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">600</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-700 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">700</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-800 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">800</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary-900 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">900</p>
            </div>
          </div>
        </section>

        {/* Cream */}
        <section>
          <h2 className="text-primary-600 mb-3 text-xs tracking-widest uppercase">
            Cream
          </h2>
          <div className="grid grid-cols-10 gap-1.5">
            <div className="space-y-2">
              <div className="bg-cream-50 ring-cream-300/60 aspect-square rounded-lg ring-1" />
              <p className="text-primary-700 text-center text-[10px]">50</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-100 ring-cream-300/40 aspect-square rounded-lg ring-1" />
              <p className="text-primary-700 text-center text-[10px]">100</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-200 ring-cream-400/30 ring-offset-cream-50 aspect-square rounded-lg ring-2 ring-offset-2" />
              <p className="text-primary-700 text-center text-[10px] font-bold">
                200
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-300 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">300</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-400 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">400</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-500 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">500</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-600 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">600</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-700 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">700</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-800 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">800</p>
            </div>
            <div className="space-y-2">
              <div className="bg-cream-900 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">900</p>
            </div>
          </div>
        </section>

        {/* Blush Pink */}
        <section>
          <h2 className="text-primary-600 mb-3 text-xs tracking-widest uppercase">
            Blush Pink
          </h2>
          <div className="grid grid-cols-10 gap-1.5">
            <div className="space-y-2">
              <div className="bg-blush-50 ring-blush-200/50 aspect-square rounded-lg ring-1" />
              <p className="text-primary-700 text-center text-[10px]">50</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-100 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">100</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-200 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">200</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-300 ring-blush-500/30 ring-offset-cream-50 aspect-square rounded-lg ring-2 ring-offset-2" />
              <p className="text-primary-700 text-center text-[10px] font-bold">
                300
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-400 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">400</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-500 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">500</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-600 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">600</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-700 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">700</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-800 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">800</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blush-900 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">900</p>
            </div>
          </div>
        </section>

        {/* Coral Red */}
        <section>
          <h2 className="text-primary-600 mb-3 text-xs tracking-widest uppercase">
            Coral Red
          </h2>
          <div className="grid grid-cols-10 gap-1.5">
            <div className="space-y-2">
              <div className="bg-coral-50 ring-coral-200/50 aspect-square rounded-lg ring-1" />
              <p className="text-primary-700 text-center text-[10px]">50</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-100 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">100</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-200 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">200</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-300 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">300</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-400 aspect-square rounded-lg" />
              <p className="text-primary-700 text-center text-[10px]">400</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-500 ring-coral-700/30 ring-offset-cream-50 aspect-square rounded-lg ring-2 ring-offset-2" />
              <p className="text-primary-700 text-center text-[10px] font-bold">
                500
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-600 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">600</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-700 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">700</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-800 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">800</p>
            </div>
            <div className="space-y-2">
              <div className="bg-coral-900 aspect-square rounded-lg" />
              <p className="text-cream-300 text-center text-[10px]">900</p>
            </div>
          </div>
        </section>
      </div>

      {/* Combination Samples */}
      <div className="mt-16 mb-8">
        <h2 className="text-primary-600 mb-6 text-xs tracking-widest uppercase">
          Combination Samples
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-cream-100 ring-cream-300/50 rounded-xl p-5 ring-1">
            <div className="bg-secondary-400 mb-3 h-3 w-16 rounded-full" />
            <div className="bg-primary-200 mb-2 h-2 w-full rounded-full" />
            <div className="bg-primary-200 mb-4 h-2 w-4/5 rounded-full" />
            <div className="flex gap-2">
              <div className="bg-primary-500 flex h-7 items-center rounded-md px-3">
                <span className="text-cream-50 text-[10px]">Primary</span>
              </div>
              <div className="bg-secondary-400 flex h-7 items-center rounded-md px-3">
                <span className="text-cream-50 text-[10px]">Secondary</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-blush-100 ring-blush-200 rounded-xl p-5 ring-1">
            <div className="bg-coral-500 mb-3 h-3 w-16 rounded-full" />
            <div className="bg-blush-300 mb-2 h-2 w-full rounded-full" />
            <div className="bg-blush-300 mb-4 h-2 w-3/5 rounded-full" />
            <div className="flex gap-2">
              <div className="bg-coral-500 flex h-7 items-center rounded-md px-3">
                <span className="text-cream-50 text-[10px]">Coral</span>
              </div>
              <div className="bg-blush-400 flex h-7 items-center rounded-md px-3">
                <span className="text-cream-50 text-[10px]">Blush</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-primary-800 rounded-xl p-5">
            <div className="bg-secondary-400 mb-3 h-3 w-16 rounded-full" />
            <div className="bg-primary-600 mb-2 h-2 w-full rounded-full" />
            <div className="bg-primary-600 mb-4 h-2 w-4/5 rounded-full" />
            <div className="flex gap-2">
              <div className="bg-cream-100 flex h-7 items-center rounded-md px-3">
                <span className="text-primary-800 text-[10px]">Light</span>
              </div>
              <div className="bg-coral-500 flex h-7 items-center rounded-md px-3">
                <span className="text-cream-50 text-[10px]">Accent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-cream-300/50 mt-12 border-t pt-6">
        <p className="text-primary-500/60 text-[10px]">
          OKLCH color space &middot; P3 wide-gamut ready &middot; Tailwind v4
        </p>
      </footer>
    </div>
  );
}
