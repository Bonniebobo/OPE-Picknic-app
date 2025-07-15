/**
 * Gemini Live API Context for React Native + Expo
 * Provides state management for the Live API client, audio, and video services
 */

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { GeminiLiveClient } from '../GeminiLiveClient';
import { AudioService } from '../audio/AudioService';
import { VideoService } from '../video/VideoService';
import {
  LiveClientOptions,
  LiveConnectConfig,
  ConnectionStatus,
  IngredientDetectionResult,
  AudioRecordingState,
  VideoRecordingState,
  StreamingLog,
} from '../types';

interface LiveAPIContextType {
  // Client management
  client: GeminiLiveClient;
  status: ConnectionStatus;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  
  // Configuration
  config: LiveConnectConfig;
  setConfig: (config: LiveConnectConfig) => void;
  model: string;
  setModel: (model: string) => void;
  
  // Audio services
  audioService: AudioService;
  audioState: AudioRecordingState;
  startAudioRecording: () => Promise<boolean>;
  stopAudioRecording: () => Promise<void>;
  isAudioRecording: boolean;
  
  // Video services
  videoService: VideoService;
  videoState: VideoRecordingState;
  captureImage: () => Promise<string | null>;
  pickImageFromLibrary: () => Promise<string | null>;
  isVideoRecording: boolean;
  
  // Ingredient detection
  detectedIngredients: IngredientDetectionResult[];
  clearIngredients: () => void;
  
  // Text messaging
  sendTextMessage: (text: string) => void;
  
  // Logging
  logs: StreamingLog[];
  clearLogs: () => void;
  
  // State
  isInitialized: boolean;
  error: string | null;
}

const LiveAPIContext = createContext<LiveAPIContextType | undefined>(undefined);

interface LiveAPIProviderProps {
  children: ReactNode;
  options?: Partial<LiveClientOptions>;
}

