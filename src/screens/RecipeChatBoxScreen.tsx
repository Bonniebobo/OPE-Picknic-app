import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface RecipeChatBoxScreenProps {
  onBack: () => void;
  onPicnic: (chatHistory: Message[]) => void;
  initialIngredients?: string[];
}

export default function RecipeChatBoxScreen({ onBack, onPicnic, initialIngredients = [] }: RecipeChatBoxScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai-1',
      sender: 'ai',
      text: `Hi! Tell me more about your preferences, dietary needs, or what you're in the mood for. I can help you find the perfect recipe!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);
    // Placeholder: Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Thanks for sharing! (AI would respond here based on your message and preferences.)`,
        },
      ]);
      setIsSending(false);
    }, 1200);
  };

  const handlePicnic = () => {
    // Placeholder: Send chat history and ingredients to AI for final recipe
    onPicnic(messages);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Recipe Chat</Text>
        </View>

        {/* Chat Area */}
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your preferences..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSend}
            editable={!isSending}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={isSending || !input.trim()}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Persistent Picnic Button */}
        <TouchableOpacity style={styles.picnicBtn} onPress={handlePicnic}>
          <Text style={styles.picnicBtnText}>🧺 Let's have a Picnic!</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 8,
    paddingHorizontal: 24,
    gap: 12,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginRight: 8,
  },
  backBtnText: {
    fontSize: 18,
    color: '#FB7185',
    fontWeight: 'bold',
  },
  headerBackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
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
    color: '#1F2937',
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    color: '#1F2937',
  },
  sendBtn: {
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  picnicBtn: {
    backgroundColor: '#F3E8FF',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#D8B4FE',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  picnicBtnText: {
    color: '#7C3AED',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 