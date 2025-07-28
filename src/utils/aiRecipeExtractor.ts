import { RecommendedRecipe, ParsedRecommendationResult, RecipeCard } from '../types/recipe';
import Constants from 'expo-constants';
import { generateRecipeImageUrl } from '../services/geminiImageAnalysis';

const { EDAMAM_ID, EDAMAM_KEY } = Constants.expoConfig?.extra || {};

/**
 * New structured recipe recommendation parser
 * Specifically parses structured Markdown or JSON format returned by AI
 * No longer uses fuzzy text extraction, ensuring data accuracy
 */

/**
 * Try to generate recipe image using Gemini AI
 */
async function tryGenerateRecipeImage(recipeName: string, description?: string): Promise<string | null> {
  try {
    console.log('[ImageGeneration] Generating AI image for recipe:', recipeName);
    
    const imageUrl = await generateRecipeImageUrl(recipeName, description);
    if (imageUrl) {
      console.log('[ImageGeneration] Successfully generated AI image for:', recipeName);
      return imageUrl;
    }
    
    console.log('[ImageGeneration] Failed to generate AI image for:', recipeName);
    return null;
  } catch (error) {
    console.error('[ImageGeneration] Error generating AI image:', error);
    return null;
  }
}

/**
 * Parse AI returned structured recipe recommendations
 * Supports two formats:
 * 1. Markdown format (recommended, better compatibility)
 * 2. JSON format (if AI can return stably)
 */
export const parseStructuredRecommendations = (aiResponse: string): ParsedRecommendationResult => {
  console.log('[StructuredParser] Starting to parse AI response...');
  console.log('[StructuredParser] Response content:', aiResponse.substring(0, 300) + '...');
  
  const cleanResponse = aiResponse.trim();
  
  // Try method 1: JSON format parsing
  const jsonResult = tryParseJsonFormat(cleanResponse);
  if (jsonResult.success) {
    console.log('[StructuredParser] JSON format parsing succeeded, found', jsonResult.recipes.length, 'recipes');
    return jsonResult;
  }
  
  // Try method 2: Markdown format parsing
  const markdownResult = tryParseMarkdownFormat(cleanResponse);
  if (markdownResult.success) {
    console.log('[StructuredParser] Markdown format parsing succeeded, found', markdownResult.recipes.length, 'recipes');
    return markdownResult;
  }
  
  // Parsing failed
  console.log('[StructuredParser] Parsing failed, cannot recognize structured format');
  return {
    recipes: [],
    success: false,
    error: 'Cannot parse AI response format, please ensure AI returns standard Markdown list or JSON format'
  };
};

/**
 * Try to parse JSON format
 * Example: [{"name": "Spinach Beef Rolls", "cookingTime": "20 minutes", ...}]
 */
