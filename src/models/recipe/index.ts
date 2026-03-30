import type { ObjectId } from 'mongodb';

export const CURRENT_SCHEMA_VERSION = 1;

interface NutritionInfo {
  calories: number;
  fat: number;
  sugar: number;
  sodium: number;
  protein: number;
  saturatedFat: number;
  carbohydrates: number;
}

export interface Recipe {
  schemaVersion: number;
  name: string;
  description: string;
  tags?: string[];
  imageKey?: string; // S3 object key for the recipe's main image
  preparationTimes?: {
    prep: number; // in minutes
    cook: number; // in minutes
    total: number; // in minutes
  };
  servings: number;
  contributorId?: string; // UUID string representing the user who contributed the recipe
  /** Nutritional information per serving */
  nutrition?: NutritionInfo;
  steps: string[];
  ingredients: string[];
}

export type RecipeDocument = Recipe & { _id: ObjectId; createdAt: Date };
