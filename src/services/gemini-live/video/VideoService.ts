/**
 * Video Service for Gemini Live API - React Native + Expo
 * Handles image capture using expo-camera and expo-image-picker
 */

import { CameraView, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { EventEmitter } from 'eventemitter3';
import { VideoRecordingState, MediaChunk } from '../types';

interface VideoServiceEvents {
  recordingStarted: () => void;
  recordingStopped: (uri: string, duration: number) => void;
  recordingError: (error: Error) => void;
  imageCapture: (uri: string) => void;
  imageCaptureError: (error: Error) => void;
  videoChunk: (chunk: MediaChunk) => void;
  imageChunk: (chunk: MediaChunk) => void;
  permissionDenied: (type: 'camera' | 'media-library') => void;
}

export class VideoService extends EventEmitter<VideoServiceEvents> {
  private cameraRef: CameraView | null = null;
  private recordingState: VideoRecordingState = {
    isRecording: false,
    duration: 0,
  };
  private recordingTimer: NodeJS.Timeout | null = null;
  private hasPermissions = false;

  constructor() {
    super();
    this.requestPermissions();
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      // Request media library permission for image picker
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (mediaPermission.status !== 'granted') {
        this.emit('permissionDenied', 'media-library');
        console.warn('[VideoService] Media library permission denied - image picker won\'t work');
      }

      this.hasPermissions = true;
      console.log('[VideoService] Permissions granted');
      return true;

    } catch (error) {
      console.error('[VideoService] Permission request failed:', error);
      return false;
    }
  }

  setCameraRef(ref: CameraView | null) {
    this.cameraRef = ref;
  }

  async captureImage(): Promise<string | null> {
    if (!this.hasPermissions) {
      await this.requestPermissions();
    }

    if (!this.cameraRef) {
      console.error('[VideoService] Camera ref not set');
      return null;
    }

    try {
      const photo = await this.cameraRef.takePictureAsync({
        quality: 0.8, // Good balance between quality and file size
        base64: false, // We'll read it as base64 later
        skipProcessing: false,
      });

      if (photo) {
        this.emit('imageCapture', photo.uri);
        console.log(`[VideoService] Image captured: ${photo.uri}`);
        return photo.uri;
      }

      return null;

    } catch (error) {
      console.error('[VideoService] Failed to capture image:', error);
      this.emit('imageCaptureError', error as Error);
      return null;
    }
  }

  async pickImageFromLibrary(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        this.emit('imageCapture', uri);
        console.log(`[VideoService] Image picked from library: ${uri}`);
        return uri;
      }

      return null;

    } catch (error) {
      console.error('[VideoService] Failed to pick image from library:', error);
      this.emit('imageCaptureError', error as Error);
      return null;
    }
  }

  async convertImageToMediaChunk(uri: string): Promise<MediaChunk | null> {
    try {
      // Read the image file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determine MIME type based on file extension
      const extension = uri.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg'; // default
      
      switch (extension) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'image/jpeg';
      }

      const mediaChunk: MediaChunk = {
        mimeType,
        data: base64Data,
      };

      this.emit('imageChunk', mediaChunk);
      console.log(`[VideoService] Converted image to media chunk (${base64Data.length} chars)`);
      return mediaChunk;

    } catch (error) {
      console.error('[VideoService] Failed to convert image to media chunk:', error);
      return null;
    }
  }

  // For future video recording implementation
  async startVideoRecording(): Promise<boolean> {
    console.log('[VideoService] Video recording not yet implemented');
    return false;
  }

  async stopVideoRecording(): Promise<string | null> {
    console.log('[VideoService] Video recording not yet implemented');
    return null;
  }

  async convertVideoToMediaChunk(uri: string): Promise<MediaChunk | null> {
    try {
      // Read the video file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mediaChunk: MediaChunk = {
        mimeType: 'video/mp4',
        data: base64Data,
      };

      this.emit('videoChunk', mediaChunk);
      console.log(`[VideoService] Converted video to media chunk (${base64Data.length} chars)`);
      return mediaChunk;

    } catch (error) {
      console.error('[VideoService] Failed to convert video to media chunk:', error);
      return null;
    }
  }

  getRecordingState(): VideoRecordingState {
    return { ...this.recordingState };
  }

  isRecording(): boolean {
    return this.recordingState.isRecording;
  }

  async cleanup(): Promise<void> {
    try {
      if (this.recordingState.isRecording) {
        await this.stopVideoRecording();
      }

      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }

      this.cameraRef = null;
      console.log('[VideoService] Cleanup completed');

    } catch (error) {
      console.error('[VideoService] Cleanup failed:', error);
    }
  }

  // Utility method to delete temporary video/image files
  async deleteMediaFile(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
        console.log(`[VideoService] Deleted media file: ${uri}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[VideoService] Failed to delete media file:', error);
      return false;
    }
  }

  // Utility method to get file size
  async getFileSize(uri: string): Promise<number> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;
    } catch (error) {
      console.error('[VideoService] Failed to get file size:', error);
      return 0;
    }
  }
} 