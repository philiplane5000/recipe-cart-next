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

export interface Recipe {
  description: string;
  ingredients: Ingredient[];
  name: string;
  schemaVersion: number;
  servings: number;
  steps: string[];
  contributorId?: string; // UUID string representing the user who contributed the recipe
  imageKey?: string; // S3 object key for the recipe's main image
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
