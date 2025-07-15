import Constants from 'expo-constants';

const { OPENAI_API_KEY, GEMINI_API_KEY } = Constants.expoConfig.extra;

// Mock AI voice processing service
// In production, this would integrate with Gemini Live API or similar
export class AIVoiceService {
  
  // Simulate voice recording and processing
  static async processVoiceInput(audioData = null) {
    try {
      console.log('Processing voice input...');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in real implementation, this would come from AI API
      const mockResponse = {
        transcription: "I have some fresh tomatoes, basil, cheese, olive oil, and garlic in my kitchen.",
        ingredients: ['tomato', 'basil', 'cheese', 'olive oil', 'garlic'],
        confidence: 0.92,
        processingTime: 2.1
      };
      
      console.log('AI Voice processing result:', mockResponse);
      return mockResponse;
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw new Error('Failed to process voice input');
    }
  }
  
  // Process text input (manual typing)
  static async processTextInput(text) {
    try {
      console.log('Processing text input:', text);
      
      // Simple ingredient extraction from text
      const ingredients = this.extractIngredientsFromText(text);
      
      const response = {
        transcription: text,
        ingredients: ingredients,
        confidence: 0.85,
        processingTime: 0.5
      };
      
      console.log('Text processing result:', response);
      return response;
      
    } catch (error) {
      console.error('Error processing text input:', error);
      throw new Error('Failed to process text input');
    }
  }
  
  // Extract ingredients from text using simple NLP
  static extractIngredientsFromText(text) {
    const lowerText = text.toLowerCase();
    
    // Common ingredient keywords
    const ingredientKeywords = [
      'tomato', 'tomatoes', 'basil', 'cheese', 'olive oil', 'garlic', 'onion', 'onions',
      'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'eggs', 'milk',
      'butter', 'flour', 'sugar', 'salt', 'pepper', 'oregano', 'thyme', 'rosemary',
      'spinach', 'lettuce', 'carrot', 'carrots', 'potato', 'potatoes', 'rice', 'pasta',
      'bread', 'avocado', 'lemon', 'lime', 'orange', 'apple', 'banana', 'strawberry',
      'mushroom', 'mushrooms', 'bell pepper', 'bell peppers', 'cucumber', 'cucumbers',
      'zucchini', 'eggplant', 'broccoli', 'cauliflower', 'corn', 'peas', 'beans',
      'lentils', 'chickpeas', 'quinoa', 'oatmeal', 'yogurt', 'cream', 'sour cream',
      'parmesan', 'mozzarella', 'cheddar', 'feta', 'blue cheese', 'goat cheese',
      'tofu', 'tempeh', 'seitan', 'nuts', 'almonds', 'walnuts', 'peanuts', 'cashews',
      'honey', 'maple syrup', 'soy sauce', 'vinegar', 'mustard', 'ketchup', 'mayo'
    ];
    
    // Extract ingredients from text
    const foundIngredients = ingredientKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );
    
    // Remove duplicates and limit to reasonable number
    const uniqueIngredients = [...new Set(foundIngredients)].slice(0, 10);
    
    return uniqueIngredients;
  }
  
  // Future: Integrate with Gemini Live API
  static async processWithGeminiLiveAPI(audioData) {
    // TODO: Implement actual Gemini Live API integration
    // This would replace the mock implementation above
    
    try {
      // Example integration structure:
      /*
      const response = await fetch('your-gemini-live-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          audio: audioData,
          prompt: "Extract food ingredients from this voice input. Return as JSON with ingredients array."
        })
      });
      
      const result = await response.json();
      return {
        transcription: result.transcription,
        ingredients: result.ingredients,
        confidence: result.confidence,
        processingTime: result.processingTime
      };
      */
      
      // For now, return mock data
      return this.processVoiceInput(audioData);
      
    } catch (error) {
      console.error('Gemini Live API error:', error);
      throw new Error('Failed to process with Gemini Live API');
    }
  }
  
  // Validate ingredients list
  static validateIngredients(ingredients) {
    if (!Array.isArray(ingredients)) {
      throw new Error('Ingredients must be an array');
    }
    
    if (ingredients.length === 0) {
      throw new Error('No ingredients detected');
    }
    
    if (ingredients.length > 15) {
      throw new Error('Too many ingredients detected (max 15)');
    }
    
    return ingredients.filter(ingredient => 
      typeof ingredient === 'string' && ingredient.trim().length > 0
    );
  }
}

export default AIVoiceService; 