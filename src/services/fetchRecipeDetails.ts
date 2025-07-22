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
 * 根据菜名从 Edamam API 获取详细菜谱信息
 */
export async function fetchRecipeDetails(recipeName: string): Promise<DetailedRecipe | null> {
  try {
    console.log('[EdamamAPI] 开始搜索菜谱:', recipeName);
    
    // 验证 API 凭据
    if (!EDAMAM_ID || !EDAMAM_KEY) {
      console.error('[EdamamAPI] 缺少 API 凭据');
      return null;
    }

    // 构建查询参数
    const queryParams = new URLSearchParams({
      q: recipeName,
      type: 'public',
      app_id: EDAMAM_ID,
      app_key: EDAMAM_KEY,
      from: '0',
      to: '5', // 获取前5个结果
    });

    const url = `https://api.edamam.com/api/recipes/v2?${queryParams.toString()}`;
    console.log('[EdamamAPI] 请求URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Edamam-Account-User': 'picknic-user-123',
      },
    });

    console.log('[EdamamAPI] 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EdamamAPI] 请求失败:', response.status, errorText);
      return null;
    }

    const data: EdamamRecipeResponse = await response.json();
    console.log('[EdamamAPI] 找到', data.hits?.length || 0, '个菜谱');

    if (!data.hits || data.hits.length === 0) {
      console.log('[EdamamAPI] 未找到匹配的菜谱:', recipeName);
      return null;
    }

    // 取第一个最匹配的结果
    const firstMatch = data.hits[0].recipe;
    console.log('[EdamamAPI] 选择菜谱:', firstMatch.label);

    const detailedRecipe: DetailedRecipe = {
      name: firstMatch.label,
      image: firstMatch.image || '',
      ingredients: firstMatch.ingredientLines || [],
      url: firstMatch.url,
      cookTime: firstMatch.totalTime ? `${firstMatch.totalTime} 分钟` : undefined,
      servings: firstMatch.yield ? `${firstMatch.yield} 人份` : undefined,
      calories: firstMatch.calories ? Math.round(firstMatch.calories) : undefined,
      source: firstMatch.source || 'Edamam',
    };

    console.log('[EdamamAPI] 解析完成:', {
      name: detailedRecipe.name,
      ingredientsCount: detailedRecipe.ingredients.length,
      hasImage: !!detailedRecipe.image,
      hasUrl: !!detailedRecipe.url,
    });

    return detailedRecipe;

  } catch (error) {
    console.error('[EdamamAPI] 请求异常:', error);
    return null;
  }
}

/**
 * 批量获取多个菜谱的详细信息
 */
export async function fetchMultipleRecipeDetails(recipeNames: string[]): Promise<DetailedRecipe[]> {
  console.log('[EdamamAPI] 批量获取菜谱详情:', recipeNames);
  
  const promises = recipeNames.map(name => fetchRecipeDetails(name));
  const results = await Promise.allSettled(promises);
  
  const successfulResults = results
    .filter((result): result is PromiseFulfilledResult<DetailedRecipe> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value!);

  console.log('[EdamamAPI] 批量获取完成:', successfulResults.length, '/', recipeNames.length);
  return successfulResults;
}

/**
 * 搜索相似菜谱（用于推荐）
 */
export async function searchSimilarRecipes(baseRecipeName: string, count: number = 3): Promise<DetailedRecipe[]> {
  try {
    console.log('[EdamamAPI] 搜索相似菜谱:', baseRecipeName);
    
    if (!EDAMAM_ID || !EDAMAM_KEY) {
      console.error('[EdamamAPI] 缺少 API 凭据');
      return [];
    }

    // 提取关键词进行搜索
    const keywords = baseRecipeName.split(/[\s,，]/).filter(word => word.length > 1);
    const searchQuery = keywords.slice(0, 2).join(' '); // 使用前两个关键词

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
      console.error('[EdamamAPI] 相似菜谱搜索失败:', response.status);
      return [];
    }

    const data: EdamamRecipeResponse = await response.json();
    const recipes = data.hits?.map(hit => ({
      name: hit.recipe.label,
      image: hit.recipe.image || '',
      ingredients: hit.recipe.ingredientLines || [],
      url: hit.recipe.url,
      cookTime: hit.recipe.totalTime ? `${hit.recipe.totalTime} 分钟` : undefined,
      servings: hit.recipe.yield ? `${hit.recipe.yield} 人份` : undefined,
      calories: hit.recipe.calories ? Math.round(hit.recipe.calories) : undefined,
      source: hit.recipe.source || 'Edamam',
    })) || [];

    console.log('[EdamamAPI] 找到', recipes.length, '个相似菜谱');
    return recipes;

  } catch (error) {
    console.error('[EdamamAPI] 相似菜谱搜索异常:', error);
    return [];
  }
} 