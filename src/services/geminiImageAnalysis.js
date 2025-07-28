import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_IMAGE_GENERATION_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent';

const sysMessage_identify_dish_and_ingredients = `
You are a professional chef and food expert. Your task is to analyze a food image and determine if it shows a complete dish or individual ingredients.

Provide the answer in English with the following JSON format:

For a COMPLETE DISH:
{"type": "dish", "dish_name": "Beef Fajitas", "_ingredients": ["beef", "bell pepper", "onion", "tortilla", "lime"]}

For INDIVIDUAL INGREDIENTS:
{"type": "ingredients", "_ingredients": ["ingredient1", "ingredient2", "ingredient3"]}

Instructions:
1. First determine if the image shows a complete prepared dish or individual ingredients
2. If it's a dish: Provide the dish name in English (e.g., "Chicken Curry", "Beef Stir Fry") 
3. Always include the main ingredients list in both cases
4. Use common English names for dishes that would be found in recipe databases
5. Limit ingredients to 10-15 most important items
6. Use singular ingredient names (e.g., "tomato" not "tomatoes")

EXAMPLES:
INPUT: A photo of cooked beef fajitas with peppers and onions in a pan
OUTPUT: {"type": "dish", "dish_name": "Beef Fajitas", "_ingredients": ["beef", "bell pepper", "onion", "tortilla", "cilantro", "lime"]}

INPUT: A photo of raw vegetables laid out on a counter
OUTPUT: {"type": "ingredients", "_ingredients": ["tomato", "bell pepper", "onion", "carrot", "broccoli"]}
`;

// Enhanced function to identify both dishes and ingredients using Gemini
export async function identify_food_from_image_gemini(imageBase64) {
    try {
        console.log("Starting Gemini food identification...");
        console.log("Image base64 length:", imageBase64 ? imageBase64.length : 0);
        
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            throw new Error('Gemini API key is not configured');
        }

        const userMessage = `Please analyze this food image and determine if it shows a complete dish or individual ingredients. Provide the result in the specified JSON format.`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: sysMessage_identify_dish_and_ingredients + "\n\n" + userMessage },
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: imageBase64,
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.0,
                topK: 1,
                topP: 1,
                maxOutputTokens: 1024,
            },
        };

        console.log("Sending request to Gemini API...");
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            throw new Error(`Gemini API error: ${response.status} ${errorText}`);
        }

        const responseData = await response.json();
        console.log("Gemini API response:", responseData);

        if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content) {
            const content = responseData.candidates[0].content.parts[0].text;
            console.log("Raw Gemini response text:", content);
            
            try {
                // Try to extract JSON from the response
                let jsonMatch = content.match(/\{[^}]*\}/);
                if (!jsonMatch) {
                    // Try to find JSON with array format
                    jsonMatch = content.match(/\{[^}]*"_ingredients":\s*\[[^\]]*\][^}]*\}/);
                }
                
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    console.log("Parsed result:", result);
                    
                    if (result.type === "dish" && result.dish_name && result._ingredients) {
                        console.log("Identified dish:", result.dish_name);
                        console.log("Dish ingredients:", result._ingredients);
                        return {
                            type: "dish",
                            dishName: result.dish_name,
                            ingredients: result._ingredients
                        };
                    } else if (result.type === "ingredients" && result._ingredients) {
                        console.log("Identified ingredients:", result._ingredients);
                        return {
                            type: "ingredients", 
                            ingredients: result._ingredients
                        };
                    }
                }
            } catch (parseError) {
                console.error('Error parsing JSON from Gemini response:', parseError);
                console.log('Attempting fallback parsing...');
                
                // Fallback: try to extract ingredients from text
                const ingredientMatches = content.match(/["']([^"']+)["']/g);
                if (ingredientMatches) {
                    const ingredients = ingredientMatches.map(match => match.replace(/["']/g, ''));
                    return {
                        type: "ingredients",
                        ingredients: ingredients.slice(0, 10) // Limit to 10 ingredients
                    };
                }
            }
        }
        
        console.log("No valid food identification result from Gemini");
        return {
            type: "ingredients",
            ingredients: ["tomato", "onion", "garlic", "olive oil"] // Fallback ingredients
        };
    } catch (error) {
        console.error('Error identifying food from image with Gemini:', error);
        // Return fallback ingredients
        return {
            type: "ingredients",
            ingredients: ["tomato", "onion", "garlic", "olive oil"]
        };
    }
}

// Legacy function for backward compatibility - just ingredients
export async function identify_image_ingredients_gemini(imageBase64) {
    try {
        const result = await identify_food_from_image_gemini(imageBase64);
        return result.ingredients || [];
    } catch (error) {
        console.error('Error identifying ingredients from image with Gemini:', error);
        return ["tomato", "basil", "cheese", "olive oil", "garlic"];
    }
}

/**
 * Generate recipe image using Gemini AI
 * @param {string} recipeName - The name of the recipe to generate image for
 * @param {string} description - Optional description to improve image quality
 * @returns {Promise<string|null>} - Base64 image data or null if failed
 */
export async function generateRecipeImageWithGemini(recipeName, description = '') {
    try {
        console.log("Starting Gemini recipe image generation for:", recipeName);
        
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set for image generation');
            return null;
        }

        // Create a detailed prompt for food photography
        const prompt = `Generate a high-quality, appetizing photograph of ${recipeName}. ${description ? description + '. ' : ''}The image should be:
- Professional food photography style
- Well-lit with natural lighting
- Beautifully plated and presented
- High resolution and detailed
- Restaurant-quality presentation
- Warm, inviting colors
- Sharp focus on the food
- Clean, minimal background

Make it look delicious and appetizing, suitable for a recipe app.`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 8192,
                // Request both text and image response
                responseModalities: ["TEXT", "IMAGE"]
            },
        };

        console.log("Sending image generation request to Gemini API...");
        const response = await fetch(`${GEMINI_IMAGE_GENERATION_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini image generation API error:', response.status, errorText);
            return null;
        }

        const responseData = await response.json();
        console.log("Gemini image generation response received");

        if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content) {
            const parts = responseData.candidates[0].content.parts;
            
            // Look for image data in the response
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    console.log("Successfully generated recipe image for:", recipeName);
                    return part.inlineData.data; // Return base64 image data
                }
            }
        }
        
        console.log("No image data found in Gemini response");
        return null;
    } catch (error) {
        console.error('Error generating recipe image with Gemini:', error);
        return null;
    }
}

/**
 * Generate recipe image URL using Gemini AI and convert to data URL
 * @param {string} recipeName - The name of the recipe
 * @param {string} description - Optional description
 * @returns {Promise<string|null>} - Data URL or null if failed
 */
export async function generateRecipeImageUrl(recipeName, description = '') {
    try {
        const base64Data = await generateRecipeImageWithGemini(recipeName, description);
        if (base64Data) {
            // Convert to data URL for use in React Native Image component
            return `data:image/jpeg;base64,${base64Data}`;
        }
        return null;
    } catch (error) {
        console.error('Error generating recipe image URL:', error);
        return null;
    }
}