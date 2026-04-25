import type { ObjectId } from 'mongodb';

export const CURRENT_SCHEMA_VERSION = 1;

interface NutritionInfo {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  saturatedFat: number;
  sodium: number;
  sugar: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export type RecipeVisibility = 'private' | 'public';

export type RecipeImage =
  | { source: 'upload'; key: string } // S3 object key for an uploaded image
  | { source: 'url'; url: string }; // externally hosted image URL (e.g. scraped from another site)

export interface Recipe {
  description: string;
  ingredients: Ingredient[];
  name: string;
  schemaVersion: number;
  servings: number;
  steps: string[];
  visibility: RecipeVisibility;
  contributorId?: string; // UUID string representing the user who contributed the recipe
  image?: RecipeImage;
  /** Nutritional information per serving */
  nutrition?: NutritionInfo;
  preparationTimes?: {
    cook: number; // in minutes
    prep: number; // in minutes
    total: number; // in minutes
  };
  tags?: string[];
}

export type RecipeDocument = Recipe & { _id: ObjectId; createdAt: Date };
