// Fresh test for Edamam API with new credentials
import { edamamId, edamamKey } from './src/services/secrets.js';

async function testEdamamAPI() {
    console.log('🧪 Testing Edamam API with NEW credentials...\n');
    console.log('App ID:', edamamId);
    console.log('App Key:', edamamKey);
    
    try {
        const testIngredients = ['tomato', 'basil', 'cheese'];
        console.log('\nTesting with ingredients:', testIngredients);
        
        // Join ingredients with spaces for the query
        const query = testIngredients.join(' ');
        console.log('Edamam query:', query);
        
        const url = `https://api.edamam.com/api/recipes/v2?q=${encodeURIComponent(query)}&app_id=${edamamId}&app_key=${edamamKey}&type=public`;
        console.log('Edamam API URL:', url);
        
        const response = await fetch(url, {
            headers: {
                'Edamam-Account-User': 'test-user@myapp.com'
            }
        });
        console.log('Edamam API response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Edamam API response received successfully!');
        
        if (!data.hits || data.hits.length === 0) {
            console.log("❌ No recipes found for ingredients:", testIngredients);
            return;
        }
        
        console.log(`✅ Edamam API returned ${data.hits.length} recipes`);
        
        if (data.hits.length > 0) {
            const firstRecipe = data.hits[0].recipe;
            console.log('\n📋 Sample recipe details:');
            console.log('Name:', firstRecipe.label);
            console.log('Source:', firstRecipe.source);
            console.log('URL:', firstRecipe.url);
            console.log('Calories:', Math.round(firstRecipe.calories));
            console.log('Sample ingredients:', firstRecipe.ingredientLines?.slice(0, 3) || []);
        }
        
    } catch (error) {
        console.error('❌ Edamam API test failed:', error.message);
    }
}

testEdamamAPI().catch(console.error); 