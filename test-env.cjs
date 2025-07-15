const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv with explicit path
const envPath = path.resolve(__dirname, '.env');
console.log('🔍 Looking for .env at:', envPath);

const result = dotenv.config({ path: envPath });
console.log('🔍 Dotenv result:', result.error ? `Error: ${result.error}` : 'Success');

console.log('🧪 Environment Variables Test:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'LOADED ✅' : 'NOT FOUND ❌');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'LOADED ✅' : 'NOT FOUND ❌');
console.log('EDAMAM_ID:', process.env.EDAMAM_ID ? 'LOADED ✅' : 'NOT FOUND ❌');
console.log('EDAMAM_KEY:', process.env.EDAMAM_KEY ? 'LOADED ✅' : 'NOT FOUND ❌');

// Test the exact values (first few characters only for security)
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
} 