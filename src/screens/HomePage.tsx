import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const characters = [
  {
    id: 'mood-matcher',
    name: 'Mood Matcher',
    tagline: "Let's find comfort together",
    emoji: '🩷',
    description: 'A gentle, empathetic bot who understands your emotions and gives comforting food suggestions',
    background: '#FCE7F3',
    accent: '#FBCFE8',
    border: '#F9A8D4',
    glow: '#FBCFE8',
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
    tagline: 'Your caring kitchen companion',
    emoji: '🥕',
    description: 'A caring kitchen companion who helps you decide what to cook',
    background: '#FFEDD5',
    accent: '#FED7AA',
    border: '#FDBA74',
    glow: '#FED7AA',
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
    tagline: 'Discover hidden culinary gems',
    emoji: '🌍',
    description: 'A wise culinary adventurer who knows the hidden gems around the world',
    background: '#DCFCE7',
    accent: '#BBF7D0',
    border: '#86EFAC',
    glow: '#BBF7D0',
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
    tagline: "Let's play to decide!",
    emoji: '🎮',
    description: 'A fun, playful bot that helps you choose food through interactive games',
    background: '#F3E8FF',
    accent: '#E9D5FF',
    border: '#D8B4FE',
    glow: '#E9D5FF',
    avatarColors: {
      body: '#E9D5FF',
      head: '#D8B4FE',
      cheeks: '#A78BFA',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
];

const quickActions = [
  { id: 'explore', label: 'Explore Local', emoji: '🗺️', background: '#DBEAFE' },
  { id: 'pick-me', label: 'Pick for Me', emoji: '🎲', background: '#E9D5FF' },
  { id: 'diary', label: 'My Food Diary', emoji: '📓', background: '#DCFCE7' },
  { id: 'festival', label: 'Festival Tip', emoji: '✨', background: '#FEF9C3' },
];

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

function getSeasonalPick() {
  // 这里只做简单季节推荐，节日可后续补充
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) {
    return { dish: 'Fresh Seasonal Salad Bowl', reason: "Embrace spring's renewal with crisp, fresh ingredients", emoji: '🥗', type: 'seasonal', decorations: ['🌸', '🦋', '🌿'] };
  } else if (month >= 6 && month <= 8) {
    return { dish: 'Chilled Gazpacho Soup', reason: 'Cool down with refreshing summer flavors', emoji: '🍅', type: 'seasonal', decorations: ['☀️', '🌊', '🧊'] };
  } else if (month >= 9 && month <= 11) {
    return { dish: 'Roasted Root Vegetable Medley', reason: "Savor autumn's harvest with warming, earthy flavors", emoji: '🥕', type: 'seasonal', decorations: ['🍂', '🌾', '🎃'] };
  } else {
    return { dish: 'Comforting Bone Broth Ramen', reason: 'Warm your soul with nourishing winter comfort food', emoji: '🍜', type: 'seasonal', decorations: ['❄️', '🔥', '🧣'] };
  }
}

export default function HomePage({ eatingPreference = 'unsure', onBotSelect }: { eatingPreference?: string; onBotSelect?: (botId: string) => void }) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const seasonalPick = getSeasonalPick();

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    if (onBotSelect) {
      onBotSelect(characterId);
    }
  };

  const handleQuickAction = (actionId: string) => {
    // 可集成导航或功能
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <View style={styles.profilePic}><Text style={{ fontSize: 28 }}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Hi, Zihan!</Text>
            <Text style={styles.greetingSubtitle}>Ready for today's taste adventure?</Text>
            <Text style={{ color: '#FB7185', fontWeight: 'bold', marginTop: 6 }}>
              Your eating preference: {eatingPreference}
            </Text>
          </View>
        </View>

        {/* AI Bot Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🧸</Text> Choose Your AI Companion</Text>
          <View style={styles.characterGrid}>
            {characters.map((character) => {
              const isSelected = selectedCharacter === character.id;
              return (
                <TouchableOpacity
                  key={character.id}
                  style={[styles.characterCard, { backgroundColor: character.background, borderColor: isSelected ? character.border : 'transparent', transform: [{ scale: isSelected ? 1.05 : 1 }] }]}
                  onPress={() => handleCharacterSelect(character.id)}
                  activeOpacity={0.85}
                >
                  <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <FlatAvatar colors={character.avatarColors} />
                    <Text style={styles.characterName}>{character.name}</Text>
                    <Text style={styles.characterTagline}>{character.tagline}</Text>
                    {isSelected && <View style={styles.selectedDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Seasonal Pick Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🍽️</Text> Today's Pick</Text>
          <View style={styles.seasonalCard}>
            <View style={styles.seasonalCardContent}>
              <View style={{ alignItems: 'center', marginRight: 16 }}>
                <Text style={styles.seasonalEmoji}>{seasonalPick.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.seasonalDish}>{seasonalPick.dish}</Text>
                <Text style={styles.seasonalReason}>{seasonalPick.reason}</Text>
                <View style={styles.seasonalDecorationsRow}>
                  {seasonalPick.decorations.map((d, i) => (
                    <Text key={i} style={styles.seasonalDecoration}>{d}</Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>⚡</Text> Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionButton, { backgroundColor: action.background }]}
                onPress={() => handleQuickAction(action.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF7ED' },
  scrollContainer: { flexGrow: 1, paddingBottom: 24 },
  greetingSection: { flexDirection: 'row', alignItems: 'center', paddingTop: 32, paddingBottom: 16, paddingHorizontal: 24 },
  profilePic: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FBCFE8', alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  greetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  greetingSubtitle: { fontSize: 15, color: '#6B7280', marginTop: 2 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  characterGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  characterCard: { width: '48%', height: 150, borderRadius: 24, borderWidth: 2, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, padding: 8 },
  characterName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  characterTagline: { fontSize: 12, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  selectedDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FB7185', alignSelf: 'center', marginTop: 6 },
  seasonalCard: { backgroundColor: '#FFF', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, marginBottom: 8 },
  seasonalCardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  seasonalEmoji: { fontSize: 44, marginBottom: 4 },
  seasonalDish: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  seasonalReason: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  seasonalDecorationsRow: { flexDirection: 'row', gap: 4 },
  seasonalDecoration: { fontSize: 18, marginRight: 4 },
  quickActionsRow: { flexDirection: 'row', marginTop: 4 },
  quickActionButton: { borderRadius: 24, paddingVertical: 16, paddingHorizontal: 18, alignItems: 'center', marginRight: 12, minWidth: 85, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6, elevation: 2 },
  quickActionEmoji: { fontSize: 28, marginBottom: 4 },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: '#374151', textAlign: 'center' },
  // FlatAvatar styles
  avatarContainer: { width: 64, height: 64, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  avatarBody: { position: 'absolute', bottom: 0, left: 16, width: 32, height: 18, borderRadius: 16 },
  avatarHead: { position: 'absolute', top: 0, left: 8, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarEye: { position: 'absolute', top: 16, width: 6, height: 6, borderRadius: 3 },
  avatarMouth: { position: 'absolute', top: 28, left: 20, width: 8, height: 4, borderRadius: 2 },
  avatarCheek: { position: 'absolute', top: 20, width: 6, height: 4, borderRadius: 2, opacity: 0.6 },
  avatarArm: { position: 'absolute', top: 36, width: 8, height: 16, borderRadius: 4 },
}); 