// Test script to verify API connections
// Run with: node test-apis.js

import { identify_image_ingredients } from './src/services/imageAnalysis';
import { fetchRecipesFromEdamam } from './src/services/edamamService';

async function testAPIs() {
    console.log('🧪 Testing API connections...\n');
    
    // Test 1: Edamam API with known ingredients
    console.log('1️⃣ Testing Edamam API...');
    try {
        const testIngredients = ['tomato', 'basil', 'cheese'];
        console.log('Testing with ingredients:', testIngredients);
        
        const recipes = await fetchRecipesFromEdamam(testIngredients);
        console.log(`✅ Edamam API returned ${recipes.length} recipes`);
        
        if (recipes.length > 0) {
            console.log('Sample recipe:', recipes[0].name);
            console.log('Sample ingredients:', recipes[0].ingredients.slice(0, 3));
        }
    } catch (error) {
        console.error('❌ Edamam API test failed:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: OpenAI Vision API (would need a real image)
    console.log('2️⃣ Testing OpenAI Vision API...');
    console.log('⚠️  This test requires a real image. Skipping for now.');
    console.log('To test Vision API, upload a photo in the app and check console logs.');
    
    console.log('\n✅ API tests completed!');
    console.log('\n📝 To verify the full flow:');
    console.log('1. Open the app');
    console.log('2. Go to Recipe Helper → Photo Your Dish');
    console.log('3. Take or upload a photo');
    console.log('4. Check the console logs for API calls');
}

testAPIs().catch(console.error); 