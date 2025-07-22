import { RecipeCard } from '../types/recipe';

interface EdamamRecipe {
  recipe: {
    uri: string;
    label: string;
    image: string;
    source: string;
    url: string;
    ingredientLines: string[];
    calories: number;
    totalTime: number;
    yield: number;
    dietLabels: string[];
    healthLabels: string[];
  };
}

export const convertEdamamToRecipeCard = (edamamRecipe: EdamamRecipe): RecipeCard => {
  const recipe = edamamRecipe.recipe;
  
  // Generate unique ID from URI
  const id = recipe.uri.split('_')[1] || Date.now().toString();
  
  // Format cooking time
  const cookingTime = recipe.totalTime > 0 
    ? `${recipe.totalTime} minutes` 
    : 'Unknown';
    
  // Format calories
  const calories = recipe.calories > 0 
    ? `${Math.round(recipe.calories)} calories`
    : '';
    
  // Format servings
  const servings = recipe.yield > 0 
    ? `${recipe.yield} servings`
    : '';
    
  // Determine difficulty based on ingredients count and time
  let difficulty = 'Easy';
  if (recipe.ingredientLines.length > 10 || recipe.totalTime > 60) {
    difficulty = 'Medium';
  }
  if (recipe.ingredientLines.length > 15 || recipe.totalTime > 120) {
    difficulty = 'Hard';
  }
  
  // Create basic instructions (since Edamam doesn't provide detailed steps)
  const instructions = `1. Prepare all ingredients: ${recipe.ingredientLines.slice(0, 3).join(', ')}, etc.
2. Cook following traditional methods
3. Adjust seasonings to personal taste
4. Cooking time: approximately ${cookingTime}
5. Serve and enjoy

For detailed preparation steps, please click "View Original Recipe" for complete information.`;

  return {
    id,
    name: recipe.label,
    imageUrl: recipe.image || '',
    ingredients: recipe.ingredientLines,
    cookingTime,
    instructions,
    difficulty,
    calories,
    servings,
    source: recipe.source,
    url: recipe.url,
  };
};

export const convertEdamamArrayToRecipeCards = (edamamRecipes: EdamamRecipe[]): RecipeCard[] => {
  return edamamRecipes.map(convertEdamamToRecipeCard);
};

// Parse Gemini response that might contain recipe recommendations
export const parseGeminiRecipeResponse = (response: string): {
  message: string;
  recipes?: RecipeCard[];
} => {
  try {
    // Try to parse as JSON first (structured response)
    const parsed = JSON.parse(response);
    if (parsed.recipes && Array.isArray(parsed.recipes)) {
      return {
        message: parsed.message || 'Here are the recommended recipes for you:',
        recipes: parsed.recipes,
      };
    }
  } catch (e) {
    // Not JSON, treat as plain text
  }
  
  // Check if response contains recipe-like content
  const hasRecipeKeywords = /recipe|recipes|recommend|cooking|preparation|instructions/.test(response);
  
  return {
    message: response,
    recipes: hasRecipeKeywords ? [] : undefined,
  };
};

