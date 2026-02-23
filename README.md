# Recipe Cart

A modern web application that simplifies meal planning by allowing users to curate recipes, dynamically generate shopping lists from their weekly meal selections, and more.

## Quick Start

### Prerequisites

- Node.js 20+
- Package manager (npm, yarn, or pnpm)
- MongoDB Atlas account (for data storage)

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd recipe-cart

# Install dependencies
npm install
```

### Production Build

Build the application for production:

```bash
npm run build
```

### Environment Configuration

```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB Atlas connection string and other config
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework with TypeScript
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- **Component Library**: [React Aria](https://react-aria.adobe.com/) - Accessible Component Library
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud-native document database
- **Language**: TypeScript for type safety and better DX

## Features

### Core Functionality

- **Recipe Management**: Create, edit, and organize your personal recipe collection
- **Recipe Import**: Import recipes from popular cooking websites with automatic parsing
- **Weekly Meal Planning**: Select recipes for the week using an intuitive calendar interface
- **Smart Shopping Lists**: Automatically generate consolidated grocery lists from selected recipes
- **Ingredient Intelligence**: Smart consolidation of duplicate ingredients (e.g., "2 eggs + 3 eggs = 5 eggs")

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: User-preferred theme support
- **Search & Filter**: Quickly find recipes by ingredients, cuisine, cooking time, or dietary restrictions
- **Recipe Collections**: Organize recipes into custom collections (e.g., "Quick Weeknight", "Sunday Dinners")

## Documentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Variants](https://www.tailwind-variants.org/) - a first-class variant API to compliment Tailwind
- [React Aria](https://react-aria.adobe.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)

## Data Models

### Core Types (TypeScript)

```typescript
// Recipe Management Types
interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  rating?: 1 | 2 | 3 | 4 | 5;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
```

## API Routes

### Recipe Management

```
GET    /api/recipes              # Get all user recipes
POST   /api/recipes              # Create new recipe
GET    /api/recipes/:id          # Get specific recipe
PUT    /api/recipes/:id          # Update recipe
DELETE /api/recipes/:id          # Delete recipe
POST   /api/recipes/import       # Import recipe from URL
```

## Development Roadmap

### Phase 1: MVP (Current)

- [ ] Basic recipe CRUD operations
- [ ] Manual recipe creation and editing
- [ ] Simple meal planning calendar
- [ ] Basic shopping list generation
- [ ] Responsive web interface

### Phase 2: Enhanced Features

- [ ] Recipe import from major cooking websites
- [ ] Advanced search and filtering
- [ ] Recipe collections and tagging
- [ ] Improved shopping list categorization
- [ ] User accounts and authentication

### Phase 3: Smart Features

- [ ] AI-powered recipe recommendations
- [ ] Nutrition analysis and tracking
- [ ] Pantry management integration
- [ ] Social features (sharing, reviews)

### Phase 4: Integrations

- [ ] Grocery delivery service APIs
- [ ] Smart kitchen device integration
- [ ] Third-party fitness app sync
