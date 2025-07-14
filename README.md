# Picknic 🍱

Picknic is a multi-modal food wellness assistant built with React Native and Expo. It leverages the OpenAI Vision API and Edamam API, allowing users to input ingredients via photo, text, or voice, and receive smart recipe and wellness suggestions.

## ✨ Features
- **Mood Matcher**: Comfort food suggestions based on your mood
- **Recipe Helper**: Smart kitchen companion to help you decide what to cook
- **Experienced Explorer**: Discover world cuisines and local restaurants
- **Game Mode**: Play mini-games to choose your meal
- Ingredient recognition via photo, text, or voice
- Recipe generation, favorites, meal calendar, and more

## 🛠️ Tech Stack
- React Native 0.79 + Expo 53
- TypeScript
- OpenAI GPT-4 Vision API
- Edamam Recipe API
- React Navigation 7

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd OPE-Picknic-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root with the following content:
```env
OPENAI_API_KEY=your_openai_key
EDAMAM_ID=your_edamam_app_id
EDAMAM_KEY=your_edamam_app_key
AZURE_ENDPOINT=your_azure_openai_endpoint (optional)
AZURE_API_KEY=your_azure_openai_key (optional)
```
> ⚠️ `.env` is already in `.gitignore` and will not be committed to GitHub.

### 4. Start the project
```bash
npm start
```
or
```bash
expo start
```

### 5. Supported Platforms
- iOS, Android, Web (Expo Go or emulator required)

## 🔑 Environment Variables
- `OPENAI_API_KEY`: OpenAI GPT-4/Vision API key
- `EDAMAM_ID`, `EDAMAM_KEY`: Edamam Recipe API credentials
- `AZURE_ENDPOINT`, `AZURE_API_KEY`: (Optional) For Azure OpenAI integration

## 📦 Project Structure
```
OPE-Picknic-app/
├── src/
│   ├── screens/      # All screen components
│   └── services/     # API calls and business logic
├── assets/           # Static assets
├── App.tsx           # Entry point
├── app.config.js     # Expo config, loads .env
├── .env              # Local environment variables
└── ...
```

## 🤝 Contributing
- Issues, PRs, and suggestions are welcome!
- After cloning, remember to create your own `.env` file to access APIs.

---

> For learning and research purposes only. Please keep your API keys secure and do not share them publicly. 