export const LiveAPIProvider: React.FC<LiveAPIProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  // Core services
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const audioServiceRef = useRef<AudioService | null>(null);
  const videoServiceRef = useRef<VideoService | null>(null);

  // State
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [config, setConfig] = useState<LiveConnectConfig>({
    model: 'models/gemini-2.0-flash-exp',
  });
  const [model, setModel] = useState('models/gemini-2.0-flash-exp');
  const [audioState, setAudioState] = useState<AudioRecordingState>({
    isRecording: false,
    duration: 0,
  });
  const [videoState, setVideoState] = useState<VideoRecordingState>({
    isRecording: false,
    duration: 0,
  });
  const [detectedIngredients, setDetectedIngredients] = useState<IngredientDetectionResult[]>([]);
  const [logs, setLogs] = useState<StreamingLog[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services
  useEffect(() => {
    try {
      // Initialize Gemini Live client
      const clientOptions: LiveClientOptions = {
        apiKey: '', // Will be read from environment in the client
        ...options,
      };
      
      clientRef.current = new GeminiLiveClient(clientOptions);
      audioServiceRef.current = new AudioService();
      videoServiceRef.current = new VideoService();
      
      setIsInitialized(true);
      console.log('[LiveAPIProvider] Services initialized');
    } catch (err) {
      console.error('[LiveAPIProvider] Initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown initialization error');
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!clientRef.current || !audioServiceRef.current || !videoServiceRef.current) return;

    const client = clientRef.current;
    const audioService = audioServiceRef.current;
    const videoService = videoServiceRef.current;

    // Client event listeners
    const handleOpen = () => {
      setStatus('connected');
      setError(null);
    };

    const handleClose = () => {
      setStatus('disconnected');
    };

    const handleError = (err: Error) => {
      console.error('[LiveAPIProvider] Client error:', err);
      setError(err.message);
      setStatus('disconnected');
    };

    const handleIngredientsDetected = (ingredients: IngredientDetectionResult[]) => {
      setDetectedIngredients(prev => [...prev, ...ingredients]);
    };

    const handleLog = (log: StreamingLog) => {
      setLogs(prev => [...prev.slice(-49), log]); // Keep last 50 logs
    };

    // Audio event listeners
    const handleAudioRecordingStarted = () => {
      setAudioState(prev => ({ ...prev, isRecording: true }));
    };

    const handleAudioRecordingStopped = async (uri: string, duration: number) => {
      setAudioState(prev => ({ 
        ...prev, 
        isRecording: false, 
        duration, 
        uri 
      }));
      
      // Convert audio to media chunk and send to Gemini
      try {
        const mediaChunk = await audioService.convertToMediaChunk(uri);
        if (mediaChunk && client.status === 'connected') {
          client.sendRealtimeInput([mediaChunk]);
        }
      } catch (err) {
        console.error('[LiveAPIProvider] Failed to process audio:', err);
      }
    };

    const handleAudioError = (err: Error) => {
      console.error('[LiveAPIProvider] Audio error:', err);
      setError(`Audio error: ${err.message}`);
    };

    // Video event listeners
    const handleImageCapture = async (uri: string) => {
      try {
        const mediaChunk = await videoService.convertImageToMediaChunk(uri);
        if (mediaChunk && client.status === 'connected') {
          client.sendRealtimeInput([mediaChunk]);
        }
      } catch (err) {
        console.error('[LiveAPIProvider] Failed to process image:', err);
      }
    };

    const handleImageError = (err: Error) => {
      console.error('[LiveAPIProvider] Image error:', err);
      setError(`Image error: ${err.message}`);
    };

    // Attach listeners
    client.on('open', handleOpen);
    client.on('close', handleClose);
    client.on('error', handleError);
    client.on('ingredientsDetected', handleIngredientsDetected);
    client.on('log', handleLog);

    audioService.on('recordingStarted', handleAudioRecordingStarted);
    audioService.on('recordingStopped', handleAudioRecordingStopped);
    audioService.on('recordingError', handleAudioError);

    videoService.on('imageCapture', handleImageCapture);
    videoService.on('imageCaptureError', handleImageError);

    // Audio playback for responses
    const handleAudioResponse = (audioData: ArrayBuffer) => {
      audioService.playAudioFromBuffer(audioData);
    };
    client.on('audio', handleAudioResponse);

    // Cleanup
    return () => {
      client.off('open', handleOpen);
      client.off('close', handleClose);
      client.off('error', handleError);
      client.off('ingredientsDetected', handleIngredientsDetected);
      client.off('log', handleLog);
      client.off('audio', handleAudioResponse);

      audioService.off('recordingStarted', handleAudioRecordingStarted);
      audioService.off('recordingStopped', handleAudioRecordingStopped);
      audioService.off('recordingError', handleAudioError);

      videoService.off('imageCapture', handleImageCapture);
      videoService.off('imageCaptureError', handleImageError);
    };
  }, [isInitialized]);

  // Methods
  const connect = async (): Promise<boolean> => {
    if (!clientRef.current) {
      setError('Client not initialized');
      return false;
    }

    setStatus('connecting');
    setError(null);

    try {
      const success = await clientRef.current.connect(model, config);
      if (!success) {
        setStatus('disconnected');
        setError('Failed to connect to Gemini Live API');
      }
      return success;
    } catch (err) {
      console.error('[LiveAPIProvider] Connection failed:', err);
      setStatus('disconnected');
      setError(err instanceof Error ? err.message : 'Connection failed');
      return false;
    }
  };

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
    setStatus('disconnected');
  };

  const startAudioRecording = async (): Promise<boolean> => {
    if (!audioServiceRef.current) return false;
    return await audioServiceRef.current.startRecording();
  };

  const stopAudioRecording = async (): Promise<void> => {
    if (!audioServiceRef.current) return;
    await audioServiceRef.current.stopRecording();
  };

  const captureImage = async (): Promise<string | null> => {
    if (!videoServiceRef.current) return null;
    return await videoServiceRef.current.captureImage();
  };

  const pickImageFromLibrary = async (): Promise<string | null> => {
    if (!videoServiceRef.current) return null;
    return await videoServiceRef.current.pickImageFromLibrary();
  };

  const sendTextMessage = (text: string) => {
    if (clientRef.current && status === 'connected') {
      clientRef.current.sendTextMessage(text);
    }
  };

  const clearIngredients = () => {
    if (clientRef.current) {
      clientRef.current.clearIngredientsHistory();
    }
    setDetectedIngredients([]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
      if (audioServiceRef.current) {
        audioServiceRef.current.cleanup();
      }
      if (videoServiceRef.current) {
        videoServiceRef.current.cleanup();
      }
    };
  }, []);

  const contextValue: LiveAPIContextType = {
    // Client management
    client: clientRef.current!,
    status,
    connect,
    disconnect,
    
    // Configuration
    config,
    setConfig,
    model,
    setModel,
    
    // Audio services
    audioService: audioServiceRef.current!,
    audioState,
    startAudioRecording,
    stopAudioRecording,
    isAudioRecording: audioState.isRecording,
    
    // Video services
    videoService: videoServiceRef.current!,
    videoState,
    captureImage,
    pickImageFromLibrary,
    isVideoRecording: videoState.isRecording,
    
    // Ingredient detection
    detectedIngredients,
    clearIngredients,
    
    // Text messaging
    sendTextMessage,
    
    // Logging
    logs,
    clearLogs,
    
    // State
    isInitialized,
    error,
  };

  return (
    <LiveAPIContext.Provider value={contextValue}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPI = (): LiveAPIContextType => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error('useLiveAPI must be used within a LiveAPIProvider');
  }
  return context;
}; 