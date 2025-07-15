const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv with explicit path
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });
console.log('🔍 Dotenv result:', result.error ? `Error: ${result.error}` : 'Success');

// Get environment variables with fallbacks
const getEnvValue = (key, fallback = undefined) => {
  const value = process.env[key];
  if (!value && fallback) {
    console.log(`⚠️ Using fallback for ${key}`);
    return fallback;
  }
  return value;
};

// Debug: Check if environment variables are loaded at build time
console.log('🔧 Build time environment check:');
console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);
console.log('EDAMAM_ID loaded:', !!process.env.EDAMAM_ID);
console.log('EDAMAM_KEY loaded:', !!process.env.EDAMAM_KEY);
console.log('OPENAI_API_KEY loaded:', !!process.env.OPENAI_API_KEY);

module.exports = ({ config }) => ({
  ...config,
  expo: {
    name: "Picknic",
    slug: "picknic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/Appicon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      entryPoint: "./App.tsx"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      OPENAI_API_KEY: getEnvValue('OPENAI_API_KEY'),
      EDAMAM_ID: getEnvValue('EDAMAM_ID', 'acd521ac'), // fallback for development
      EDAMAM_KEY: getEnvValue('EDAMAM_KEY', '2b2df14a238cb81f96340206badb35e3'), // fallback for development
      AZURE_ENDPOINT: getEnvValue('AZURE_ENDPOINT'),
      AZURE_API_KEY: getEnvValue('AZURE_API_KEY'),
      GEMINI_API_KEY: getEnvValue('GEMINI_API_KEY'), // Added for Gemini Live API
    },
  },
}); 