// Create mock recipe cards based on ingredients and AI context
export const createMockRecipeCards = (ingredients: string[], aiMessage?: string): RecipeCard[] => {
  const allMockRecipes: RecipeCard[] = [
    // Western recipes
    {
      id: 'mock_western_1',
      name: 'Italian Bolognese Pasta',
      imageUrl: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400',
      ingredients: ['Ground beef', 'Tomatoes', 'Onion', 'Garlic', 'Pasta', 'Olive oil', 'Red wine', 'Herbs'],
      cookingTime: '45 minutes',
      instructions: `1. Dice onion, garlic, and tomatoes
2. Heat olive oil in pan, sauté onion and garlic until fragrant
3. Add ground beef and cook until browned
4. Add diced tomatoes and red wine, simmer for 30 minutes
5. Cook pasta until al dente, mix with meat sauce
6. Garnish with herbs and Parmesan cheese`,
      difficulty: 'Medium',
      calories: '520 calories',
      servings: '2 servings',
    },
    {
      id: 'mock_western_2',
      name: 'Tomato Beef Stew',
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
      ingredients: ['Beef chunks', 'Tomatoes', 'Onion', 'Carrots', 'Potatoes', 'Thyme', 'Bay leaves', 'Red wine'],
      cookingTime: '2 hours',
      instructions: `1. Brown beef chunks until golden on all sides
2. Add onions and sauté until fragrant
3. Add tomatoes, red wine, and herbs
4. Simmer on low heat for 1.5 hours until beef is tender
5. Add carrots and potatoes, continue cooking for 30 minutes
6. Season to taste and serve`,
      difficulty: 'Medium',
      calories: '450 calories',
      servings: '3-4 servings',
    },
    {
      id: 'mock_western_3',
      name: 'Tomato Beef Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      ingredients: ['Pizza base', 'Ground beef', 'Tomato sauce', 'Mozzarella cheese', 'Onion', 'Bell peppers'],
      cookingTime: '25 minutes',
      instructions: `1. Marinate ground beef with spices for 15 minutes
2. Cook ground beef until fully cooked
3. Spread tomato sauce on pizza base
4. Top with cheese, ground beef, and vegetables
5. Bake at 200°C for 15 minutes until cheese melts
6. Let cool slightly before serving`,
      difficulty: 'Easy',
      calories: '380 calories',
      servings: '2 servings',
    },
    // Asian recipes
    {
      id: 'mock_chinese_1',
      name: 'Tomato and Scrambled Eggs',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      ingredients: ['Tomatoes', 'Eggs', 'Green onions', 'Salt', 'Sugar', 'Soy sauce'],
      cookingTime: '15 minutes',
      instructions: `1. Cut tomatoes into chunks, beat eggs in a bowl
2. Heat oil in pan, scramble eggs first and set aside
3. Stir-fry tomatoes until juicy
4. Add scrambled eggs back and stir-fry
5. Season to taste and serve`,
      difficulty: 'Easy',
      calories: '180 calories',
      servings: '2 servings',
    },
    {
      id: 'mock_chinese_2',
      name: 'Braised Beef in Soy Sauce',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      ingredients: ['Beef chunks', 'Light soy sauce', 'Dark soy sauce', 'Rock sugar', 'Star anise', 'Cinnamon', 'Ginger', 'Green onions'],
      cookingTime: '1.5 hours',
      instructions: `1. Blanch beef chunks to remove impurities
2. Heat oil and caramelize sugar until golden
3. Add beef chunks and brown on all sides
4. Add spices and seasonings
5. Simmer on low heat for 1 hour until tender
6. Increase heat to reduce sauce`,
      difficulty: 'Medium',
      calories: '420 calories',
      servings: '3 servings',
    }
  ];

  // Smart recommendation based on AI message content and ingredients
  let recommendedRecipes: RecipeCard[] = [];

  // Check keywords in AI message
  const isWesternCuisine = aiMessage && /western|italian|pizza|Pizza|Bolognese|Stew|pasta/i.test(aiMessage);
  const isAsianCuisine = aiMessage && /asian|chinese|stir.?fry|braised|soy.?sauce/i.test(aiMessage);

  if (isWesternCuisine) {
    // Prioritize Western recipes
    recommendedRecipes = allMockRecipes.filter(recipe => recipe.id.includes('western'));
  } else if (isAsianCuisine) {
    // Prioritize Asian recipes
    recommendedRecipes = allMockRecipes.filter(recipe => recipe.id.includes('chinese'));
  }

  // Secondary filtering based on user ingredients
  if (ingredients.length > 0) {
    const ingredientFilteredRecipes = allMockRecipes.filter(recipe => 
      recipe.ingredients.some(recipeIngredient => 
        ingredients.some(userIngredient => 
          recipeIngredient.includes(userIngredient) || 
          userIngredient.includes(recipeIngredient)
        )
      )
    );

    // If there are ingredient-based matches, prioritize them
    if (ingredientFilteredRecipes.length > 0) {
      recommendedRecipes = ingredientFilteredRecipes;
    }
  }

  // If no matching recipes, return default recommendations
  if (recommendedRecipes.length === 0) {
    recommendedRecipes = isWesternCuisine 
      ? allMockRecipes.filter(recipe => recipe.id.includes('western'))
      : allMockRecipes.slice(0, 3);
  }

  // Return at most 3 recipes to ensure sufficient choices
  return recommendedRecipes.slice(0, 3);
}; 