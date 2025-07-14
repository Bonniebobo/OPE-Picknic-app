import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AIVoiceService from '../services/aiVoiceService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  ingredients?: string[];
}

interface RecipeHelperAIModeProps {
  onIngredientsConfirmed: (ingredients: string[]) => void;
}

export default function RecipeHelperAIMode({ onIngredientsConfirmed }: RecipeHelperAIModeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI kitchen assistant. I can help you discover recipes based on your ingredients. You can:\n\n🎙️ Talk to me about what you have\n📷 Show me photos of your ingredients\n✏️ Type your ingredients\n📹 Use video if you prefer\n\nWhat ingredients do you have today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const addMessage = (type: 'user' | 'ai', content: string, ingredients?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ingredients
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);
    setIsProcessing(true);

    try {
      // Process user input with AI
      const result = await AIVoiceService.processTextInput(userMessage);
      
      // Generate AI response
      const aiResponse = generateAIResponse(result.ingredients, userMessage);
      addMessage('ai', aiResponse, result.ingredients);
      
      // Check if we have enough ingredients to proceed
      if (result.ingredients.length >= 2) {
        setTimeout(() => {
          const confirmMessage = `I've identified ${result.ingredients.length} ingredients: ${result.ingredients.join(', ')}. Would you like me to find recipes for you?`;
          addMessage('ai', confirmMessage);
        }, 1000);
      }
      
    } catch (error) {
      addMessage('ai', "I'm sorry, I couldn't process that. Could you try describing your ingredients again?");
      console.error('AI processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = (ingredients: string[], userInput: string): string => {
    if (ingredients.length === 0) {
      return "I couldn't identify specific ingredients from that. Could you try being more specific? For example: 'I have tomatoes, basil, and cheese' or 'I have chicken, rice, and vegetables'.";
    }
    
    if (ingredients.length === 1) {
      return `I see you have ${ingredients[0]}. What other ingredients do you have? I can help you find recipes that use multiple ingredients.`;
    }
    
    return `Great! I can see you have: ${ingredients.join(', ')}. These ingredients could make some delicious dishes! Do you have any preferences for cuisine type or cooking time?`;
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    startPulseAnimation();
    
    // Simulate voice recording
    setTimeout(() => {
      handleStopVoiceRecording();
    }, 3000);
  };

  const handleStopVoiceRecording = async () => {
    setIsRecording(false);
    stopPulseAnimation();
    setIsProcessing(true);

    try {
      const result = await AIVoiceService.processVoiceInput();
      addMessage('user', `[Voice]: ${result.transcription}`);
      
      const aiResponse = generateAIResponse(result.ingredients, result.transcription);
      addMessage('ai', aiResponse, result.ingredients);
      
    } catch (error) {
      addMessage('ai', "I'm sorry, I couldn't understand that. Could you try speaking again or use text input?");
      console.error('Voice processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Photo Upload',
      'Photo upload will be implemented. For now, this simulates photo processing.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate', 
          onPress: async () => {
            setIsProcessing(true);
            try {
              // Simulate photo processing
              const mockIngredients = ['tomato', 'basil', 'cheese', 'olive oil'];
              addMessage('user', '[Photo]: Uploaded a photo of ingredients');
              
              const aiResponse = generateAIResponse(mockIngredients, 'photo upload');
              addMessage('ai', aiResponse, mockIngredients);
              
            } catch (error) {
              addMessage('ai', "I'm sorry, I couldn't analyze that photo. Could you try again or describe the ingredients?");
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const handleVideoToggle = () => {
    setIsVideoMode(!isVideoMode);
    if (!isVideoMode) {
      addMessage('ai', "Video mode activated! You can now show me your ingredients through video. Tap the camera button to start recording.");
    } else {
      addMessage('ai', "Video mode deactivated. You can still use voice, text, or photo input.");
    }
  };

  const handleGenerateRecipes = () => {
    // Collect all ingredients from the conversation
    const allIngredients = messages
      .filter(msg => msg.ingredients)
      .flatMap(msg => msg.ingredients || []);
    
    const uniqueIngredients = [...new Set(allIngredients)];
    
    if (uniqueIngredients.length === 0) {
      addMessage('ai', "I don't see any ingredients yet. Please tell me what ingredients you have.");
      return;
    }
    
    addMessage('ai', `Perfect! I'll find recipes using: ${uniqueIngredients.join(', ')}. Let me search for you...`);
    
    // Proceed to recipe generation
    setTimeout(() => {
      onIngredientsConfirmed(uniqueIngredients);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessage : styles.aiMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.type === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.type === 'user' ? styles.userText : styles.aiText
              ]}>
                {message.content}
              </Text>
              {message.ingredients && message.ingredients.length > 0 && (
                <View style={styles.ingredientsPreview}>
                  <Text style={styles.ingredientsPreviewText}>
                    Ingredients: {message.ingredients.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
        
        {isProcessing && (
          <View style={styles.messageContainer}>
            <View style={styles.aiBubble}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#FB7185" />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Controls */}
      <View style={styles.inputContainer}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, isRecording && styles.actionButtonActive]}
            onPress={isRecording ? handleStopVoiceRecording : handleVoiceInput}
            disabled={isProcessing}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={styles.actionButtonIcon}>
                {isRecording ? '⏹️' : '🎙️'}
              </Text>
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, isVideoMode && styles.actionButtonActive]}
            onPress={handleVideoToggle}
            disabled={isProcessing}
          >
            <Text style={styles.actionButtonIcon}>📹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handlePhotoUpload}
            disabled={isProcessing}
          >
            <Text style={styles.actionButtonIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Text Input */}
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your ingredients or ask me anything..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            editable={!isProcessing}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isProcessing) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Generate Recipes Button */}
        {messages.length > 2 && (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateRecipes}
            disabled={isProcessing}
          >
            <Text style={styles.generateButtonText}>🍽️ Generate Recipes</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#FB7185',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#1F2937',
  },
  ingredientsPreview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  ingredientsPreviewText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonActive: {
    backgroundColor: '#FB7185',
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FB7185',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 