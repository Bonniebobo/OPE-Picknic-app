import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  ingredients: string[];
}

export class SpeechService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  async startRecording(): Promise<boolean> {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio recording permission denied');
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });

      // Create recording
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync();
      await this.recording.startAsync();
      
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recording || !this.isRecording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }

  async transcribeAudio(audioUri: string): Promise<SpeechRecognitionResult> {
    // Since we don't have a real speech-to-text API, we'll simulate it
    // In a real implementation, you would send the audio to a service like:
    // - Google Speech-to-Text API
    // - Azure Speech Services
    // - AWS Transcribe
    // - Or use the Gemini Live API's built-in speech recognition
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock transcription results
    const mockTranscripts = [
      "I have tomatoes, eggs and peppers",
      "I want to make beef noodles",
      "Today I want something light, I have tofu and vegetables",
      "I have chicken breast, carrots and onions",
      "I want to make simple fried rice",
      "I have ingredients for a healthy salad",
      "Looking for something quick and easy to cook",
      "What can I make with pasta and vegetables?"
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    const ingredients = this.extractIngredients(randomTranscript);
    
    return {
      transcript: randomTranscript,
      confidence: 0.85 + Math.random() * 0.15, // 85-100%
      ingredients
    };
  }

  private extractIngredients(text: string): string[] {
    const commonIngredients = [

      'tomato', 'tomatoes', 'potato', 'potatoes', 'onion', 'onions', 'carrot', 'carrots', 
      'cabbage', 'spinach', 'tofu', 'egg', 'eggs', 'beef', 'pork', 'chicken', 'fish', 
      'garlic', 'ginger', 'celery', 'pepper', 'peppers', 'cheese', 'milk', 'shrimp', 'mushroom', 'corn'
    ];
    
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonIngredients.forEach(ingredient => {
      if (lowerText.includes(ingredient.toLowerCase())) {
        found.push(ingredient);
      }
    });
    
    return [...new Set(found)]; // Remove duplicates
  }

  getRecordingStatus(): boolean {
    return this.isRecording;
  }

  async cleanup(): Promise<void> {
    if (this.recording && this.isRecording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error cleaning up recording:', error);
      }
    }
    this.recording = null;
    this.isRecording = false;
  }
}

// Singleton instance
export const speechService = new SpeechService(); 