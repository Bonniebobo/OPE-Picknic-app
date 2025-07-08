// Recipe Service for handling recipe generation API calls
// This module is designed to be easily extended with OpenAI API integration

export interface RecipeRequest {
  ingredients?: string[];
  imageData?: any;
  dietaryPreferences?: string[];
  cuisinePreferences?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image?: string;
  rating: number;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface RecipeResponse {
  recipes: Recipe[];
  totalCount: number;
  processingTime: number;
}

// Mock data for development
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Fresh Caprese Salad',
    description: 'A classic Italian salad with fresh tomatoes, mozzarella, and basil',
    ingredients: ['tomato', 'basil', 'cheese', 'olive oil', 'balsamic vinegar'],
    instructions: [
      'Slice tomatoes and mozzarella into 1/4 inch rounds',
      'Arrange tomato and mozzarella slices on a plate',
      'Tear fresh basil leaves and scatter over the top',
      'Drizzle with olive oil and balsamic vinegar',
      'Season with salt and pepper to taste'
    ],
    prepTime: '10 min',
    cookTime: '0 min',
    difficulty: 'Easy',
    rating: 4.8,
    nutritionInfo: {
      calories: 180,
      protein: 8,
      carbs: 6,
      fat: 14,
    },
  },
  {
    id: '2',
    name: 'Tomato Basil Pasta',
    description: 'Simple and delicious pasta with fresh tomatoes and basil',
    ingredients: ['tomato', 'basil', 'pasta', 'garlic', 'olive oil'],
    instructions: [
      'Cook pasta according to package instructions',
      'Sauté minced garlic in olive oil until fragrant',
      'Add diced tomatoes and cook for 3-4 minutes',
      'Toss with cooked pasta and fresh basil',
      'Season with salt and pepper'
    ],
    prepTime: '15 min',
    cookTime: '20 min',
    difficulty: 'Easy',
    rating: 4.6,
    nutritionInfo: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 12,
    },
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
    ingredients: ['tomato', 'basil', 'cheese', 'pizza dough', 'olive oil'],
    instructions: [
      'Preheat oven to 450°F (230°C)',
      'Roll out pizza dough on a floured surface',
      'Spread tomato sauce over the dough',
      'Add mozzarella cheese and fresh basil',
      'Bake for 12-15 minutes until crust is golden'
    ],
    prepTime: '20 min',
    cookTime: '15 min',
    difficulty: 'Medium',
    rating: 4.7,
    nutritionInfo: {
      calories: 280,
      protein: 14,
      carbs: 35,
      fat: 10,
    },
  },
  {
    id: '4',
    name: 'Tomato Basil Soup',
    description: 'Creamy and comforting tomato soup with fresh basil',
    ingredients: ['tomato', 'basil', 'onion', 'garlic', 'cream'],
    instructions: [
      'Sauté diced onion and garlic in olive oil',
      'Add chopped tomatoes and cook for 5 minutes',
      'Add vegetable broth and simmer for 20 minutes',
      'Blend until smooth and add cream',
      'Stir in fresh basil and season to taste'
    ],
    prepTime: '15 min',
    cookTime: '25 min',
    difficulty: 'Easy',
    rating: 4.5,
    nutritionInfo: {
      calories: 220,
      protein: 6,
      carbs: 18,
      fat: 14,
    },
  },
];

// Mock API function - replace with actual OpenAI API call
export async function generateRecipes(request: RecipeRequest): Promise<RecipeResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter recipes based on ingredients (simple matching for now)
  let filteredRecipes = mockRecipes;
  
  if (request.ingredients && request.ingredients.length > 0) {
    filteredRecipes = mockRecipes.filter(recipe => 
      request.ingredients!.some(ingredient => 
        recipe.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    );
  }

  // If no matches found, return all recipes
  if (filteredRecipes.length === 0) {
    filteredRecipes = mockRecipes;
  }

  return {
    recipes: filteredRecipes,
    totalCount: filteredRecipes.length,
    processingTime: 1.5,
  };
}

// Future OpenAI API integration function
export async function generateRecipesWithOpenAI(request: RecipeRequest): Promise<RecipeResponse> {
  // TODO: Implement OpenAI API call
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: 'You are a culinary expert. Generate recipes based on the provided ingredients.'
  //       },
  //       {
  //         role: 'user',
  //         content: `Generate 3 recipes using these ingredients: ${request.ingredients?.join(', ')}`
  //       }
  //     ],
  //     max_tokens: 1000,
  //   }),
  // });
  
  // For now, use mock data
  return generateRecipes(request);
}

// Image analysis function for photo-based recipe generation
export async function analyzeImageForIngredients(imageData: any): Promise<string[]> {
  // TODO: Implement image analysis with OpenAI Vision API
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4-vision-preview',
  //     messages: [
  //       {
  //         role: 'user',
  //         content: [
  //           {
  //             type: 'text',
  //             text: 'Identify all food ingredients visible in this image. Return only a comma-separated list of ingredient names.'
  //           },
  //           {
  //             type: 'image_url',
  //             image_url: {
  //               url: imageData.uri
  //             }
  //           }
  //         ]
  //       }
  //     ],
  //     max_tokens: 300,
  //   }),
  // });

  // Mock response for now
  return ['tomato', 'basil', 'cheese', 'olive oil'];
}

// Save recipe to user's collection
export async function saveRecipeToCollection(recipeId: string, userId: string): Promise<boolean> {
  // TODO: Implement save to user's collection
  console.log(`Saving recipe ${recipeId} to user ${userId}'s collection`);
  return true;
}

// Get user's saved recipes
export async function getUserSavedRecipes(userId: string): Promise<Recipe[]> {
  // TODO: Implement get user's saved recipes
  return mockRecipes.slice(0, 2); // Return first 2 recipes as "saved"
} 