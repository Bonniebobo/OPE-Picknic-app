/**
 * Gemini Live API Client for React Native + Expo
 * Adapted from Google's Live API Web Console
 */

import { EventEmitter } from 'eventemitter3';
import Constants from 'expo-constants';
import {
  LiveClientOptions,
  LiveConnectConfig,
  StreamingLog,
  LiveClientEventTypes,
  ConnectionStatus,
  MediaChunk,
  IngredientDetectionResult
} from './types';

export class GeminiLiveClient extends EventEmitter<LiveClientEventTypes> {
  private apiKey: string;
  private websocket: WebSocket | null = null;
  private _status: ConnectionStatus = 'disconnected';
  private _model: string = 'models/gemini-2.0-flash-exp';
  private config: LiveConnectConfig | null = null;
  private ingredientsSet = new Set<string>();

  public get status(): ConnectionStatus {
    return this._status;
  }

  public get model(): string {
    return this._model;
  }

  constructor(options: LiveClientOptions) {
    super();
    this.apiKey = options.apiKey || Constants.expoConfig?.extra?.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('Gemini API key is required. Please set GEMINI_API_KEY in your environment.');
    }

    // Bind methods
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendRealtimeInput = this.sendRealtimeInput.bind(this);
    this.sendTextMessage = this.sendTextMessage.bind(this);
  }

  protected log(type: string, message: any) {
    const logEntry: StreamingLog = {
      date: new Date(),
      type,
      message,
    };
    this.emit('log', logEntry);
    console.log(`[GeminiLive] ${type}:`, message);
  }

  async connect(model: string = this._model, config: LiveConnectConfig = {}): Promise<boolean> {
    if (this._status === 'connecting' || this._status === 'connected') {
      this.log('client.connect', 'Already connected or connecting');
      return false;
    }

    this._status = 'connecting';
    this._model = model;
    this.config = {
      model,
      systemInstruction: {
        parts: [{
          text: `You are a friendly and helpful AI cooking assistant. Please follow these guidelines:

1. LANGUAGE: Respond in Chinese (中文) as this is the user's preferred language
2. CONVERSATION: Engage in natural, helpful conversations about cooking, recipes, and food
3. INGREDIENT RECOGNITION: When users mention ingredients, acknowledge and remember them
4. RECIPE ASSISTANCE: Help users find recipes based on their available ingredients and preferences
5. COOKING GUIDANCE: Provide cooking tips, techniques, and answers to food-related questions

IMPORTANT: 
- Always respond with TEXT ONLY, never audio
- Always respond with actual text content, never empty responses
- Be encouraging and helpful throughout the cooking journey
- When users ask about recipes, provide specific suggestions and cooking tips
- ONLY provide JSON format when explicitly requested for structured data

Example response: "好的！我看到你有西红柿和鸡蛋，这是很经典的搭配。你想做西红柿炒鸡蛋吗？我可以教你几种不同的做法。"`
        }]
      },
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
        responseModalities: ["TEXT"], // Force text-only responses
      },
      ...config
    };

    try {
      // Construct WebSocket URL for Gemini Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
      
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = this.onOpen.bind(this);
      this.websocket.onclose = this.onClose.bind(this);
      this.websocket.onerror = this.onError.bind(this);
      this.websocket.onmessage = this.onMessage.bind(this);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.log('client.connect', 'Connection timeout');
          resolve(false);
        }, 10000);

        this.once('open', () => {
          clearTimeout(timeout);
          resolve(true);
        });

        this.once('error', () => {
          clearTimeout(timeout);
          resolve(false);
        });
      });
    } catch (error) {
      this.log('client.connect', `Error: ${error}`);
      this._status = 'disconnected';
      return false;
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this._status = 'disconnected';
    this.ingredientsSet.clear();
    this.log('client.disconnect', 'Disconnected');
  }

  private onOpen() {
    this._status = 'connected';
    this.log('client.open', 'Connected to Gemini Live API');
    this.emit('open');

    // Send initial setup message
    if (this.config) {
      this.sendSetupMessage();
    }
  }

  private onClose(event: CloseEvent) {
    this._status = 'disconnected';
    this.log('client.close', `Disconnected: ${event.reason || 'Unknown reason'}`);
    this.emit('close', event);
  }

  private onError(event: Event) {
    const error = new Error(`WebSocket error: ${event}`);
    this.log('client.error', error.message);
    this.emit('error', error);
  }

  private async onMessage(event: MessageEvent) {
    try {
      // Handle different types of data
      const data = event.data;
      
      // Handle ArrayBuffer (binary data)
      if (data instanceof ArrayBuffer) {
        this.log('server.binaryData', `Received ArrayBuffer: ${data.byteLength} bytes`);
        // Convert ArrayBuffer to string to check if it contains text
        try {
          const textDecoder = new TextDecoder();
          const decodedText = textDecoder.decode(data);
          this.log('server.decodedText', decodedText);
          
          // Try to parse as JSON
          try {
            const message = JSON.parse(decodedText);
            this.log('server.message', message);
            
            if (message.setupComplete) {
              this.log('server.setupComplete', 'Setup complete');
              this.emit('setupcomplete');
              return;
            }

            if (message.serverContent) {
              this.handleServerContent(message.serverContent);
            }

            if (message.toolCall) {
              this.emit('toolcall', message.toolCall);
            }
          } catch (jsonError) {
            // If not JSON, treat as plain text
            const trimmedText = decodedText.trim();
            if (trimmedText) {
              this.log('server.textResponse', trimmedText);
              this.emit('textResponse', trimmedText);
            }
          }
        } catch (decodeError) {
          this.log('server.decodeError', `Failed to decode ArrayBuffer: ${decodeError}`);
        }
        return;
      }

      // Handle string data
      if (typeof data === 'string') {
        this.log('server.stringData', data);
        
        // Try to parse as JSON
        try {
          const message = JSON.parse(data);
          this.log('server.message', message);

          if (message.setupComplete) {
            this.log('server.setupComplete', 'Setup complete');
            this.emit('setupcomplete');
            return;
          }

          if (message.serverContent) {
            this.handleServerContent(message.serverContent);
          }

          if (message.toolCall) {
            this.emit('toolcall', message.toolCall);
          }
        } catch (parseError) {
          // If JSON parsing fails, treat as plain text response
          const trimmedText = data.trim();
          if (trimmedText) {
            this.log('server.textResponse', trimmedText);
            this.emit('textResponse', trimmedText);
          }
        }
        return;
      }

      // Handle other data types
      this.log('server.unknownDataType', `Received unknown data type: ${typeof data}`);

    } catch (error) {
      this.log('server.error', `Failed to handle message: ${error}`);
    }
  }

  private handleServerContent(serverContent: any) {
    this.log('server.handleServerContent', serverContent);
    
    if (serverContent.interrupted) {
      this.log('server.interrupted', 'Generation interrupted');
      this.emit('interrupted');
      return;
    }

    if (serverContent.turnComplete) {
      this.log('server.turnComplete', 'Turn complete');
      this.emit('turncomplete');
    }

    if (serverContent.modelTurn?.parts) {
      const parts = serverContent.modelTurn.parts;
      this.log('server.modelTurnParts', parts);
      
      // Handle audio parts
      const audioParts = parts.filter((p: any) => 
        p.inlineData && p.inlineData.mimeType?.startsWith('audio/pcm')
      );
      
      audioParts.forEach((part: any) => {
        if (part.inlineData?.data) {
          const audioData = this.base64ToArrayBuffer(part.inlineData.data);
          this.emit('audio', audioData);
          this.log('server.audio', `Audio buffer (${audioData.byteLength} bytes)`);
        }
      });

      // Handle text parts
      const textParts = parts.filter((p: any) => p.text && typeof p.text === 'string');
      this.log('server.textParts', `Found ${textParts.length} text parts`);
      
      textParts.forEach((part: any) => {
        const textContent = part.text.trim();
        this.log('server.textContent', textContent);
        
        if (textContent) {
          // Emit text response for conversation handling
          this.emit('textResponse', textContent);
          // Also try to extract ingredients from text
          this.extractIngredientsFromText(textContent);
        }
      });

      this.emit('content', { modelTurn: { parts } });
    }
  }

  private extractIngredientsFromText(text: string) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[.*?\]/s);
      if (jsonMatch) {
        const ingredientData = JSON.parse(jsonMatch[0]);
        if (Array.isArray(ingredientData)) {
          const newIngredients: IngredientDetectionResult[] = [];
          
          ingredientData.forEach((item: any) => {
            if (item.ingredient && !this.ingredientsSet.has(item.ingredient.toLowerCase())) {
              this.ingredientsSet.add(item.ingredient.toLowerCase());
              newIngredients.push({
                ingredient: item.ingredient,
                confidence: item.confidence || 0.8,
                category: item.category || 'vegetables'
              });
            }
          });

          if (newIngredients.length > 0) {
            this.emit('ingredientsDetected', newIngredients);
            this.log('ingredients.detected', newIngredients);
          }
        }
      }
    } catch (error) {
      // Fallback: simple text parsing for ingredients
      this.log('ingredients.parseError', `Failed to parse JSON, using fallback: ${error}`);
    }
  }

  private sendSetupMessage() {
    if (!this.websocket || !this.config) return;

    const setupMessage = {
      setup: {
        model: this.config.model,
        systemInstruction: this.config.systemInstruction,
        generationConfig: this.config.generationConfig,
        tools: this.config.tools,
      }
    };

    this.websocket.send(JSON.stringify(setupMessage));
    this.log('client.setup', setupMessage);
  }

  sendRealtimeInput(chunks: MediaChunk[]) {
    if (!this.websocket || this._status !== 'connected') {
      this.log('client.error', 'Cannot send realtime input: not connected');
      return;
    }

    chunks.forEach(chunk => {
      const message = {
        realtimeInput: {
          mediaChunks: [chunk]
        }
      };
      
      this.websocket?.send(JSON.stringify(message));
    });

    const types = chunks.map(c => c.mimeType.split('/')[0]).join(' + ');
    this.log('client.realtimeInput', `Sent ${types} chunks`);
  }

  sendTextMessage(text: string) {
    this.log('client.sendTextMessage', `Attempting to send: ${text}`);
    
    if (!this.websocket || this._status !== 'connected') {
      this.log('client.error', `Cannot send text message: not connected (status: ${this._status})`);
      return;
    }

    const message = {
      clientContent: {
        turns: [{ parts: [{ text }] }],
        turnComplete: true
      }
    };

    this.log('client.textMessage', `Sending message: ${JSON.stringify(message)}`);
    this.websocket.send(JSON.stringify(message));
    this.log('client.textMessage', `Message sent successfully`);
  }

  clearIngredientsHistory() {
    this.ingredientsSet.clear();
    this.log('ingredients.cleared', 'Ingredient history cleared');
  }

  getDetectedIngredients(): string[] {
    return Array.from(this.ingredientsSet);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  }
} 