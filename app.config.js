import 'dotenv/config';

export default {
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
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      EDAMAM_ID: process.env.EDAMAM_ID,
      EDAMAM_KEY: process.env.EDAMAM_KEY,
      AZURE_ENDPOINT: process.env.AZURE_ENDPOINT,
      AZURE_API_KEY: process.env.AZURE_API_KEY,
    },
  },
}; 