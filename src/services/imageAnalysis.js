import { call_openai_api_vision, call_azure_openai_api_vision } from './GPT-APIs';

const LLM_Models = {
    "vision": "openai", // or "azure"
};

const sysMessage_identify_ingredients = `
You are a professional chef and food expert. Your task is to identify all visible ingredients in the provided food image.
Provide the answer in English with the following JSON format between the <OUTPUT> and </OUTPUT> tags.
<OUTPUT>[{"_ingredients": ["ingredient1", "ingredient2", "ingredient3", "ingredient4", "ingredient5"]}]</OUTPUT>

Instructions:
1. Identify all visible ingredients in the food image.
2. List only the main ingredients that are clearly visible.
3. Use common ingredient names (e.g., "tomato" not "tomatoes").
4. Limit to 10-15 most important ingredients.
5. Do not output any interim information.

<EXAMPLE>
INPUT: A food image showing a pasta dish with tomato sauce, basil, and cheese.

OUTPUT:
<OUTPUT>[{"_ingredients": ["pasta", "tomato", "basil", "cheese", "olive oil", "garlic", "onion"]}]</OUTPUT>
</EXAMPLE>
`;

const sysMessage_identify_dish_and_ingredients = `
You are a professional chef and food expert. Your task is to analyze a food image and determine if it shows a complete dish or individual ingredients.

Provide the answer in English with the following JSON format between the <OUTPUT> and </OUTPUT> tags:

For a COMPLETE DISH:
<OUTPUT>[{"type": "dish", "dish_name": "Beef Fajitas", "_ingredients": ["beef", "bell pepper", "onion", "tortilla", "lime"]}]</OUTPUT>

For INDIVIDUAL INGREDIENTS:
<OUTPUT>[{"type": "ingredients", "_ingredients": ["ingredient1", "ingredient2", "ingredient3"]}]</OUTPUT>

Instructions:
1. First determine if the image shows a complete prepared dish or individual ingredients
2. If it's a dish: Provide the dish name in English (e.g., "Chicken Curry", "Beef Stir Fry") 
3. Always include the main ingredients list in both cases
4. Use common English names for dishes that would be found in recipe databases
5. Limit ingredients to 10-15 most important items
6. Use singular ingredient names (e.g., "tomato" not "tomatoes")

<EXAMPLES>
INPUT: A photo of cooked beef fajitas with peppers and onions in a pan

OUTPUT:
<OUTPUT>[{"type": "dish", "dish_name": "Beef Fajitas", "_ingredients": ["beef", "bell pepper", "onion", "tortilla", "cilantro", "lime"]}]</OUTPUT>

INPUT: A photo of raw vegetables laid out on a counter

OUTPUT:
<OUTPUT>[{"type": "ingredients", "_ingredients": ["tomato", "bell pepper", "onion", "carrot", "broccoli"]}]</OUTPUT>
</EXAMPLES>
`;

const assistMessage = `
OUTPUT:
`;

// Enhanced function to identify both dishes and ingredients
export async function identify_food_from_image(imageBase64) {
    try {
        console.log("Starting enhanced food identification...");
        console.log("Image base64 length:", imageBase64 ? imageBase64.length : 0);
        
        const userMessage = `Please analyze this food image and determine if it shows a complete dish or individual ingredients. Provide the result in the specified JSON format.`;
        let response_json = [];
        
        if (LLM_Models.vision === 'openai') {
            console.log("Using OpenAI Vision API for dish/ingredient analysis...");
            response_json = await call_openai_api_vision(
                imageBase64,
                sysMessage_identify_dish_and_ingredients + "\n\n" + userMessage + "\n\n" + assistMessage,
                "gpt-4-vision-preview",
                0.0
            );
        } else {
            console.log("Using Azure OpenAI Vision API for dish/ingredient analysis...");
            response_json = await call_azure_openai_api_vision(
                imageBase64,
                sysMessage_identify_dish_and_ingredients + "\n\n" + userMessage + "\n\n" + assistMessage,
                "gpt-4-vision",
                0.0
            );
        }
        
        if (response_json && response_json.length > 0) {
            const result = response_json[0];
            
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
        
        console.log("No valid food identification result");
        return {
            type: "ingredients",
            ingredients: []
        };
    } catch (error) {
        console.error('Error identifying food from image:', error);
        // Return fallback ingredients
        return {
            type: "ingredients",
            ingredients: ["tomato", "onion", "garlic", "olive oil"]
        };
    }
}

// Legacy function - kept for backward compatibility
export async function identify_image_ingredients(imageBase64) {
    try {
        console.log("Starting image ingredient identification...");
        console.log("Image base64 length:", imageBase64 ? imageBase64.length : 0);
        
        const userMessage = `Please identify all visible ingredients in this food image.`;
        let response_json = [];
        
        if (LLM_Models.vision === 'openai') {
            console.log("Using OpenAI Vision API...");
            response_json = await call_openai_api_vision(
                imageBase64,
                sysMessage_identify_ingredients + "\n\n" + userMessage + "\n\n" + assistMessage,
                "gpt-4-vision-preview",
                0.0
            );
        } else {
            console.log("Using Azure OpenAI Vision API...");
            response_json = await call_azure_openai_api_vision(
                imageBase64,
                sysMessage_identify_ingredients + "\n\n" + userMessage + "\n\n" + assistMessage,
                "gpt-4-vision",
                0.0
            );
        }
        
        if (response_json && response_json.length > 0 && response_json[0]["_ingredients"]) {
            const ingredients = response_json[0]["_ingredients"];
            console.log("Identified ingredients:", ingredients);
            return ingredients;
        } else {
            console.log("No ingredients identified from image");
            return [];
        }
    } catch (error) {
        console.error('Error identifying ingredients from image:', error);
        // Return some default ingredients as fallback
        return ["tomato", "basil", "cheese", "olive oil", "garlic"];
    }
} 