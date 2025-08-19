import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// AI Characters data matching HomePage
const aiCharacters = [
  {
    id: 'mood-matcher',
    name: 'Mood Matcher',
    emoji: '🩷',
    background: '#FCE7F3',
    avatarColors: {
      body: '#FBCFE8',
      head: '#F9A8D4',
      cheeks: '#F472B6',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
  {
    id: 'recipe-helper',
    name: 'Recipe Helper',
    emoji: '🥕',
    background: '#FFEDD5',
    avatarColors: {
      body: '#FED7AA',
      head: '#FDBA74',
      cheeks: '#FB923C',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
  {
    id: 'experienced-explorer',
    name: 'Experienced Explorer',
    emoji: '🌍',
    background: '#DCFCE7',
    avatarColors: {
      body: '#BBF7D0',
      head: '#86EFAC',
      cheeks: '#4ADE80',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
  {
    id: 'play-mode-bot',
    name: 'Play Mode Bot',
    emoji: '🎮',
    background: '#F3E8FF',
    avatarColors: {
      body: '#E9D5FF',
      head: '#D8B4FE',
      cheeks: '#A78BFA',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
];

const chatHistory = [
  {
    id: '1',
    character: aiCharacters[0], // Mood Matcher (pink)
    lastMessage: "Need some comfort food? Let's match your mood 💗",
    timestamp: '2 hours ago',
    unread: 2,
  },
  {
    id: '2',
    character: aiCharacters[1], // Recipe Helper (yellow)
    lastMessage: 'Found a perfect recipe with your ingredients!',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    character: aiCharacters[2], // Experienced Explorer (green)
    lastMessage: 'Try that hidden gem restaurant I mentioned!',
    timestamp: '2 days ago',
    unread: 1,
  },
  {
    id: '4',
    character: aiCharacters[3], // Play Mode Bot (purple)
    lastMessage: "Ready for a fun food challenge game?",
    timestamp: '3 days ago',
    unread: 0,
  },
];

// FlatAvatar component matching HomePage
const FlatAvatar = ({ colors }: { colors: any }) => (
  <View style={styles.avatarContainer}>
    {/* Body */}
    <View style={[styles.avatarBody, { backgroundColor: colors.body }]} />
    {/* Head */}
    <View style={[styles.avatarHead, { backgroundColor: colors.head }]}>
      {/* Eyes */}
      <View style={[styles.avatarEye, { left: 12, backgroundColor: colors.eyes }]} />
      <View style={[styles.avatarEye, { right: 12, backgroundColor: colors.eyes }]} />
      {/* Mouth */}
      <View style={[styles.avatarMouth, { backgroundColor: colors.mouth }]} />
      {/* Cheeks */}
      <View style={[styles.avatarCheek, { left: 6, backgroundColor: colors.cheeks }]} />
      <View style={[styles.avatarCheek, { right: 6, backgroundColor: colors.cheeks }]} />
    </View>
    {/* Arms */}
    <View style={[styles.avatarArm, { left: 0, backgroundColor: colors.body, transform: [{ rotate: '-12deg' }] }]} />
    <View style={[styles.avatarArm, { right: 0, backgroundColor: colors.body, transform: [{ rotate: '12deg' }] }]} />
  </View>
);

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
          <Text style={styles.headerSubtitle}>Continue your AI conversations</Text>
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
                    <FlatAvatar colors={chat.character.avatarColors} />
                  </View>
                  {/* Chat Info */}
                  <View style={styles.chatInfoBox}>
                    <View style={styles.chatInfoHeader}>
                      <Text style={styles.cardTitle}>{chat.character.name}</Text>
                      {chat.unread > 0 && (
                        <View style={styles.unreadDot}>
                          <Text style={styles.unreadDotText}>{chat.unread}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastMessage}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>


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
  chatInfoBox: { flex: 1, minWidth: 0 },
  chatInfoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1F2937' },
  unreadDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  unreadDotText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  lastMessage: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 2 },
  // FlatAvatar styles
  avatarContainer: { width: 48, height: 48, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  avatarBody: { position: 'absolute', bottom: 0, left: 12, width: 24, height: 14, borderRadius: 12 },
  avatarHead: { position: 'absolute', top: 0, left: 6, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarEye: { position: 'absolute', top: 12, width: 4, height: 4, borderRadius: 2 },
  avatarMouth: { position: 'absolute', top: 21, left: 15, width: 6, height: 3, borderRadius: 1.5 },
  avatarCheek: { position: 'absolute', top: 15, width: 4, height: 3, borderRadius: 1.5, opacity: 0.6 },
  avatarArm: { position: 'absolute', top: 27, width: 6, height: 12, borderRadius: 3 },
}); 