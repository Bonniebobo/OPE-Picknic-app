/**
 * Gemini Live API Types for React Native + Expo
 * Adapted from Google's Live API Web Console
 */

export interface LiveClientOptions {
  apiKey: string;
}

export interface StreamingLog {
  date: Date;
  type: string;
  count?: number;
  message: any;
}

export interface LiveConnectConfig {
  model?: string;
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  tools?: Array<any>;
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    responseModalities?: string[];
  };
}

export interface MediaChunk {
  mimeType: string;
  data: string; // base64 encoded
}

export interface IngredientDetectionResult {
  ingredient: string;
  confidence: number;
  category?: 'vegetables' | 'protein' | 'staples' | 'seasoning';
}

export interface LiveClientEventTypes {
  // Connection events
  open: () => void;
  close: (event: any) => void;
  error: (error: Error) => void;
  
  // Content events
  content: (data: any) => void;
  audio: (data: ArrayBuffer) => void;
  textResponse: (text: string) => void;
  
  // Status events
  setupcomplete: () => void;
  turncomplete: () => void;
  interrupted: () => void;
  
  // Tool events
  toolcall: (toolCall: any) => void;
  toolcallcancellation: (cancellation: any) => void;
  
  // Custom events for ingredient detection
  ingredientsDetected: (ingredients: IngredientDetectionResult[]) => void;
  
  // Logging
  log: (log: StreamingLog) => void;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface AudioRecordingState {
  isRecording: boolean;
  duration: number;
  uri?: string;
}

export interface VideoRecordingState {
  isRecording: boolean;
  duration: number;
  uri?: string;
} 