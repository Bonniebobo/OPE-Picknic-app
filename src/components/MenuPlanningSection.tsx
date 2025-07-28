import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useIngredients } from '../context/IngredientContext';
import { useToCookList } from '../context/ToCookListContext';
import { useMenuPlanning, ChatMessage } from '../context/MenuPlanningContext';
import { useLiveAPI } from '../services/gemini-live/context/LiveAPIContext';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetailModal } from '../components/RecipeDetailModal';
import { RecipeCard as RecipeCardType } from '../types/recipe';
import { parseAIRecommendations, parseAIRecommendationsWithImages } from '../utils/aiRecipeExtractor';
import { fetchRecipeDetails, DetailedRecipe } from '../services/fetchRecipeDetails';

interface MenuPlanningSectionProps {
  onBackToIngredients: () => void;
  onViewToCookList: () => void;
  navigation?: any;
}

export default function MenuPlanningSection({
  onBackToIngredients,
  onViewToCookList,
  navigation
}: MenuPlanningSectionProps) {
  const { ingredients, getIngredientNames } = useIngredients();
  const { cookingPlans, addToCookList } = useToCookList();
  const {
    chatHistory,
    addMessage,
    isProcessing,
    setIsProcessing,
    recommendationCount,
    incrementRecommendationCount,
  } = useMenuPlanning();
  const {
    status,
    connect,
    sendTextMessage,
    onTextResponse,
    offTextResponse,
  } = useLiveAPI();

  // Local state
  const [inputText, setInputText] = useState('');
  const [currentAIMessage, setCurrentAIMessage] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isAwaitingRecommendation, setIsAwaitingRecommendation] = useState(false);
  
  // Recipe detail modal state
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetailRecipe, setSelectedDetailRecipe] = useState<DetailedRecipe | null>(null);
  const [isLoadingRecipeDetail, setIsLoadingRecipeDetail] = useState(false);

  // Initialize chat messages
  useEffect(() => {
    if (chatHistory.length === 0) {
      addMessage({
        role: 'ai',
        content: `Welcome to Menu Planning! 🍳\n\nI can see you have these ingredients: ${getIngredientNames().join(', ')}\n\nLet me recommend some delicious recipes for you! Do you have any specific preferences? Such as flavor, difficulty level, or cooking time?`,
      });
    }
  }, [chatHistory.length, addMessage, getIngredientNames]);

  // Auto-connect on mount
  useEffect(() => {
    if (status === 'disconnected') {
      connect();
    }
  }, [status, connect]);

  // Handle Gemini text responses
  useEffect(() => {
    const handleGeminiTextResponse = (text: string) => {
      console.log('[MenuPlanning] Received Gemini response chunk:', text);
      
      if (!text || typeof text !== 'string') return;
      const trimmedText = text.trim();
      if (trimmedText === '' || trimmedText === '[]') return;

      // Clear existing timeout
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }

      // Accumulate the AI response
      setCurrentAIMessage(prev => {
        const newMessage = prev + trimmedText;
        
        // Set timeout to detect end of response
        responseTimeoutRef.current = setTimeout(() => {
          handleTurnComplete(newMessage);
        }, 1500);
        
        return newMessage;
      });
    };

    const handleTurnComplete = async (finalMessage?: string) => {
      const messageToProcess = finalMessage || currentAIMessage;
      console.log('[MenuPlanning] Turn complete, processing final message:', messageToProcess);
      console.log('[MenuPlanning] Is awaiting recommendation:', isAwaitingRecommendation);
      
      if (messageToProcess.trim()) {
        // If awaiting recommendation or message contains recipe format, force parse as cards
        const shouldShowRecipes = isAwaitingRecommendation || 
          /Recommended Dishes[:\s]|Recipe Recommendations|\*\*.*\*\*|\d+\.\s*\*\*.*\*\*/.test(messageToProcess);
        
        console.log('[MenuPlanning] Should show recipes:', shouldShowRecipes);
        
        if (shouldShowRecipes) {
          try {
            // Try to use AI image generation for better quality
            console.log('[MenuPlanning] Attempting to generate AI images for recipes...');
            const extractedRecipes = await parseAIRecommendationsWithImages(messageToProcess);
            console.log('[MenuPlanning] Extracted recipes with AI images:', extractedRecipes.length);
            console.log('[MenuPlanning] Recipe names:', extractedRecipes.map((r: RecipeCardType) => r.name));
            
            if (extractedRecipes.length > 0) {
              // Successfully parsed recipes with AI images, display as cards
              addMessage({
                role: 'ai',
                content: '🍳 Here are my recommendations for you:',
                recipes: extractedRecipes,
              });
            } else if (isAwaitingRecommendation) {
              // Expected recommendation but parsing failed, show error message
              addMessage({
                role: 'ai',
                content: 'Sorry, the AI response format is incorrect. Please click the "Smart Recipe Recommendation" button again.\n\nOriginal response:\n' + messageToProcess,
              });
            }
          } catch (error) {
            console.error('[MenuPlanning] Error generating AI images, falling back to placeholders:', error);
            
            // Fallback to sync version with placeholder images
            const extractedRecipes = parseAIRecommendations(messageToProcess);
            console.log('[MenuPlanning] Fallback: Extracted recipes:', extractedRecipes.length);
            
            if (extractedRecipes.length > 0) {
              addMessage({
                role: 'ai',
                content: '🍳 Here are my recommendations for you:',
                recipes: extractedRecipes,
              });
            } else if (isAwaitingRecommendation) {
              addMessage({
                role: 'ai',
                content: 'Sorry, the AI response format is incorrect. Please click the "Smart Recipe Recommendation" button again.\n\nOriginal response:\n' + messageToProcess,
              });
            }
          }
        } else {
          // Regular chat message, display normally
          addMessage({
            role: 'ai',
            content: messageToProcess,
          });
        }
      }
      
              // Reset for next turn
        setCurrentAIMessage('');
        setCurrentMessageId(null);
        setIsProcessing(false);
        setIsAwaitingRecommendation(false);
      };

      if (status === 'connected') {
        onTextResponse(handleGeminiTextResponse);
        
        return () => {
          offTextResponse(handleGeminiTextResponse);
        };
      }
    }, [status, currentAIMessage, isAwaitingRecommendation, addMessage, onTextResponse, offTextResponse]);

    // Auto scroll to bottom
    useEffect(() => {
      if (chatHistory.length > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, [chatHistory.length]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    addMessage({ role: 'user', content: userMessage });
    setIsProcessing(true);

    try {
      const contextPrompt = `As an intelligent menu planning assistant, engage in conversation based on the following information:

Current ingredients: ${getIngredientNames().join(', ')}
User message: ${userMessage}

Please provide helpful cooking advice and recipe recommendations. If recommending specific dishes, strictly follow this format:

Recommended Dishes:
1. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy/Medium/Hard
- Taste: Describe flavor profile
- Description: Brief introduction to the dish`;

      await sendTextMessage(contextPrompt);
          } catch (error) {
        console.error('Failed to send message:', error);
        addMessage({ role: 'ai', content: 'Sorry, there was an issue processing your message. Please try again.' });
        setIsProcessing(false);
      }
  };

  const handleViewRecipeDetails = async (recipe: RecipeCardType) => {
    console.log('[MenuPlanning] View recipe details:', recipe.name);
    
    setIsLoadingRecipeDetail(true);
    setDetailModalVisible(true);
    setSelectedDetailRecipe(null);

    try {
      const detailedRecipe = await fetchRecipeDetails(recipe.name);
      if (detailedRecipe) {
        // Use the AI-generated image from the recipe card instead of Edamam's image
        const enhancedDetailedRecipe: DetailedRecipe = {
          ...detailedRecipe,
          image: recipe.imageUrl // Preserve the AI-generated or consistent placeholder image
        };
        
        setSelectedDetailRecipe(enhancedDetailedRecipe);
        console.log('[MenuPlanning] Successfully fetched details with preserved image:', enhancedDetailedRecipe.name);
      } else {
        console.log('[MenuPlanning] No detailed recipe found');
        Alert.alert('Notice', 'Could not find detailed information for this recipe. Please try again later.');
        setDetailModalVisible(false);
      }
    } catch (error) {
      console.error('[MenuPlanning] Failed to fetch recipe details:', error);
      Alert.alert('Error', 'Failed to get recipe details. Please try again later.');
      setDetailModalVisible(false);
    } finally {
      setIsLoadingRecipeDetail(false);
    }
  };

  const handleAddToCookList = (recipe: RecipeCardType) => {
    addToCookList(recipe);
    
    // Show continue recommendation prompt
    const continueMessage = `✅ "${recipe.name}" has been added to your cooking list!\n\nWould you like more recommendations?`;
    addMessage({ role: 'ai', content: continueMessage });
  };

  const handleSkipRecipe = (recipe: RecipeCardType) => {
    console.log('[MenuPlanning] Skipped recipe:', recipe.name);
    
    // Show skip feedback message
    const skipMessage = `👌 Skipped "${recipe.name}". Let me recommend other dishes for you...`;
    addMessage({ role: 'ai', content: skipMessage });
    
    // Auto request more recommendations
    setTimeout(() => {
      requestMoreRecommendations();
    }, 500);
  };

  const requestMoreRecommendations = async () => {
    incrementRecommendationCount();
    
    const contextPrompt = `I've seen the previous recommendations. Based on my ingredients: ${getIngredientNames().join(', ')}, please recommend 1-2 different dishes.

Please reply strictly in this format:

Recommended Dishes:
1. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy/Medium/Hard
- Taste: Describe flavor profile
- Description: Brief introduction to the dish

Please recommend some new and creative dishes, avoiding previously recommended ones.`;

    try {
      setIsProcessing(true);
      setIsAwaitingRecommendation(true);
      await sendTextMessage(contextPrompt);
          } catch (error) {
        console.error('Failed to request more recommendations:', error);
        addMessage({ role: 'ai', content: 'Sorry, unable to get more recommendations. Please try again.' });
        setIsProcessing(false);
        setIsAwaitingRecommendation(false);
      }
  };

  const handleQuickAction = async (actionType: string) => {
    const ingredients = getIngredientNames().join('、');
    let contextPrompt = '';

    switch (actionType) {
      case 'quick':
        contextPrompt = `I want quick and easy dishes. Based on my ingredients: ${ingredients}, please recommend 1-2 dishes that are simple to make and fast to prepare.

Please reply strictly in this format:

Recommended Dishes:
1. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy
- Taste: Describe flavor profile
- Description: Brief introduction to the dish`;
        break;
      case 'nutritious':
        contextPrompt = `I want nutritious and balanced dishes. Based on my ingredients: ${ingredients}, please recommend 1-2 nutritionally balanced dishes.

Please reply strictly in this format:

Recommended Dishes:
1. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy/Medium/Hard
- Taste: Describe flavor profile
- Description: Emphasize nutritional value`;
        break;
      case 'creative':
        contextPrompt = `I want creative dishes. Based on my ingredients: ${ingredients}, please recommend 1-2 creative and unique dishes.

Please reply strictly in this format:

Recommended Dishes:
1. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy/Medium/Hard
- Taste: Describe flavor profile
- Description: Explain the creative aspect`;
        break;
      default:
        return;
    }

    try {
      setIsProcessing(true);
      setIsAwaitingRecommendation(true);
      setShowQuickActions(false);
      await sendTextMessage(contextPrompt);
          } catch (error) {
        console.error('Quick recommendation failed:', error);
        addMessage({ role: 'ai', content: 'Sorry, unable to get recommendations. Please try again.' });
        setIsProcessing(false);
        setIsAwaitingRecommendation(false);
      }
  };

  const handleSmartRecommendation = async () => {
    const ingredients = getIngredientNames();
    if (ingredients.length === 0) {
      Alert.alert('Ingredients Needed', 'Please add some ingredients first, then I can recommend recipes for you!');
      return;
    }

    setIsProcessing(true);
    const contextPrompt = `I have these ingredients: ${ingredients.join(', ')}. Please recommend 2-3 dishes.

Please reply strictly in this format:

Recommended Dishes:
1. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy/Medium/Hard
- Taste: Describe flavor profile
- Description: Brief introduction to the dish

2. **Recipe Name**
- Cooking Time: XX minutes
- Difficulty: Easy/Medium/Hard
- Taste: Describe flavor profile
- Description: Brief introduction to the dish

Please recommend practical, delicious dishes suitable for home cooking.`;

    try {
      setIsAwaitingRecommendation(true);
      await sendTextMessage(contextPrompt);
          } catch (error) {
        console.error('Smart recommendation failed:', error);
        addMessage({ role: 'ai', content: 'Sorry, there was an issue recommending recipes. Please try again.' });
        setIsProcessing(false);
        setIsAwaitingRecommendation(false);
      }
  };

  const renderMessage = (message: ChatMessage) => (
    <View key={message.id}>
      <View
        style={[
          styles.messageBubble,
          message.role === 'user' ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={[styles.messageText, { color: message.role === 'user' ? '#FFFFFF' : '#1F2937' }]}>
          {message.content}
        </Text>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      {/* Render recipe cards if present */}
      {message.recipes && message.recipes.length > 0 && (
        <View style={styles.recipesContainer}>
          {message.recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              mode="recommendation"
              onViewDetails={handleViewRecipeDetails}
              onAddToCookList={handleAddToCookList}
              onSkip={handleSkipRecipe}
              showActions={true}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
              {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackToIngredients} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>← Ingredients</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Menu Planning ({getIngredientNames().length} ingredients)</Text>
          
          <TouchableOpacity onPress={onViewToCookList} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>To-Cook List ({cookingPlans.length})</Text>
          </TouchableOpacity>
        </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {chatHistory.map(renderMessage)}
        
        {isProcessing && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.messageText}>
              {isAwaitingRecommendation ? 'AI is recommending dishes for you...' : 'AI is thinking...'}
            </Text>
          </View>
        )}
        
        {/* Debug information (visible in development) */}
        {__DEV__ && isAwaitingRecommendation && (
          <View style={[styles.messageBubble, styles.debugBubble]}>
            <Text style={styles.debugText}>
              🔧 Debug Mode: Awaiting structured recipe recommendations
            </Text>
          </View>
        )}
        
        {/* Continue recommendation button */}
        {cookingPlans.length > 0 && !isProcessing && (
          <View style={styles.continueRecommendContainer}>
            <TouchableOpacity 
              style={styles.continueRecommendButton}
              onPress={requestMoreRecommendations}
            >
              <Text style={styles.continueRecommendButtonText}>🔄 Continue Recommending More Recipes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionsToggle}
              onPress={() => setShowQuickActions(!showQuickActions)}
            >
              <Text style={styles.quickActionsToggleText}>
                {showQuickActions ? '📋 Hide Quick Options' : '⚡ Quick Recommendations'}
              </Text>
            </TouchableOpacity>
            
            {showQuickActions && (
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity 
                  style={[styles.quickActionButton, { backgroundColor: '#28a745' }]}
                  onPress={() => handleQuickAction('quick')}
                >
                  <Text style={styles.quickActionText}>🚀 Quick & Easy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, { backgroundColor: '#17a2b8' }]}
                  onPress={() => handleQuickAction('nutritious')}
                >
                  <Text style={styles.quickActionText}>🥗 Nutritious</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, { backgroundColor: '#fd7e14' }]}
                  onPress={() => handleQuickAction('creative')}
                >
                  <Text style={styles.quickActionText}>🎨 Creative</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[styles.smartRecommendButton, isProcessing && styles.smartRecommendButtonDisabled]}
          onPress={handleSmartRecommendation}
          disabled={isProcessing}
        >
          <Text style={styles.smartRecommendButtonText}>
            {isProcessing ? '🤔 AI is thinking...' : '🍳 Smart Recipe Recommendations'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tell me your preferences..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSendMessage}
            editable={!isProcessing}
            returnKeyType="send"
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, (!inputText.trim() || isProcessing) && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        recipe={selectedDetailRecipe}
        isLoading={isLoadingRecipeDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED', // Use project standard warm white background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
  },
  headerButtonText: {
    fontSize: 12,
    color: '#FB7185', // Project standard pink color
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // Project standard dark gray color
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messagesContent: {
    paddingVertical: 24,
  },
  messageBubble: {
    maxWidth: '85%',
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FB7185', // Project standard pink color
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF', // Project standard light gray color
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  recipesContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  smartRecommendButton: {
    backgroundColor: '#FB7185', // Project standard pink color
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 24, // Larger border radius to match project style
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  smartRecommendButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  smartRecommendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueRecommendContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  continueRecommendButton: {
    backgroundColor: '#10B981', // Use modern green color
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  continueRecommendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    color: '#1F2937',
  },
  sendButton: {
    backgroundColor: '#FB7185', // Use project standard pink color
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  quickActionsToggle: {
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionsToggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  debugBubble: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    alignSelf: 'center',
    maxWidth: '90%',
  },
  debugText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
}); 