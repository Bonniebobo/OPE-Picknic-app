/**
 * Audio Service for Gemini Live API - React Native + Expo
 * Handles audio recording and playback using expo-av
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { EventEmitter } from 'eventemitter3';
import { AudioRecordingState, MediaChunk } from '../types';

interface AudioServiceEvents {
  recordingStarted: () => void;
  recordingStopped: (uri: string, duration: number) => void;
  recordingError: (error: Error) => void;
  audioChunk: (chunk: MediaChunk) => void;
  playbackStarted: () => void;
  playbackStopped: () => void;
  playbackError: (error: Error) => void;
}

export class AudioService extends EventEmitter<AudioServiceEvents> {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private recordingState: AudioRecordingState = {
    isRecording: false,
    duration: 0,
  };
  private recordingTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    super();
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio recording permission denied');
      }

      // Set audio mode for recording and playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false,
      });

      this.isInitialized = true;
      console.log('[AudioService] Initialized successfully');
    } catch (error) {
      console.error('[AudioService] Initialization failed:', error);
      this.emit('recordingError', error as Error);
    }
  }

  async startRecording(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initializeAudio();
    }

    if (this.recordingState.isRecording) {
      console.warn('[AudioService] Already recording');
      return false;
    }

    try {
      // Stop any existing recording
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }

      // Create new recording
      this.recording = new Audio.Recording();
      
      // Recording options optimized for speech and Gemini Live API
      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000, // Standard for speech recognition
          numberOfChannels: 1, // Mono
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000, // Standard for speech recognition
          numberOfChannels: 1, // Mono
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      };

      await this.recording.prepareToRecordAsync(recordingOptions);
      await this.recording.startAsync();

      this.recordingState = {
        isRecording: true,
        duration: 0,
      };

      // Start timer for duration tracking
      this.recordingTimer = setInterval(() => {
        this.recordingState.duration += 100; // Update every 100ms
      }, 100);

      this.emit('recordingStarted');
      console.log('[AudioService] Recording started');
      return true;

    } catch (error) {
      console.error('[AudioService] Failed to start recording:', error);
      this.emit('recordingError', error as Error);
      return false;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recordingState.isRecording || !this.recording) {
      console.warn('[AudioService] Not currently recording');
      return null;
    }

    try {
      // Stop timer
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }

      // Stop recording
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      
      this.recordingState = {
        isRecording: false,
        duration: this.recordingState.duration,
        uri: uri || undefined,
      };

      const duration = this.recordingState.duration;
      this.recording = null;

      if (uri) {
        this.emit('recordingStopped', uri, duration);
        console.log(`[AudioService] Recording stopped. Duration: ${duration}ms, URI: ${uri}`);
        return uri;
      } else {
        throw new Error('Recording URI is null');
      }

    } catch (error) {
      console.error('[AudioService] Failed to stop recording:', error);
      this.emit('recordingError', error as Error);
      return null;
    }
  }

  async convertToMediaChunk(uri: string): Promise<MediaChunk | null> {
    try {
      // Read the audio file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mediaChunk: MediaChunk = {
        mimeType: 'audio/wav',
        data: base64Data,
      };

      this.emit('audioChunk', mediaChunk);
      console.log(`[AudioService] Converted audio to media chunk (${base64Data.length} chars)`);
      return mediaChunk;

    } catch (error) {
      console.error('[AudioService] Failed to convert audio to media chunk:', error);
      return null;
    }
  }

  async playAudioFromBuffer(audioData: ArrayBuffer): Promise<boolean> {
    try {
      console.log('🔊 AI Audio: Starting playback, buffer size:', audioData.byteLength);
      
      // Stop any existing sound
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Convert PCM ArrayBuffer to WAV format
      const wavBuffer = this.pcmToWav(audioData);
      console.log('🔊 AI Audio: Converted to WAV, size:', wavBuffer.byteLength);
      
      // Convert to base64
      const uint8Array = new Uint8Array(wavBuffer);
      const base64String = this.arrayBufferToBase64(uint8Array);
      const dataUri = `data:audio/wav;base64,${base64String}`;
      
      console.log('🔊 AI Audio: Created data URI, length:', dataUri.length);

      // Create and play sound
      const { sound } = await Audio.Sound.createAsync({ uri: dataUri });
      this.sound = sound;
      console.log('🔊 AI Audio: Sound created successfully');

      this.emit('playbackStarted');
      await sound.playAsync()
        .then(() => {
          console.log('🔊 AI Audio: Started playing successfully');
        })
        .catch((e) => {
          console.error('❌ AI Audio: Play error', e);
        });
      
      // Set up completion handler
      sound.setOnPlaybackStatusUpdate((status) => {
        console.log('🔊 AI Audio: Playback status:', status);
        if (status.isLoaded && status.didJustFinish) {
          this.emit('playbackStopped');
          console.log('🔊 AI Audio: Playback finished');
        }
      });

      return true;
    } catch (error) {
      console.error('❌ AI Audio: Error during playback', error);
      this.emit('playbackError', error as Error);
      return false;
    }
  }

  async stopPlayback(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        this.emit('playbackStopped');
        console.log('[AudioService] Playback stopped');
      } catch (error) {
        console.error('[AudioService] Failed to stop playback:', error);
        this.emit('playbackError', error as Error);
      }
    }
  }

  getRecordingState(): AudioRecordingState {
    return { ...this.recordingState };
  }

  isRecording(): boolean {
    return this.recordingState.isRecording;
  }

  async cleanup(): Promise<void> {
    try {
      if (this.recordingState.isRecording) {
        await this.stopRecording();
      }
      
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }

      console.log('[AudioService] Cleanup completed');
    } catch (error) {
      console.error('[AudioService] Cleanup failed:', error);
    }
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = buffer;
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Convert PCM data to WAV format
  private pcmToWav(pcmData: ArrayBuffer): ArrayBuffer {
    const pcmArray = new Int16Array(pcmData);
    const sampleRate = 24000; // Gemini Live uses 24kHz
    const channels = 1; // Mono
    const bitsPerSample = 16;
    
    // WAV header size
    const headerSize = 44;
    const dataSize = pcmArray.length * 2; // 2 bytes per sample
    const fileSize = headerSize + dataSize - 8;
    
    // Create WAV buffer
    const wavBuffer = new ArrayBuffer(headerSize + dataSize);
    const view = new DataView(wavBuffer);
    
    // Write WAV header
    let offset = 0;
    
    // RIFF header
    view.setUint32(offset, 0x52494646, false); // "RIFF"
    offset += 4;
    view.setUint32(offset, fileSize, true); // File size
    offset += 4;
    view.setUint32(offset, 0x57415645, false); // "WAVE"
    offset += 4;
    
    // fmt chunk
    view.setUint32(offset, 0x666D7420, false); // "fmt "
    offset += 4;
    view.setUint32(offset, 16, true); // Chunk size
    offset += 4;
    view.setUint16(offset, 1, true); // Audio format (PCM)
    offset += 2;
    view.setUint16(offset, channels, true); // Channels
    offset += 2;
    view.setUint32(offset, sampleRate, true); // Sample rate
    offset += 4;
    view.setUint32(offset, sampleRate * channels * bitsPerSample / 8, true); // Byte rate
    offset += 4;
    view.setUint16(offset, channels * bitsPerSample / 8, true); // Block align
    offset += 2;
    view.setUint16(offset, bitsPerSample, true); // Bits per sample
    offset += 2;
    
    // data chunk
    view.setUint32(offset, 0x64617461, false); // "data"
    offset += 4;
    view.setUint32(offset, dataSize, true); // Data size
    offset += 4;
    
    // Copy PCM data
    const pcmView = new Uint8Array(pcmData);
    const wavView = new Uint8Array(wavBuffer, headerSize);
    wavView.set(pcmView);
    
    console.log('🔊 AI Audio: WAV conversion complete');
    return wavBuffer;
  }

  // Utility method to delete temporary audio files
  async deleteAudioFile(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
        console.log(`[AudioService] Deleted audio file: ${uri}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AudioService] Failed to delete audio file:', error);
      return false;
    }
  }
} 