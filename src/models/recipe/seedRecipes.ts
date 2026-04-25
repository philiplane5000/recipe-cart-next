import { MongoClient } from 'mongodb';
import type { WithoutId } from 'mongodb';
import type { RecipeDocument } from '@/models/recipe';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;
const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME!;
const COLLECTION = 'recipes';

type SeedRecipe = WithoutId<RecipeDocument>;

const recipes: Omit<SeedRecipe, 'createdAt'>[] = [
  {
    name: 'Classic Chocolate Chip Cookies',
    description:
      'A timeless recipe for chewy and delicious chocolate chip cookies with a hint of sea salt. A perfect treat for any occasion.',
    schemaVersion: 1,
    servings: 12,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    },
    ingredients: [
      { name: 'all-purpose flour', quantity: 2.25, unit: 'cups' },
      { name: 'baking soda', quantity: 1, unit: 'tsp' },
      { name: 'salt', quantity: 1, unit: 'tsp' },
      { name: 'unsalted butter', quantity: 1, unit: 'cup', notes: 'softened' },
      { name: 'granulated sugar', quantity: 0.75, unit: 'cup' },
      { name: 'brown sugar', quantity: 0.75, unit: 'cup', notes: 'packed' },
      { name: 'eggs', quantity: 2, unit: 'large' },
      { name: 'vanilla extract', quantity: 1, unit: 'tsp' },
      { name: 'chocolate chips', quantity: 2, unit: 'cups' },
    ],
    steps: [
      'Preheat oven to 375°F (190°C).',
      'In a medium bowl, whisk together flour, baking soda, and salt.',
      'In a large bowl, beat butter, granulated sugar, and brown sugar with a mixer until creamy.',
      'Beat in eggs one at a time, then stir in vanilla extract.',
      'Gradually add the dry ingredients to the wet ingredients and mix until just combined.',
      'Fold in chocolate chips.',
      'Drop rounded tablespoons of dough onto ungreased baking sheets.',
      'Bake for 10-12 minutes, or until the edges are golden brown.',
      'Let cool on the baking sheet for a few minutes before transferring to a wire rack.',
    ],
    preparationTimes: { prep: 15, cook: 12, total: 27 },
    nutrition: {
      calories: 180,
      carbohydrates: 23,
      fat: 9,
      protein: 2,
      saturatedFat: 5,
      sodium: 110,
      sugar: 18,
    },
    tags: ['dessert', 'baking', 'cookies', 'chocolate'],
  },

  {
    name: 'Avocado Toast with Poached Egg',
    description:
      'A simple and nutritious breakfast featuring creamy avocado and perfectly poached eggs on toasted bread.',
    schemaVersion: 1,
    servings: 2,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2',
    },
    ingredients: [
      { name: 'bread slices', quantity: 2, unit: 'pieces' },
      { name: 'avocado', quantity: 1, unit: 'whole', notes: 'ripe' },
      { name: 'eggs', quantity: 2, unit: 'large' },
      { name: 'lemon juice', quantity: 1, unit: 'tsp' },
      { name: 'salt', quantity: 0.5, unit: 'tsp' },
      { name: 'black pepper', quantity: 0.25, unit: 'tsp' },
    ],
    steps: [
      'Toast the bread slices until golden brown.',
      'Mash the avocado with lemon juice, salt, and pepper.',
      'Poach the eggs in simmering water for 3-4 minutes.',
      'Spread the avocado mixture on toast.',
      'Top each slice with a poached egg and serve immediately.',
    ],
    preparationTimes: { prep: 10, cook: 5, total: 15 },
    nutrition: {
      calories: 250,
      carbohydrates: 20,
      fat: 15,
      protein: 10,
      saturatedFat: 3,
      sodium: 220,
      sugar: 2,
    },
    tags: ['breakfast', 'healthy', 'quick'],
  },

  {
    name: 'Blueberry Pancakes',
    description: 'Fluffy pancakes packed with fresh blueberries.',
    schemaVersion: 1,
    servings: 4,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    },
    ingredients: [
      { name: 'flour', quantity: 2, unit: 'cups' },
      { name: 'milk', quantity: 1.5, unit: 'cups' },
      { name: 'eggs', quantity: 2, unit: 'large' },
      { name: 'blueberries', quantity: 1, unit: 'cup' },
    ],
    steps: ['Mix batter.', 'Cook on griddle.', 'Flip and finish.'],
    preparationTimes: { prep: 10, cook: 10, total: 20 },
    nutrition: {
      calories: 310,
      carbohydrates: 52,
      fat: 7,
      protein: 10,
      saturatedFat: 2,
      sodium: 420,
      sugar: 12,
    },
    tags: ['breakfast'],
  },

  {
    name: 'Grilled Salmon',
    description: 'Perfectly grilled salmon with a crispy exterior.',
    schemaVersion: 1,
    servings: 2,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    },
    ingredients: [
      { name: 'salmon fillet', quantity: 2, unit: 'pieces' },
      { name: 'olive oil', quantity: 2, unit: 'tbsp' },
    ],
    steps: ['Season salmon.', 'Grill 4-5 minutes per side.'],
    preparationTimes: { prep: 5, cook: 10, total: 15 },
    nutrition: {
      calories: 350,
      carbohydrates: 0,
      fat: 22,
      protein: 36,
      saturatedFat: 5,
      sodium: 320,
      sugar: 0,
    },
    tags: ['dinner'],
  },

  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce tossed in creamy Caesar dressing.',
    schemaVersion: 1,
    servings: 3,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
    },
    ingredients: [
      { name: 'romaine lettuce', quantity: 1, unit: 'head' },
      { name: 'croutons', quantity: 1, unit: 'cup' },
    ],
    steps: ['Chop lettuce.', 'Toss with dressing and croutons.'],
    preparationTimes: { prep: 10, cook: 0, total: 10 },
    nutrition: {
      calories: 180,
      carbohydrates: 14,
      fat: 11,
      protein: 6,
      saturatedFat: 2,
      sodium: 420,
      sugar: 2,
    },
    tags: ['salad'],
  },

  {
    name: 'Beef Burger',
    description: 'Juicy grilled burger with classic toppings.',
    schemaVersion: 1,
    servings: 4,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    },
    ingredients: [
      { name: 'ground beef', quantity: 1, unit: 'lb' },
      { name: 'burger buns', quantity: 4, unit: 'pieces' },
    ],
    steps: ['Form patties.', 'Grill until cooked.', 'Assemble burgers.'],
    preparationTimes: { prep: 10, cook: 10, total: 20 },
    nutrition: {
      calories: 520,
      carbohydrates: 38,
      fat: 28,
      protein: 32,
      saturatedFat: 11,
      sodium: 680,
      sugar: 6,
    },
    tags: ['dinner'],
  },

  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil.',
    schemaVersion: 1,
    servings: 4,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1548365328-9f547fb0953f',
    },
    ingredients: [
      { name: 'pizza dough', quantity: 1, unit: 'ball' },
      { name: 'tomato sauce', quantity: 0.5, unit: 'cup' },
      { name: 'mozzarella', quantity: 1, unit: 'cup' },
    ],
    steps: ['Spread sauce on dough.', 'Add cheese.', 'Bake at high heat.'],
    preparationTimes: { prep: 15, cook: 12, total: 27 },
    nutrition: {
      calories: 380,
      carbohydrates: 48,
      fat: 14,
      protein: 18,
      saturatedFat: 7,
      sodium: 620,
      sugar: 4,
    },
    tags: ['pizza'],
  },

  {
    name: 'Chicken Curry',
    description: 'Rich and flavorful curry with tender chicken.',
    schemaVersion: 1,
    servings: 4,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1605475128023-6f2e4c8f6e90',
    },
    ingredients: [
      { name: 'chicken', quantity: 1, unit: 'lb' },
      { name: 'curry paste', quantity: 2, unit: 'tbsp' },
    ],
    steps: ['Cook chicken.', 'Add curry paste.', 'Simmer until done.'],
    preparationTimes: { prep: 15, cook: 25, total: 40 },
    nutrition: {
      calories: 340,
      carbohydrates: 12,
      fat: 18,
      protein: 34,
      saturatedFat: 5,
      sodium: 580,
      sugar: 4,
    },
    tags: ['dinner'],
  },

  {
    name: 'Banana Berry Smoothie',
    description: 'A refreshing smoothie packed with banana, berries, and natural sweetness.',
    schemaVersion: 1,
    servings: 2,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625',
    },
    ingredients: [
      { name: 'banana', quantity: 1, unit: 'whole' },
      { name: 'mixed berries', quantity: 1, unit: 'cup', notes: 'frozen' },
      { name: 'milk', quantity: 1.5, unit: 'cups' },
      { name: 'honey', quantity: 1, unit: 'tbsp' },
      { name: 'ice cubes', quantity: 1, unit: 'cup' },
    ],
    steps: [
      'Add all ingredients to a blender.',
      'Blend until smooth.',
      'Taste and adjust sweetness if needed.',
      'Pour into glasses and serve immediately.',
    ],
    preparationTimes: { prep: 5, cook: 0, total: 5 },
    nutrition: {
      calories: 190,
      carbohydrates: 38,
      fat: 2,
      protein: 5,
      saturatedFat: 1,
      sodium: 85,
      sugar: 28,
    },
    tags: ['drink', 'healthy', 'smoothie'],
  },

  {
    name: 'Tofu Stir-Fry',
    description:
      'A quick and flavorful vegetarian stir-fry with crispy tofu and fresh vegetables in a savory sauce.',
    schemaVersion: 1,
    servings: 4,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    },
    ingredients: [
      { name: 'firm tofu', quantity: 14, unit: 'oz', notes: 'pressed and cubed' },
      { name: 'broccoli florets', quantity: 2, unit: 'cups' },
      { name: 'carrots', quantity: 1, unit: 'cup', notes: 'sliced' },
      { name: 'bell pepper', quantity: 1, unit: 'whole', notes: 'sliced' },
      { name: 'soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'garlic', quantity: 2, unit: 'cloves', notes: 'minced' },
      { name: 'ginger', quantity: 1, unit: 'tsp', notes: 'grated' },
      { name: 'olive oil', quantity: 2, unit: 'tbsp' },
    ],
    steps: [
      'Press tofu to remove excess moisture, then cut into cubes.',
      'Heat 1 tablespoon oil in a pan and cook tofu until golden and crispy. Remove and set aside.',
      'Add remaining oil to the pan and sauté garlic and ginger until fragrant.',
      'Add vegetables and stir-fry for 5-7 minutes until tender-crisp.',
      'Return tofu to the pan and add soy sauce.',
      'Toss everything together and cook for another 2 minutes.',
      'Serve hot over rice or noodles.',
    ],
    preparationTimes: { prep: 15, cook: 15, total: 30 },
    nutrition: {
      calories: 280,
      carbohydrates: 18,
      fat: 16,
      protein: 20,
      saturatedFat: 2,
      sodium: 650,
      sugar: 6,
    },
    tags: ['dinner', 'vegetarian', 'vegan', 'quick', 'stir-fry'],
  },

  {
    name: 'Spaghetti Bolognese',
    description: 'Hearty pasta with a rich meat sauce.',
    schemaVersion: 1,
    servings: 4,
    visibility: 'public',
    image: {
      source: 'url',
      url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3',
    },
    ingredients: [
      { name: 'spaghetti', quantity: 12, unit: 'oz' },
      { name: 'ground beef', quantity: 1, unit: 'lb' },
    ],
    steps: ['Cook pasta.', 'Prepare sauce.', 'Combine and serve.'],
    preparationTimes: { prep: 10, cook: 20, total: 30 },
    nutrition: {
      calories: 520,
      carbohydrates: 58,
      fat: 18,
      protein: 32,
      saturatedFat: 7,
      sodium: 540,
      sugar: 8,
    },
    tags: ['pasta'],
  },
];

async function seed() {
  if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
  if (!MONGODB_DB_NAME) throw new Error('Missing MONGODB_DB_NAME');

  const client = new MongoClient(MONGODB_URI, { appName: MONGODB_APP_NAME });
  await client.connect();

  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection<SeedRecipe>(COLLECTION);

  const now = new Date();
  const docs: SeedRecipe[] = recipes.map((r) => ({ ...r, createdAt: now }));

  await collection.deleteMany({});
  await collection.insertMany(docs);

  console.log(`Inserted ${docs.length} recipes into ${MONGODB_DB_NAME}/${COLLECTION}`);
  await client.close();
}

seed().catch(console.error);
