import Constants from 'expo-constants';

const { EDAMAM_ID, EDAMAM_KEY } = Constants.expoConfig?.extra || {};

export interface DetailedRecipe {
  name: string;
  image: string;
  ingredients: string[];
  instructions?: string[];
  url: string;
  cookTime?: string;
  prepTime?: string;
  servings?: string;
  calories?: number;
  source?: string;
}

export interface EdamamRecipeResponse {
  hits: {
    recipe: {
      label: string;
      image: string;
      ingredientLines: string[];
      url: string;
      totalTime?: number;
      yield?: number;
      calories?: number;
      source?: string;
      dietLabels?: string[];
      healthLabels?: string[];
    };
  }[];
}

/**
 * Get detailed recipe information from Edamam API based on recipe name
 */
export async function fetchRecipeDetails(recipeName: string): Promise<DetailedRecipe | null> {
  try {
    console.log('[EdamamAPI] Starting recipe search:', recipeName);
    
    // Validate API credentials
    if (!EDAMAM_ID || !EDAMAM_KEY) {
      console.error('[EdamamAPI] Missing API credentials');
      return null;
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      q: recipeName,
      type: 'public',
      app_id: EDAMAM_ID,
      app_key: EDAMAM_KEY,
      from: '0',
      to: '5', // Get top 5 results
    });

    const url = `https://api.edamam.com/api/recipes/v2?${queryParams.toString()}`;
    console.log('[EdamamAPI] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Edamam-Account-User': 'picknic-user-123',
      },
    });

    console.log('[EdamamAPI] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EdamamAPI] Request failed:', response.status, errorText);
      return null;
    }

    const data: EdamamRecipeResponse = await response.json();
    console.log('[EdamamAPI] Found', data.hits?.length || 0, 'recipes');

    if (!data.hits || data.hits.length === 0) {
      console.log('[EdamamAPI] No matching recipes found:', recipeName);
      return null;
    }

    // Take the first best matching result
    const firstMatch = data.hits[0].recipe;
    console.log('[EdamamAPI] Selected recipe:', firstMatch.label);

    const detailedRecipe: DetailedRecipe = {
      name: firstMatch.label,
      image: firstMatch.image || '',
      ingredients: firstMatch.ingredientLines || [],
      url: firstMatch.url,
      cookTime: firstMatch.totalTime ? `${firstMatch.totalTime} minutes` : undefined,
      servings: firstMatch.yield ? `${firstMatch.yield} servings` : undefined,
      calories: firstMatch.calories ? Math.round(firstMatch.calories) : undefined,
      source: firstMatch.source || 'Edamam',
    };

    console.log('[EdamamAPI] Parsing complete:', {
      name: detailedRecipe.name,
      ingredientsCount: detailedRecipe.ingredients.length,
      hasImage: !!detailedRecipe.image,
      hasUrl: !!detailedRecipe.url,
    });

    return detailedRecipe;

  } catch (error) {
    console.error('[EdamamAPI] Request exception:', error);
    return null;
  }
}

/**
 * Batch get detailed information for multiple recipes
 */
export async function fetchMultipleRecipeDetails(recipeNames: string[]): Promise<DetailedRecipe[]> {
  console.log('[EdamamAPI] Batch getting recipe details:', recipeNames);
  
  const promises = recipeNames.map(name => fetchRecipeDetails(name));
  const results = await Promise.allSettled(promises);
  
  const successfulResults = results
    .filter((result): result is PromiseFulfilledResult<DetailedRecipe> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value!);

  console.log('[EdamamAPI] Batch get complete:', successfulResults.length, '/', recipeNames.length);
  return successfulResults;
}

/**
 * Search similar recipes (for recommendations)
 */
export async function searchSimilarRecipes(baseRecipeName: string, count: number = 3): Promise<DetailedRecipe[]> {
  try {
    console.log('[EdamamAPI] Searching similar recipes:', baseRecipeName);
    
    if (!EDAMAM_ID || !EDAMAM_KEY) {
      console.error('[EdamamAPI] Missing API credentials');
      return [];
    }

    // Extract keywords for search
    const keywords = baseRecipeName.split(/[\s,，]/).filter(word => word.length > 1);
    const searchQuery = keywords.slice(0, 2).join(' '); // Use first two keywords

    const queryParams = new URLSearchParams({
      q: searchQuery,
      type: 'public',
      app_id: EDAMAM_ID,
      app_key: EDAMAM_KEY,
      from: '0',
      to: count.toString(),
    });

    const url = `https://api.edamam.com/api/recipes/v2?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[EdamamAPI] Similar recipe search failed:', response.status);
      return [];
    }

    const data: EdamamRecipeResponse = await response.json();
    const recipes = data.hits?.map(hit => ({
      name: hit.recipe.label,
      image: hit.recipe.image || '',
      ingredients: hit.recipe.ingredientLines || [],
      url: hit.recipe.url,
      cookTime: hit.recipe.totalTime ? `${hit.recipe.totalTime} minutes` : undefined,
      servings: hit.recipe.yield ? `${hit.recipe.yield} servings` : undefined,
      calories: hit.recipe.calories ? Math.round(hit.recipe.calories) : undefined,
      source: hit.recipe.source || 'Edamam',
    })) || [];

    console.log('[EdamamAPI] Found', recipes.length, 'similar recipes');
    return recipes;

  } catch (error) {
    console.error('[EdamamAPI] Similar recipe search exception:', error);
    return [];
  }
} 