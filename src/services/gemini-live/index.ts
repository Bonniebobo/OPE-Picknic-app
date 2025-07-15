/**
 * Gemini Live API Integration for React Native + Expo
 * Main export file for all services and types
 */

// Core client
export { GeminiLiveClient } from './GeminiLiveClient';

// Services
export { AudioService } from './audio/AudioService';
export { VideoService } from './video/VideoService';

// Context and hooks
export { LiveAPIProvider, useLiveAPI } from './context/LiveAPIContext';

// Types
export type {
  LiveClientOptions,
  LiveConnectConfig,
  StreamingLog,
  LiveClientEventTypes,
  ConnectionStatus,
  MediaChunk,
  IngredientDetectionResult,
  AudioRecordingState,
  VideoRecordingState,
} from './types'; 