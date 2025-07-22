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

// 新的推荐菜品数据结构（强制统一）
export interface RecommendedRecipe {
  id: string;
  name: string;          // 菜名
  englishName?: string;   // 可选英文名
  description: string;   // 简介
  cookingTime: string;   // 时间
  difficulty: string;    // 简单/中等/复杂
  taste: string;         // 口味
  ingredients?: string[]; // 可选
  steps?: string[];       // 可选
}

// AI响应解析结果
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