import type { ObjectId } from 'mongodb';

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
  /**
   * Nutritional information per serving in the following order:
   * [calories, fat, sugar, sodium, protein, saturatedFat, carbohydrates]
   */
  nutrition?: number[];
  steps: string[];
  ingredients: string[];
}

export type RecipeDocument = Recipe & { _id: ObjectId };
