import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const chatHistory = [
  {
    id: '1',
    character: { name: 'Buzzy', emoji: '🐰', background: '#FCE7F3' },
    lastMessage: 'How about some comfort ramen for this rainy day?',
    timestamp: '2 hours ago',
    unread: 2,
  },
  {
    id: '2',
    character: { name: 'Luma', emoji: '🐱', background: '#DCFCE7' },
    lastMessage: 'I found a perfect pasta recipe for you!',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    character: { name: 'Foxy', emoji: '🦊', background: '#E9D5FF' },
    lastMessage: ",Ready for today's food challenge?",
    timestamp: '2 days ago',
    unread: 1,
  },
  {
    id: '4',
    character: { name: 'Truffina', emoji: '🐶', background: '#FFEDD5' },
    lastMessage: ",Did you know it's National Taco Day?",
    timestamp: '3 days ago',
    unread: 0,
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            {/* <MessageCircle /> */}
            <Text style={styles.headerIcon}>💬</Text>
            <Text style={styles.headerTitle}>Chat History</Text>
          </View>
          <Text style={styles.headerSubtitle}>Continue your conversations with AI companions</Text>
        </View>

        {/* Chat List */}
        <View style={styles.contentRow}>
          {chatHistory.map((chat) => {
            const isSelected = selectedChat === chat.id;
            return (
              <TouchableOpacity
                key={chat.id}
                style={[
                  styles.card,
                  { backgroundColor: chat.character.background },
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => handleChatSelect(chat.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  {/* Character Avatar */}
                  <View style={styles.avatarBox}>
                    <Text style={styles.avatarEmoji}>{chat.character.emoji}</Text>
                  </View>
                  {/* Chat Info */}
                  <View style={styles.chatInfoBox}>
                    <View style={styles.chatInfoHeader}>
                      <Text style={styles.cardTitle}>{chat.character.name}</Text>
                      <View style={styles.chatInfoRight}>
                        {chat.unread > 0 && (
                          <View style={styles.unreadDot}>
                            <Text style={styles.unreadDotText}>{chat.unread}</Text>
                          </View>
                        )}
                        <View style={styles.timestampRow}>
                          {/* <Clock /> */}
                          <Text style={styles.clockIcon}>⏰</Text>
                          <Text style={styles.timestampText}>{chat.timestamp}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastMessage}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start New Chat */}
        <TouchableOpacity style={styles.newChatBtn} activeOpacity={0.85}>
          <Text style={styles.newChatBtnText}>Start New Chat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  scrollContainer: { flexGrow: 1, paddingBottom: 24 },
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  headerIcon: { fontSize: 28, marginRight: 8 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  contentRow: { marginHorizontal: 24, marginBottom: 24 },
  card: { borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2 },
  cardSelected: { borderWidth: 2, borderColor: '#D1D5DB', shadowOpacity: 0.18, elevation: 3, transform: [{ scale: 1.02 }] },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  avatarBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 4, elevation: 1 },
  avatarEmoji: { fontSize: 32 },
  chatInfoBox: { flex: 1, minWidth: 0 },
  chatInfoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1F2937' },
  chatInfoRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unreadDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  unreadDotText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  timestampRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  clockIcon: { fontSize: 13, color: '#6B7280', marginRight: 2 },
  timestampText: { fontSize: 12, color: '#6B7280' },
  lastMessage: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 2 },
  newChatBtn: { marginHorizontal: 24, marginTop: 16, backgroundColor: '#FB7185', borderRadius: 32, paddingVertical: 16, alignItems: 'center', shadowColor: '#FB7185', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  newChatBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
}); 