function tryParseJsonFormat(response: string): ParsedRecommendationResult {
  try {
    // Find JSON array
    const jsonMatch = response.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      return { recipes: [], success: false, error: 'JSON array not found' };
    }
    
    const jsonData = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(jsonData)) {
      return { recipes: [], success: false, error: 'JSON is not array format' };
    }
    
    const recipes: RecommendedRecipe[] = [];
    for (let i = 0; i < jsonData.length && i < 3; i++) {
      const item = jsonData[i];
      if (item.name && typeof item.name === 'string') {
        const recipe: RecommendedRecipe = {
          id: `json_recipe_${Date.now()}_${i}`,
          name: item.name.trim(),
          englishName: item.englishName || undefined,
          description: item.description || `Try this delicious ${item.name}`,
          cookingTime: item.cookingTime || 'About 30 minutes',
          difficulty: item.difficulty || 'Medium',
          taste: item.taste || 'Delicious',
          ingredients: item.ingredients || undefined,
          steps: item.steps || undefined
        };
        recipes.push(recipe);
      }
    }
    
    return { recipes, success: recipes.length > 0 };
  } catch (error) {
    return { 
      recipes: [], 
      success: false, 
      error: `JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * 尝试解析 Markdown 格式
 * 例如：
 * Recommended Dishes:
 * 1. **Beef and Tomato Stew**
 * - Cooking Time: 90 minutes
 * - Difficulty: Medium
 * - Taste: Rich and savory with sweet tomato notes
 * - Description: Classic comfort food with tender beef and flavorful tomato base
 */
function tryParseMarkdownFormat(response: string): ParsedRecommendationResult {
  try {
    const recipes: RecommendedRecipe[] = [];
    
    // Match numbered list format: 1. **Recipe Name** or 1. Recipe Name (English Name) or simple 1. Recipe Name
    const numberedMatches = response.match(/\d+\.\s*[\*]*([^*\n：:]+?)[\*]*[\s\S]*?(?=\d+\.|$)/g);
    
    if (!numberedMatches) {
      return { recipes: [], success: false, error: 'Numbered list format not found' };
    }
    
    for (let i = 0; i < numberedMatches.length && i < 3; i++) {
      const match = numberedMatches[i];
      const recipe = parseMarkdownRecipeItem(match, i);
      if (recipe) {
        recipes.push(recipe);
      }
    }
    
    return { recipes, success: recipes.length > 0 };
  } catch (error) {
    return { 
      recipes: [], 
      success: false, 
      error: `Markdown parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Parse single Markdown recipe item
 */
function parseMarkdownRecipeItem(itemText: string, index: number): RecommendedRecipe | null {
  try {
    console.log('[StructuredParser] Parsing recipe item:', itemText.substring(0, 100));
    
    // Extract recipe name and English name, supporting multiple formats
    let name = '';
    let englishName = '';
    
    // Format 1: 1. **Recipe Name (English Name)**
    let nameMatch = itemText.match(/\d+\.\s*\*\*([^*]+)\s*\(([^)]+)\)\*\*/);
    if (nameMatch) {
      name = nameMatch[1].trim();
      englishName = nameMatch[2].trim();
    } else {
      // Format 2: 1. **Recipe Name**
      nameMatch = itemText.match(/\d+\.\s*\*\*([^*]+)\*\*/);
      if (nameMatch) {
        name = nameMatch[1].trim();
      } else {
        // Format 3: 1. Recipe Name (English Name)
        nameMatch = itemText.match(/\d+\.\s*([^(\n]+)\s*\(([^)]+)\)/);
        if (nameMatch) {
          name = nameMatch[1].trim();
          englishName = nameMatch[2].trim();
        } else {
          // Format 4: 1. Recipe Name
          nameMatch = itemText.match(/\d+\.\s*([^\n-]+)/);
          if (nameMatch) {
            name = nameMatch[1].trim();
          }
        }
      }
    }
    
    // Validate recipe name validity
    if (!name || name.length < 2 || name.length > 50 || 
        name.includes('Cooking') || name.includes('Steps') || 
        name.includes('Recommended') || name.includes('minutes') || 
        name.includes('Difficulty') || name.includes('Time')) {
      console.log('[StructuredParser] Invalid recipe name:', name);
      return null;
    }
    
    console.log('[StructuredParser] Extracted recipe name:', name, 'English name:', englishName);
    
    // 提取各个属性 - 支持英文关键词
    const cookingTime = extractProperty(itemText, ['Cooking Time', 'Cook Time', 'Time', 'Duration']) || 'About 30 minutes';
    const difficulty = extractProperty(itemText, ['Difficulty', 'Level']) || 'Medium';
    const taste = extractProperty(itemText, ['Taste', 'Flavor', 'Flavor Profile']) || 'Delicious';
    const description = extractProperty(itemText, ['Description', 'About', 'Summary']) || `Try this delicious ${name}`;
    
    // Extract ingredients (optional)
    const ingredientsText = extractProperty(itemText, ['Ingredients', 'Components']);
    const ingredients = ingredientsText ? 
      ingredientsText.split(/[,;]/).map(s => s.trim()).filter(s => s) : 
      undefined;
    
    // Extract steps (optional)
    const stepsText = extractProperty(itemText, ['Steps', 'Instructions', 'Method']);
    const steps = stepsText ? 
      stepsText.split(/\d+[.]/).filter(s => s.trim()).map(s => s.trim()) : 
      undefined;
    
    return {
      id: `markdown_recipe_${Date.now()}_${index}`,
      name,
      englishName,
      description,
      cookingTime,
      difficulty,
      taste,
      ingredients,
      steps
    };
  } catch (error) {
    console.log('[StructuredParser] Failed to parse single recipe:', error);
    return null;
  }
}

/**
 * Extract specified property value from text
 */
function extractProperty(text: string, propertyNames: string[]): string | undefined {
  for (const propName of propertyNames) {
    const regex = new RegExp(`${propName}[：:]\\s*([^\\n\\r-]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[1].trim();
    }
  }
  return undefined;
}

/**
 * Convert RecommendedRecipe to RecipeCard format (for backward compatibility)
 * Now tries to generate AI images when possible
 */
export const convertRecommendedToRecipeCard = async (recommended: RecommendedRecipe): Promise<RecipeCard> => {
  // Generate basic cooking steps
  const instructions = recommended.steps ? 
    recommended.steps.map((step, index) => `${index + 1}. ${step}`).join('\n') :
    `Preparing ${recommended.name}:\n\n${recommended.description}\n\nPlease refer to professional recipes for detailed steps.`;
  
  // Try to generate AI image first
  let imageUrl: string;
  
  try {
    const aiImage = await tryGenerateRecipeImage(recommended.name, recommended.description);
    if (aiImage) {
      imageUrl = aiImage;
      console.log('[RecipeConverter] Using AI-generated image for:', recommended.name);
    } else {
      // Fallback to consistent placeholder
      imageUrl = getConsistentPlaceholderImage(recommended.name);
      console.log('[RecipeConverter] Using placeholder image for:', recommended.name);
    }
  } catch (error) {
    console.error('[RecipeConverter] Error generating AI image:', error);
    imageUrl = getConsistentPlaceholderImage(recommended.name);
  }
  
  return {
    id: recommended.id,
    name: recommended.name,
    imageUrl,
    ingredients: recommended.ingredients || ['Prepare ingredients according to recipe'],
    cookingTime: recommended.cookingTime,
    instructions,
    difficulty: recommended.difficulty,
    calories: 'About 400-500 calories',
    servings: '2-3 servings',
  };
};

/**
 * Synchronous version for cases where we can't wait for async calls
 */
export const convertRecommendedToRecipeCardSync = (recommended: RecommendedRecipe): RecipeCard => {
  // Generate basic cooking steps
  const instructions = recommended.steps ? 
    recommended.steps.map((step, index) => `${index + 1}. ${step}`).join('\n') :
    `Preparing ${recommended.name}:\n\n${recommended.description}\n\nPlease refer to professional recipes for detailed steps.`;
  
  const imageUrl = getConsistentPlaceholderImage(recommended.name);
  
  return {
    id: recommended.id,
    name: recommended.name,
    imageUrl,
    ingredients: recommended.ingredients || ['Prepare ingredients according to recipe'],
    cookingTime: recommended.cookingTime,
    instructions,
    difficulty: recommended.difficulty,
    calories: 'About 400-500 calories',
    servings: '2-3 servings',
  };
};

/**
 * Generate consistent placeholder image based on recipe name
 */
function getConsistentPlaceholderImage(recipeName: string): string {
  const images = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', // Delicious food 1
    'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop&auto=format', // Delicious food 2
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&auto=format', // Delicious food 3
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format', // Delicious food 4
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format', // Delicious food 5
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&auto=format', // Delicious food 6
  ];
  
  // Use recipe name to consistently select the same image
  const hash = recipeName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % images.length;
  return images[index];
}

/**
 * Main export function: Intelligent recipe recommendation parsing
 * Replaces the original smartExtractRecipes function
 */
export const parseAIRecommendations = (aiResponse: string): RecipeCard[] => {
  console.log('[StructuredParser] Starting to parse AI recipe recommendations...');
  console.log('[StructuredParser] Original response:', aiResponse);
  
  const result = parseStructuredRecommendations(aiResponse);
  if (result.success && result.recipes.length > 0) {
    const recipeCards = result.recipes.map(convertRecommendedToRecipeCardSync);
    console.log('[StructuredParser] Successfully parsed', recipeCards.length, 'recipes');
    console.log('[StructuredParser] Parse results:', recipeCards.map(card => ({
      name: card.name,
      cookingTime: card.cookingTime,
      difficulty: card.difficulty
    })));
    return recipeCards;
  } else {
    console.log('[StructuredParser] Parsing failed:', result.error);
    console.log('[StructuredParser] Response length:', aiResponse.length);
    console.log('[StructuredParser] Response preview:', aiResponse.substring(0, 500));
    
    // Try simple fallback parsing
    const fallbackCards = tryFallbackParsing(aiResponse);
    if (fallbackCards.length > 0) {
      console.log('[StructuredParser] Fallback parsing succeeded, found', fallbackCards.length, 'recipes');
      return fallbackCards;
    }
    
    // Return empty array, force AI to return correct format
    return [];
  }
};

/**
 * Enhanced async version that tries to fetch real images
 */
export const parseAIRecommendationsWithImages = async (aiResponse: string): Promise<RecipeCard[]> => {
  console.log('[StructuredParser] Starting async parsing with real images...');
  
  const result = parseStructuredRecommendations(aiResponse);
  if (result.success && result.recipes.length > 0) {
    // Convert with real images (async)
    const recipeCardsPromises = result.recipes.map(convertRecommendedToRecipeCard);
    const recipeCards = await Promise.all(recipeCardsPromises);
    
    console.log('[StructuredParser] Successfully parsed', recipeCards.length, 'recipes with images');
    return recipeCards;
  } else {
    // Fallback to sync version
    return parseAIRecommendations(aiResponse);
  }
};

/**
 * Fallback parsing: When standard parsing fails, try simple pattern matching
 */
function tryFallbackParsing(response: string): RecipeCard[] {
  console.log('[StructuredParser] Trying fallback parsing...');
  const cards: RecipeCard[] = [];
  
  // Find possible recipe name patterns: **Recipe Name** or Recipe Name (English Name) or Number. Recipe Name
  const namePatterns = [
    /\*\*([^*]+)\*\*/g,  // **Recipe Name**
    /(\d+)\.\s*([^(]+)\s*\(([^)]+)\)/g,  // 1. Recipe Name (English Name)
    /(\d+)\.\s*([^\n]+)/g,  // 1. Recipe Name
  ];
  
  let index = 0;
  for (const pattern of namePatterns) {
    const matches = Array.from(response.matchAll(pattern));
    for (const match of matches) {
      if (index >= 3) break; // Maximum 3 recipes
      
      let name = '';
      if (pattern === namePatterns[0]) {
        name = match[1].trim();
      } else if (pattern === namePatterns[1]) {
        name = match[2].trim();
      } else {
        name = match[2].trim();
      }
      
      // Filter out content that is obviously not a recipe name
      if (name && name.length > 1 && name.length < 50 && 
          !name.includes('Recommended') && !name.includes('Cooking') && 
          !name.includes('minutes') && !name.includes('Difficulty')) {
        
        const card: RecipeCard = {
          id: `fallback_recipe_${Date.now()}_${index}`,
          name,
          imageUrl: getConsistentPlaceholderImage(name),
          ingredients: ['Prepare ingredients according to recipe'],
          cookingTime: 'About 30 minutes',
          instructions: `For detailed steps to prepare ${name}, please refer to the complete recipe.`,
          difficulty: 'Medium',
          calories: 'About 400 calories',
          servings: '2-3 servings',
        };
        
        cards.push(card);
        index++;
      }
    }
    
    if (cards.length > 0) break; // Stop if recipe names are found
  }
  
  console.log('[StructuredParser] Fallback parsing results:', cards.map(c => c.name));
  return cards;
} 