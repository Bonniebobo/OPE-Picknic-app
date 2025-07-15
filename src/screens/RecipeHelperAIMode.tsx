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
  const {
    status,
    connect,
    disconnect,
    sendTextMessage,
    detectedIngredients,
    clearIngredients,
    error,
  } = useLiveAPI();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "你好！我是你的AI厨房助手。我可以帮你根据食材发现菜谱。你可以：\n\n✏️ 告诉我你有什么食材\n🎙️ 与我语音对话\n📷 拍照显示你的食材\n\n你今天有什么食材？",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-connect on mount
  useEffect(() => {
    if (status === 'disconnected') {
      handleConnect();
    }
    
    return () => {
      if (status === 'connected') {
        disconnect();
      }
    };
  }, []);

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

  const addMessage = (type: 'user' | 'ai', content: string, ingredients?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ingredients
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
      if (status === 'connected') {
        // Send to Gemini Live API
        sendTextMessage(`请帮我从这段话中识别食材：${userMessage}`);
        
        // Simulate AI response for now
        setTimeout(() => {
          const mockIngredients = extractIngredientsFromText(userMessage);
          if (mockIngredients.length > 0) {
            setAllIngredients(prev => {
              const combined = [...prev, ...mockIngredients];
              return [...new Set(combined)];
            });
            addMessage('ai', `我识别到了这些食材：${mockIngredients.join('、')}。${generateAIResponse(mockIngredients)}`, mockIngredients);
          } else {
            addMessage('ai', '我没有从你的描述中识别到具体的食材。可以试试更详细地描述一下吗？比如"我有西红柿、罗勒和奶酪"。');
          }
          setIsProcessing(false);
        }, 1500);
      } else {
        // Fallback if not connected
        const mockIngredients = extractIngredientsFromText(userMessage);
        if (mockIngredients.length > 0) {
          setAllIngredients(prev => {
            const combined = [...prev, ...mockIngredients];
            return [...new Set(combined)];
          });
          addMessage('ai', `我识别到了这些食材：${mockIngredients.join('、')}。${generateAIResponse(mockIngredients)}`, mockIngredients);
        } else {
          addMessage('ai', '我没有从你的描述中识别到具体的食材。可以试试更详细地描述一下吗？');
        }
        setIsProcessing(false);
      }
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

  const handleVoiceInput = () => {
    Alert.alert('语音功能', '语音输入功能正在开发中，请暂时使用文字输入。');
  };

  const handlePhotoUpload = () => {
    Alert.alert('拍照功能', '拍照识别功能正在开发中，请暂时使用文字描述食材。');
  };

  const handleGenerateRecipes = () => {
    if (allIngredients.length === 0) {
      Alert.alert('提示', '请先告诉我一些食材信息。');
      return;
    }
    
    onIngredientsConfirmed(allIngredients);
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
      
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <View
            key={message.id}
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
          <TouchableOpacity style={styles.actionButton} onPress={handleVoiceInput}>
            <Text style={styles.actionButtonText}>🎤</Text>
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
}); 