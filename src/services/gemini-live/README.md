# Gemini Live API Integration for Picknic App

## Overview

This integration brings Google's Gemini Live API to your React Native + Expo Picknic app, enabling real-time multimodal AI interactions for ingredient recognition and recipe discovery.

## Features

### 🎤 **Voice Input**
- Real-time voice recording using expo-av
- Speech-to-text processing via Gemini Live API
- Natural language ingredient detection
- Audio feedback from AI responses

### 📷 **Visual Input**
- Live camera capture with expo-camera
- Photo upload from gallery
- Real-time image analysis for ingredient recognition
- Automatic categorization (vegetables, protein, staples, seasoning)

### ✏️ **Text Input**
- Direct text descriptions of ingredients
- Natural language processing
- Context-aware ingredient extraction

### 🧠 **Real-time AI Processing**
- WebSocket connection to Gemini Live API
- Streaming ingredient detection
- Confidence scores for detected items
- Automatic deduplication of ingredients

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ AIAssistantScreen│    │  LiveAPIProvider │    │ GeminiLiveClient│
│                 │◄───┤                  │◄───┤                 │
│ - Voice UI      │    │ - State Management│    │ - WebSocket     │
│ - Camera UI     │    │ - Event Handling │    │ - Streaming     │
│ - Ingredient UI │    │ - Context Hooks  │    │ - Parsing       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AudioService  │    │   VideoService   │    │ Edamam Service  │
│                 │    │                  │    │                 │
│ - Recording     │    │ - Camera Control │    │ - Recipe Search │
│ - Playback      │    │ - Image Capture  │    │ - Result Filter │
│ - Format Convert│    │ - Gallery Access │    │ - API Calls     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Components

### Core Services

#### **GeminiLiveClient** (`GeminiLiveClient.ts`)
- Main WebSocket client for Gemini Live API
- Handles connection, reconnection, and message processing
- Implements ingredient detection with deduplication
- Event-driven architecture using EventEmitter

#### **AudioService** (`audio/AudioService.ts`)
- Audio recording using expo-av
- Optimized settings for speech recognition (16kHz, mono)
- Real-time audio processing and format conversion
- Audio playback for AI responses

#### **VideoService** (`video/VideoService.ts`)
- Image capture via expo-camera
- Gallery image selection
- Base64 encoding for API transmission
- Permission handling

#### **LiveAPIProvider** (`context/LiveAPIContext.tsx`)
- React Context for global state management
- Automatic event listener setup
- Service lifecycle management
- Error handling and retry logic

### React Components

#### **AIAssistantScreen** (`screens/AIAssistantScreen.tsx`)
- Main UI for multimodal input
- Real-time ingredient display
- Category-based organization
- Connection status indicators

## Setup Instructions

### 1. Environment Configuration

Add your Gemini API key to the `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies

The following dependencies are required:
```bash
npm install @google/generative-ai eventemitter3
```

**Note**: `expo-av`, `expo-camera`, and `expo-file-system` are already installed.

### 3. Integration

The integration is already complete! The AI Assistant is available as a new bot option in the home screen.

## Usage

### For Users

1. **Select AI Assistant** from the home screen
2. **Choose Input Method**:
   - 🎤 **Voice**: Tap to record, describe your ingredients
   - 📷 **Camera**: Capture live photos of ingredients
   - 📁 **Photo**: Upload from gallery
   - ✏️ **Text**: Type ingredient descriptions

3. **Review Detected Ingredients**: Ingredients are automatically categorized and you can toggle selections
4. **Continue**: Proceed to recipe results with selected ingredients

### For Developers

#### Using the Live API Context

```tsx
import { useLiveAPI } from '../services/gemini-live';

function MyComponent() {
  const {
    status,           // 'connected' | 'connecting' | 'disconnected'
    connect,          // () => Promise<boolean>
    startAudioRecording, // () => Promise<boolean>
    detectedIngredients, // IngredientDetectionResult[]
    error,            // string | null
  } = useLiveAPI();

  // Component logic here
}
```

#### Custom Ingredient Detection

```tsx
// Listen for ingredient detection events
useEffect(() => {
  const handleIngredients = (ingredients: IngredientDetectionResult[]) => {
    console.log('New ingredients detected:', ingredients);
  };

  client.on('ingredientsDetected', handleIngredients);
  return () => client.off('ingredientsDetected', handleIngredients);
}, [client]);
```

## File Structure

```
src/services/gemini-live/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript definitions
├── GeminiLiveClient.ts         # Core WebSocket client
├── audio/
│   └── AudioService.ts         # Audio recording/playback
├── video/
│   └── VideoService.ts         # Camera/image handling
└── context/
    └── LiveAPIContext.tsx      # React context provider

src/screens/
└── AIAssistantScreen.tsx       # Main UI component
```

## API Configuration

### Gemini Live API Settings

```typescript
const config = {
  model: 'models/gemini-2.0-flash-exp',
  systemInstruction: {
    parts: [{
      text: `You are an intelligent food assistant. When users provide audio, video, or images of ingredients, analyze them and extract a comprehensive list of ingredients you can identify. Focus on:

1. INGREDIENTS ONLY: Only identify actual food ingredients
2. BE SPECIFIC: Use specific names (e.g., "red bell pepper")
3. CATEGORIZE: Classify as vegetables, protein, staples, or seasoning
4. BE COMPREHENSIVE: Try to identify all visible ingredients
5. RESPOND FORMAT: Provide JSON array with format: [{"ingredient": "name", "category": "vegetables|protein|staples|seasoning", "confidence": 0.8}]`
    }]
  },
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
  }
}
```

## Error Handling

The integration includes comprehensive error handling:

- **Connection failures**: Automatic retry with user feedback
- **Permission denials**: Clear error messages and retry options
- **API errors**: Graceful degradation with fallback options
- **Network issues**: Connection status indicators

## Debugging

Enable debug logs by setting `__DEV__` to `true`. Logs will appear in:
- Console output
- Debug section in AI Assistant screen (development only)

## Limitations

1. **Video Recording**: Currently supports image capture only (video recording placeholder)
2. **Audio Streaming**: One-way audio (recording only, no real-time streaming)
3. **Offline Mode**: Requires active internet connection
4. **API Limits**: Subject to Gemini API rate limits and quotas

## Future Enhancements

- [ ] Real-time video streaming to Gemini Live API
- [ ] Two-way audio conversations
- [ ] Offline ingredient recognition
- [ ] Custom ingredient training
- [ ] Multi-language support
- [ ] Advanced filtering and categorization

## Troubleshooting

### Common Issues

**"Connection Failed"**
- Check your Gemini API key in `.env`
- Verify internet connection
- Ensure API key has Live API access

**"Permission Denied"**
- Grant camera/microphone permissions in device settings
- Restart the app after granting permissions

**"No Ingredients Detected"**
- Try clearer audio descriptions
- Ensure good lighting for photos
- Use specific ingredient names

**Build Errors**
- Run `npm install` to ensure all dependencies are installed
- Check that expo-av, expo-camera are properly linked

## Support

For issues with this integration:
1. Check the debug logs in development mode
2. Verify API key configuration
3. Ensure all permissions are granted
4. Review the troubleshooting section above

For Gemini Live API issues, refer to the [official documentation](https://ai.google.dev/api/multimodal-live). 