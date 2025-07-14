import Constants from 'expo-constants';

const { EDAMAM_ID, EDAMAM_KEY } = Constants.expoConfig.extra;

// Fetch recipes from Edamam API
export async function fetchRecipesFromEdamam(ingredients) {
    try {
        console.log("Fetching recipes from Edamam for ingredients:", ingredients);
        
        // Join ingredients with spaces for the query
        const query = ingredients.join(' ');
        console.log("Edamam query:", query);
        
        const url = `https://api.edamam.com/api/recipes/v2?q=${encodeURIComponent(query)}&app_id=${EDAMAM_ID}&app_key=${EDAMAM_KEY}&type=public`;
        console.log("Edamam API URL:", url);
        
        const response = await fetch(url, {
            headers: {
                'Edamam-Account-User': 'picknic-user-123'
            }
        });
        console.log("Edamam API response status:", response.status);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Edamam API error: ${data.message || response.statusText}`);
        }
        
        if (!data.hits || data.hits.length === 0) {
            console.log("No recipes found for ingredients:", ingredients);
            return [];
        }
        
        console.log(`Found ${data.hits.length} raw recipes from Edamam API`);
        
        // Transform Edamam response to our recipe format
        const recipes = data.hits.map((hit, index) => {
            const recipe = hit.recipe;
            return {
                id: `edamam-${index}`,
                name: recipe.label,
                description: `A delicious recipe using ${ingredients.slice(0, 3).join(', ')} and more ingredients.`,
                rating: Math.floor(Math.random() * 3) + 3, // Random rating 3-5
                difficulty: getRandomDifficulty(),
                prepTime: `${Math.floor(Math.random() * 20) + 10} min`,
                cookTime: `${Math.floor(Math.random() * 45) + 15} min`,
                calories: Math.round(recipe.calories),
                ingredients: recipe.ingredientLines || [],
                instructions: generateInstructionsFromIngredients(recipe.ingredientLines || []),
                nutrition: recipe.totalNutrients || {},
                image: recipe.image || null,
                source: recipe.source || 'Edamam',
                url: recipe.url || null
            };
        });
        
        console.log(`Found ${recipes.length} recipes from Edamam`);
        return recipes;
        
    } catch (error) {
        console.error('Error fetching recipes from Edamam:', error);
        // Return mock recipes as fallback
        return generateMockRecipes(ingredients);
    }
}

// Generate mock recipes as fallback
function generateMockRecipes(ingredients) {
    const recipeNames = [
        `${ingredients[0]} and ${ingredients[1]} Delight`,
        `Fresh ${ingredients[0]} Medley`,
        `${ingredients[0]} Fusion Bowl`,
        `Gourmet ${ingredients[0]} Creation`,
        `${ingredients[0]} and ${ingredients[1]} Special`
    ];
    
    return recipeNames.map((name, index) => ({
        id: `mock-${index}`,
        name: name,
        description: `A delicious recipe featuring ${ingredients.slice(0, 3).join(', ')} and other fresh ingredients.`,
        rating: Math.floor(Math.random() * 3) + 3,
        difficulty: getRandomDifficulty(),
        prepTime: `${Math.floor(Math.random() * 20) + 10} min`,
        cookTime: `${Math.floor(Math.random() * 45) + 15} min`,
        calories: Math.floor(Math.random() * 500) + 200,
        ingredients: ingredients.map(ingredient => `${Math.floor(Math.random() * 3) + 1} ${ingredient}`),
        instructions: generateMockInstructions(ingredients),
        nutrition: {},
        image: null,
        source: 'Mock Recipe',
        url: null
    }));
}

// Generate random difficulty
function getRandomDifficulty() {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
}

// Generate mock cooking instructions
function generateMockInstructions(ingredients) {
    const baseInstructions = [
        `Prepare all ingredients by washing and chopping as needed.`,
        `Heat a large pan over medium heat and add oil.`,
        `Add ${ingredients[0]} and cook until softened.`,
        `Add ${ingredients[1]} and continue cooking for a few minutes.`,
        `Season with salt and pepper to taste.`,
        `Add remaining ingredients and cook until everything is well combined.`,
        `Serve hot and enjoy your delicious meal!`
    ];
    
    return baseInstructions;
}

// Generate instructions from ingredient lines
function generateInstructionsFromIngredients(ingredientLines) {
    if (!ingredientLines || ingredientLines.length === 0) {
        return generateMockInstructions(['ingredients']);
    }
    
    const instructions = [
        "Gather all the ingredients listed above.",
        "Prepare your cooking equipment and workspace.",
        "Follow the ingredient preparation steps as needed.",
        "Cook according to your preferred method.",
        "Season to taste and serve immediately."
    ];
    
    return instructions;
} 