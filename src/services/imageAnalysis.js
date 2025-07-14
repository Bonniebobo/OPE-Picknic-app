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

const assistMessage = `
OUTPUT:
`;

// Identify ingredients from an image using OpenAI Vision API
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
                userMessage,
                "gpt-4-vision-preview",
                0.0
            );
        } else {
            console.log("Using Azure OpenAI Vision API...");
            response_json = await call_azure_openai_api_vision(
                imageBase64,
                userMessage,
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