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
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLiveAPI } from '../services/gemini-live';
import { speechService, SpeechRecognitionResult } from '../services/speechService';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeCard as RecipeCardType } from '../types/recipe';
import { createMockRecipeCards, parseGeminiRecipeResponse } from '../utils/recipeUtils';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  ingredients?: string[];
  recipes?: RecipeCardType[];
}

interface RecipeHelperAIModeProps {
  onIngredientsConfirmed: (ingredients: string[]) => void;
  navigation?: any;
}

export default function RecipeHelperAIMode({ onIngredientsConfirmed, navigation }: RecipeHelperAIModeProps) {
  const {
    status,
    connect,
    disconnect,
    sendTextMessage,
    detectedIngredients,
    clearIngredients,
    error,
    audioService,
    isAudioRecording,
    startAudioRecording,
    stopAudioRecording,
    onTextResponse,
    offTextResponse,
  } = useLiveAPI();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI kitchen assistant 👨‍🍳\n\nI can help you with:\n• 🗣️ Voice chat - Tell me what ingredients you have\n• 💬 Text chat - Describe your cooking needs\n• 📷 Photo recognition - Upload ingredient photos\n• 🍳 Smart recommendations - Filter recipes based on your preferences\n\nWhat would you like to cook today? Or tell me what ingredients you have, and I can recommend some delicious recipes for you!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentAIMessage, setCurrentAIMessage] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle recipe card interactions
  const handleViewRecipeDetails = (recipe: RecipeCardType) => {
    if (navigation) {
      navigation.navigate('RecipeDetail', { recipe });
    } else {
      Alert.alert('菜谱详情', `${recipe.name}\n\n${recipe.instructions}`);
    }
  };

  const handleViewTodoList = () => {
    if (navigation) {
      navigation.navigate('TodoList');
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    if (status === 'disconnected') {
      handleConnect();
    }
    
    return () => {
      if (status === 'connected') {
        disconnect();
      }
      // Cleanup speech service
      speechService.cleanup();
    };
  }, []);

  // Handle Gemini text responses
  useEffect(() => {
    const handleGeminiTextResponse = (text: string) => {
      console.log('[RecipeHelperAIMode] Received Gemini response chunk:', text);
      
      // Validate response
      if (!text || typeof text !== 'string') {
        console.warn('[RecipeHelperAIMode] Invalid response received:', text);
        return;
      }

      const trimmedText = text.trim();
      if (trimmedText === '' || trimmedText === '[]') {
        return;
      }

      // Clear existing timeout
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }

      // Accumulate the AI response
      setCurrentAIMessage(prev => {
        const newMessage = prev + trimmedText;
        console.log('[RecipeHelperAIMode] Accumulated message:', newMessage);
        
        // Update existing message or create new one
        if (currentMessageId) {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === currentMessageId 
                ? { ...msg, content: newMessage }
                : msg
            )
          );
        } else {
          const messageId = Date.now().toString();
          setCurrentMessageId(messageId);
          const newMsg: Message = {
            id: messageId,
            type: 'ai',
            content: newMessage,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMsg]);
        }
        
        // Set timeout to detect end of response
        responseTimeoutRef.current = setTimeout(() => {
          handleTurnComplete(newMessage);
        }, 1500); // Wait 1.5 seconds after last chunk
        
        return newMessage;
      });
    };

    const handleTurnComplete = (finalMessage?: string) => {
      const messageToProcess = finalMessage || currentAIMessage;
      console.log('[RecipeHelperAIMode] Turn complete, processing final message:', messageToProcess);
      
      if (messageToProcess.trim()) {
        // Parse the complete response for recipe recommendations
        const parsedResponse = parseGeminiRecipeResponse(messageToProcess);
        
        // Check if we should generate recipe cards
        const shouldShowRecipes = /推荐|菜谱|食谱|制作|烹饪|做法|菜|recipe|建议|可以做|试试|怎么做|什么菜|土豆烧鸡块|咖喱鸡肉土豆|小鸡炖蘑菇/i.test(messageToProcess);
        
        console.log('[RecipeHelperAIMode] Should show recipes:', shouldShowRecipes);
        
        if (shouldShowRecipes) {
          const mockRecipes = createMockRecipeCards(allIngredients);
          console.log('[RecipeHelperAIMode] Generated mock recipes:', mockRecipes.length);
          
          if (mockRecipes.length > 0 && currentMessageId) {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === currentMessageId 
                  ? { ...msg, content: messageToProcess, recipes: mockRecipes }
                  : msg
              )
            );
          }
        }
      }
      
      // Reset for next turn
      setCurrentAIMessage('');
      setCurrentMessageId(null);
      setIsProcessing(false);
    };

    // Set up text response listener only once when connected
    console.log('[RecipeHelperAIMode] Setting up text response listener, status:', status);
    if (status === 'connected') {
      console.log('[RecipeHelperAIMode] Adding text response listener');
      onTextResponse(handleGeminiTextResponse);
      
      // Return cleanup function
      return () => {
        console.log('[RecipeHelperAIMode] Cleaning up text response listener');
        offTextResponse(handleGeminiTextResponse);
      };
    }
  }, [status]); // Keep simple dependencies

  // Update detected ingredients
  useEffect(() => {
    if (detectedIngredients.length > 0) {
      const newIngredients = detectedIngredients.map(item => item.ingredient);
      setAllIngredients(prev => {
        const combined = [...prev, ...newIngredients];
        return [...new Set(combined)]; // Remove duplicates
      });
    }
  }, [detectedIngredients]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await connect();
      if (!success) {
        throw new Error('连接失败');
      }
    } catch (err) {
      console.error('连接Gemini失败:', err);
      Alert.alert('连接错误', '无法连接到AI服务。请检查网络连接或稍后重试。');
    } finally {
      setIsConnecting(false);
    }
  };

  const addMessage = (type: 'user' | 'ai', content: string, ingredients?: string[], recipes?: RecipeCardType[]) => {
    // Validate content to prevent rendering issues
    if (!content || typeof content !== 'string') {
      console.warn('[RecipeHelperAIMode] Invalid message content:', content);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content: content.toString(), // Ensure it's a string
      timestamp: new Date(),
      ingredients,
      recipes
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);
    setIsProcessing(true);

    try {
      // Extract ingredients locally for immediate UI feedback
      const ingredients = extractIngredientsFromText(userMessage);
      if (ingredients.length > 0) {
        setAllIngredients(prev => {
          const combined = [...prev, ...ingredients];
          return [...new Set(combined)];
        });
      }

      // Send to Gemini for conversational response
      await handleGeminiConversation(userMessage);
    } catch (error) {
      addMessage('ai', '抱歉，处理你的消息时出现了问题。请重试。');
      setIsProcessing(false);
    }
  };

  const extractIngredientsFromText = (text: string): string[] => {
    // Simple ingredient extraction logic
    const commonIngredients = [
      '西红柿', '土豆', '洋葱', '胡萝卜', '白菜', '菠菜', '豆腐', '鸡蛋', '牛肉', '猪肉', '鸡肉', 
      '鱼', '大蒜', '生姜', '葱', '芹菜', '青椒', '茄子', '黄瓜', '萝卜', '韭菜', '豆角',
      '米饭', '面条', '面包', '奶酪', '牛奶', '酸奶', '鸡胸肉', '虾', '蘑菇', '玉米',
      'tomato', 'potato', 'onion', 'carrot', 'cabbage', 'spinach', 'tofu', 'egg', 'beef', 
      'pork', 'chicken', 'fish', 'garlic', 'ginger', 'celery', 'pepper', 'cheese', 'milk'
    ];
    
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonIngredients.forEach(ingredient => {
      if (lowerText.includes(ingredient.toLowerCase())) {
        found.push(ingredient);
      }
    });
    
    return found;
  };

  const generateAIResponse = (ingredients: string[]): string => {
    if (ingredients.length === 0) {
      return "请告诉我更多具体的食材信息。";
    }
    
    if (ingredients.length === 1) {
      return `你有${ingredients[0]}。还有其他食材吗？我可以帮你找到使用多种食材的菜谱。`;
    }
    
    return `很好！用${ingredients.join('、')}可以做出很多美味的菜肴！你对菜系类型或烹饪时间有偏好吗？`;
  };

  const handleGeminiConversation = async (userInput: string) => {
    try {
      console.log('[RecipeHelperAIMode] handleGeminiConversation called with:', userInput);
      console.log('[RecipeHelperAIMode] Current status:', status);
      
      if (status === 'connected') {
        // Build context-aware prompt for Gemini
        const contextPrompt = buildConversationContext(userInput);
        console.log('[RecipeHelperAIMode] Sending context prompt to Gemini:', contextPrompt);
        
        // Send to Gemini Live API
        sendTextMessage(contextPrompt);
        console.log('[RecipeHelperAIMode] Message sent to Gemini, waiting for response...');
        
        // Set up timeout fallback in case Gemini doesn't respond
        setTimeout(() => {
          if (isProcessing) {
            console.warn('[RecipeHelperAIMode] Gemini response timeout, using fallback');
            const fallbackResponse = generateContextualResponse(userInput);
            addMessage('ai', fallbackResponse);
            setIsProcessing(false);
          }
        }, 8000); // 8 second timeout
        
        // Response will be handled by the text response listener
      } else {
        console.log('[RecipeHelperAIMode] Not connected to Gemini, using local processing');
        // Fallback to local processing
        const localResponse = generateContextualResponse(userInput);
        addMessage('ai', localResponse);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Gemini conversation error:', error);
      addMessage('ai', '抱歉，我现在无法处理你的请求。请稍后再试。');
      setIsProcessing(false);
    }
  };

  const buildConversationContext = (userInput: string): string => {
    const currentIngredients = allIngredients.length > 0 ? allIngredients.join('、') : '无';
    const recentMessages = messages.slice(-3); // Last 3 messages for context
    
    let contextHistory = '';
    recentMessages.forEach(msg => {
      contextHistory += `${msg.type === 'user' ? '用户' : 'AI'}：${msg.content}\n`;
    });
    
    return `作为一个专业的厨房助手，请基于以下上下文进行对话：

当前已知食材：${currentIngredients}
对话历史：
${contextHistory}

用户刚刚说：${userInput}

请给出自然、有帮助的回应，专注于：
1. 理解用户的食材和需求
2. 提供烹饪建议和食谱方向
3. 询问相关的偏好（口味、难度、时间等）
4. 保持友好和专业的语调

如果用户提到了新的食材，请确认并记住它们。`;
  };

  const generateContextualResponse = (userInput: string): string => {
    const ingredients = extractIngredientsFromText(userInput);
    
    // Check if user is asking about recipes
    if (userInput.includes('食谱') || userInput.includes('菜谱') || userInput.includes('怎么做') || userInput.includes('recipe')) {
      if (allIngredients.length > 0) {
        return `基于你的食材（${allIngredients.join('、')}），我可以为你推荐一些美味的菜谱！你想要什么类型的菜？比如：
        
🍜 汤类
🍖 荤菜
🥬 素菜
🍝 面食
🍛 米饭类

或者你有其他特殊要求吗？比如烹饪时间、难度等级？`;
      } else {
        return '请先告诉我你有什么食材，我就能为你推荐合适的菜谱了！';
      }
    }
    
    // Check if user mentioned new ingredients
    if (ingredients.length > 0) {
      return `好的！我注意到你提到了：${ingredients.join('、')}。${allIngredients.length > 0 ? `加上之前的食材，现在我们有：${[...allIngredients, ...ingredients].join('、')}。` : ''}
      
你想做什么类型的菜？我可以根据你的偏好推荐一些食谱。`;
    }
    
    // General conversational response
    if (userInput.includes('你好') || userInput.includes('hi') || userInput.includes('hello')) {
      return '你好！我是你的AI厨房助手。告诉我你有什么食材，我来帮你找到完美的菜谱！';
    }
    
    return '我理解了。还有什么我可以帮你的吗？比如告诉我更多食材，或者说说你想要什么类型的菜？';
  };

  const handleVoiceInput = async () => {
    try {
      if (speechService.getRecordingStatus()) {
        // Stop recording
        addMessage('ai', '正在处理你的语音...');
        setIsProcessing(true);
        
        const audioUri = await speechService.stopRecording();
        if (audioUri) {
          // Transcribe audio
          const result: SpeechRecognitionResult = await speechService.transcribeAudio(audioUri);
          
          // Add user's voice message to chat
          addMessage('user', result.transcript);
          
          // Extract ingredients locally for immediate UI feedback
          if (result.ingredients.length > 0) {
            setAllIngredients(prev => {
              const combined = [...prev, ...result.ingredients];
              return [...new Set(combined)];
            });
          }
          
          // Send transcribed text directly to Gemini for conversational response
          await handleGeminiConversation(result.transcript);
        } else {
          addMessage('ai', '语音录制失败，请重试');
          setIsProcessing(false);
        }
      } else {
        // Start recording
        const success = await speechService.startRecording();
        if (success) {
          addMessage('ai', '🎤 我在听，请说话...');
        } else {
          Alert.alert('错误', '无法开始录音，请检查麦克风权限');
        }
      }
    } catch (error) {
      console.error('Voice input error:', error);
      Alert.alert('错误', '语音功能出现问题，请重试');
      setIsProcessing(false);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert('拍照功能', '拍照识别功能正在开发中，请暂时使用文字描述食材。');
  };

  const handleGenerateRecipes = async () => {
    if (allIngredients.length === 0) {
      Alert.alert('提示', '请先告诉我一些食材信息。');
      return;
    }
    
    // Show loading state
    setIsProcessing(true);
    addMessage('ai', '正在为你寻找最合适的食谱...');
    
    try {
      // Get recipes from Edamam
      const { fetchRecipesFromEdamam } = await import('../services/edamamService');
      const rawRecipes = await fetchRecipesFromEdamam(allIngredients);
      
      if (rawRecipes.length === 0) {
        addMessage('ai', '抱歉，没有找到合适的食谱。要不要试试其他食材组合？');
        setIsProcessing(false);
        return;
      }
      
      // Use Gemini to filter and rank recipes
      const filteredRecipes = await filterRecipesWithGemini(rawRecipes, allIngredients);
      
      // Show Gemini's recommendations
      const recommendationMessage = generateRecipeRecommendationMessage(filteredRecipes);
      addMessage('ai', recommendationMessage);
      
      setIsProcessing(false);
      
      // Proceed with the filtered recipes
      onIngredientsConfirmed(allIngredients);
    } catch (error) {
      console.error('Recipe generation error:', error);
      addMessage('ai', '抱歉，获取食谱时出现了问题。让我们直接使用你的食材继续。');
      setIsProcessing(false);
      onIngredientsConfirmed(allIngredients);
    }
  };

  const filterRecipesWithGemini = async (recipes: any[], ingredients: string[]): Promise<any[]> => {
    try {
      if (status === 'connected') {
        // Build context for Gemini recipe filtering
        const filteringPrompt = buildRecipeFilteringPrompt(recipes, ingredients);
        
        // Send to Gemini and wait for response
        return new Promise((resolve) => {
          const handleFilteringResponse = (text: string) => {
            try {
              // Try to parse JSON response
              const jsonMatch = text.match(/\{.*\}/s);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                  // Convert Gemini recommendations back to recipe format
                  const filteredRecipes = parsed.recommendations.map((rec: any) => {
                    const originalRecipe = recipes.find(r => r.name === rec.name) || recipes[rec.rank - 1];
                    return {
                      ...originalRecipe,
                      geminiReason: rec.reason
                    };
                  });
                  resolve(filteredRecipes);
                  return;
                }
              }
              
              // Fallback to local filtering if JSON parsing fails
              resolve(simulateGeminiFiltering(recipes, ingredients));
            } catch (error) {
              console.error('Failed to parse Gemini filtering response:', error);
              resolve(simulateGeminiFiltering(recipes, ingredients));
            } finally {
              offTextResponse(handleFilteringResponse);
            }
          };
          
          onTextResponse(handleFilteringResponse);
          sendTextMessage(filteringPrompt);
          
          // Timeout fallback
          setTimeout(() => {
            offTextResponse(handleFilteringResponse);
            resolve(simulateGeminiFiltering(recipes, ingredients));
          }, 10000);
        });
      } else {
        // Fallback to local filtering
        return simulateGeminiFiltering(recipes, ingredients);
      }
    } catch (error) {
      console.error('Recipe filtering error:', error);
      return recipes.slice(0, 5); // Return top 5 as fallback
    }
  };

  const buildRecipeFilteringPrompt = (recipes: any[], ingredients: string[]): string => {
    const recipeList = recipes.slice(0, 10).map((recipe, index) => 
      `${index + 1}. ${recipe.name} - ${recipe.description || '美味食谱'}`
    ).join('\n');
    
    const conversationContext = messages.slice(-5).map(msg => 
      `${msg.type === 'user' ? '用户' : 'AI'}：${msg.content}`
    ).join('\n');
    
    return `作为专业厨房助手，请根据以下信息为用户推荐最合适的5个食谱：

用户食材：${ingredients.join('、')}

对话上下文：
${conversationContext}

候选食谱：
${recipeList}

请基于以下标准进行筛选和排序：
1. 食材匹配度（优先使用用户现有食材）
2. 用户在对话中表达的偏好（口味、难度、时间等）
3. 营养均衡性
4. 制作难度适中
5. 受欢迎程度

请以JSON格式返回排序后的前5个食谱，格式如下：
{
  "recommendations": [
    {
      "rank": 1,
      "name": "食谱名称",
      "reason": "推荐理由"
    }
  ],
  "summary": "总结性的推荐说明"
}

请确保返回的是有效的JSON格式。`;
  };

  const simulateGeminiFiltering = (recipes: any[], ingredients: string[]) => {
    // Simulate intelligent filtering based on conversation context
    const scored = recipes.map(recipe => {
      let score = 0;
      
      // Score based on ingredient match
      const recipeIngredients = recipe.ingredients || [];
      const matchCount = ingredients.filter(ing => 
        recipeIngredients.some((recipeIng: string) => 
          recipeIng.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(recipeIng.toLowerCase())
        )
      ).length;
      score += matchCount * 10;
      
      // Score based on difficulty preference (prefer easy to medium)
      if (recipe.difficulty === 'Easy') score += 5;
      else if (recipe.difficulty === 'Medium') score += 3;
      
      // Score based on cooking time (prefer shorter times)
      const cookTimeMatch = recipe.cookTime?.match(/(\d+)/);
      if (cookTimeMatch) {
        const minutes = parseInt(cookTimeMatch[1]);
        if (minutes <= 30) score += 5;
        else if (minutes <= 60) score += 3;
      }
      
      // Random factor for variety
      score += Math.random() * 2;
      
      return { ...recipe, score };
    });
    
    // Sort by score and return top 5
    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  const generateRecipeRecommendationMessage = (recipes: any[]): string => {
    if (recipes.length === 0) {
      return '抱歉，没有找到合适的食谱。';
    }
    
    let message = `太好了！基于你的食材和偏好，我为你精选了${recipes.length}个食谱：\n\n`;
    
    recipes.forEach((recipe, index) => {
      message += `${index + 1}. **${recipe.name}**\n`;
      message += `   ⏱️ ${recipe.cookTime || '30分钟'} | 🔥 ${recipe.difficulty || 'Medium'}\n`;
      
      // Use Gemini's reason if available, otherwise use description
      if (recipe.geminiReason) {
        message += `   💡 ${recipe.geminiReason}\n\n`;
      } else {
        message += `   ${recipe.description || '美味可口的家常菜'}\n\n`;
      }
    });
    
    message += '这些食谱都很适合你的食材搭配！准备好开始烹饪了吗？';
    
    return message;
  };

  const renderConnectionStatus = () => {
    if (isConnecting) {
      return (
        <View style={styles.statusBar}>
          <ActivityIndicator size="small" color="#FB7185" />
          <Text style={styles.statusText}>正在连接AI服务...</Text>
        </View>
      );
    }
    
    if (status === 'connected') {
      return (
        <View style={[styles.statusBar, styles.statusConnected]}>
          <Text style={styles.statusDot}>●</Text>
          <Text style={styles.statusText}>AI助手已连接</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={[styles.statusBar, styles.statusError]}>
          <Text style={styles.statusDot}>●</Text>
          <Text style={styles.statusText}>连接失败，使用基础模式</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderConnectionStatus()}
      
      {/* Todo List Button */}
      {navigation && (
        <TouchableOpacity 
          style={styles.todoListButton}
          onPress={handleViewTodoList}
        >
          <Text style={styles.todoListButtonText}>📝 待做清单</Text>
        </TouchableOpacity>
      )}
      
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <View key={message.id}>
            <View
              style={[
                styles.messageBubble,
                message.type === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{message.content}</Text>
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
                    onViewDetails={handleViewRecipeDetails}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
        
        {isProcessing && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.messageText}>AI正在思考...</Text>
          </View>
        )}
      </ScrollView>

      {/* Current Ingredients */}
      {allIngredients.length > 0 && (
        <View style={styles.ingredientsBar}>
          <Text style={styles.ingredientsTitle}>已识别食材：</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {allIngredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Controls */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              speechService.getRecordingStatus() && styles.actionButtonActive
            ]} 
            onPress={handleVoiceInput}
          >
            <Text style={styles.actionButtonText}>
              {speechService.getRecordingStatus() ? '⏹️' : '🎤'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handlePhotoUpload}>
            <Text style={styles.actionButtonText}>📷</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="描述你的食材..."
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
            <Text style={styles.sendButtonText}>发送</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => {
            const mockRecipes = createMockRecipeCards(allIngredients);
            console.log('[RecipeHelperAIMode] Test button clicked, generated recipes:', mockRecipes.length);
            addMessage('ai', '🍳 以下是为您推荐的菜谱：', undefined, mockRecipes);
          }}
        >
          <Text style={styles.testButtonText}>🍳 测试菜谱卡片</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.generateButton, allIngredients.length === 0 && styles.generateButtonDisabled]}
          onPress={handleGenerateRecipes}
          disabled={allIngredients.length === 0}
        >
          <Text style={styles.generateButtonText}>
            🍽️ 生成菜谱 {allIngredients.length > 0 && `(${allIngredients.length}种食材)`}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusConnected: {
    backgroundColor: '#ECFDF5',
  },
  statusError: {
    backgroundColor: '#FEF2F2',
  },
  statusDot: {
    fontSize: 12,
    color: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FB7185',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
  ingredientsBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFBEB',
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  ingredientTag: {
    backgroundColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 13,
    color: '#9A3412',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionButtonActive: {
    backgroundColor: '#FB7185',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#FB7185',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  generateButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipesContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  todoListButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 8,
  },
  todoListButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 