export interface RecipeCard {
  id: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  cookingTime: string;
  instructions: string;
  difficulty?: string;
  calories?: string;
  servings?: string;
  source?: string;
  url?: string;
}

// New recommended dish data structure (unified)
export interface RecommendedRecipe {
  id: string;
  name: string;          // Recipe name
  englishName?: string;   // Optional English name
  description: string;   // Description
  cookingTime: string;   // Cooking time
  difficulty: string;    // Easy/Medium/Hard
  taste: string;         // Taste profile
  ingredients?: string[]; // Optional
  steps?: string[];       // Optional
}

// AI response parsing result
export interface ParsedRecommendationResult {
  recipes: RecommendedRecipe[];
  success: boolean;
  error?: string;
}

export interface TodoListState {
  recipes: RecipeCard[];
  addRecipe: (recipe: RecipeCard) => void;
  removeRecipe: (id: string) => void;
  clearList: () => void;
  isInList: (id: string) => boolean;
} 