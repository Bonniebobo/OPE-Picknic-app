import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';

const characters = [
  {
    id: 'mood-matcher',
    name: 'Mood Matcher',
    tagline: "Comfort food for your mood",
    emoji: '🩷',
    description: 'Understands your emotions',
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
    tagline: 'Kitchen companion',
    emoji: '🥕',
    description: 'Helps you cook',
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
    name: 'Explorer',
    tagline: 'Find hidden gems',
    emoji: '🌍',
    description: 'Discovers new places',
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
    name: 'Game Bot',
    tagline: "Let's play!",
    emoji: '🎮',
    description: 'Fun food games',
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

// User preferences data from onboarding
const userPreferences = {
  eatingPreference: 'omnivore',
  foodsToAvoid: ['spicy', 'organ-meats'],
  allergies: ['no-allergies'],
  profileData: {
    name: 'Zihan',
    joinDate: 'January 2024',
    completedChats: 12,
    favoriteCuisines: ['Italian', 'Japanese', 'Mediterranean'],
  }
};

// Preference display mapping
const preferenceLabels: Record<string, { text: string; emoji: string; color: string }> = {
  // Eating preferences
  'vegetarian': { text: 'Vegetarian', emoji: '🥗', color: '#D1FAE5' },
  'vegan': { text: 'Vegan', emoji: '🌱', color: '#A7F3D0' },
  'omnivore': { text: 'Omnivore', emoji: '🍖', color: '#FED7AA' },
  'not-sure': { text: 'Not sure', emoji: '❓', color: '#DDD6FE' },
  
  // Foods to avoid
  'spicy': { text: 'Spicy food', emoji: '🌶️', color: '#FECACA' },
  'seafood': { text: 'Seafood', emoji: '🐟', color: '#BFDBFE' },
  'onion-garlic': { text: 'Onion / Garlic', emoji: '🧄', color: '#FEF3C7' },
  'organ-meats': { text: 'Organ meats', emoji: '🐷', color: '#FBCFE8' },
  'none': { text: 'None', emoji: '🚫', color: '#E5E7EB' },
  
  // Allergies
  'peanuts': { text: 'Peanuts', emoji: '🥜', color: '#FDE68A' },
  'dairy': { text: 'Dairy', emoji: '🥛', color: '#BFDBFE' },
  'gluten': { text: 'Gluten', emoji: '🍞', color: '#FEF3C7' },
  'eggs': { text: 'Eggs', emoji: '🥚', color: '#FED7AA' },
  'no-allergies': { text: 'No allergies', emoji: '✅', color: '#D1FAE5' },
};

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
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) {
    return { dish: 'Fresh Spring Salad', reason: "Perfect for spring", emoji: '🥗', type: 'seasonal', decorations: ['🌸', '🦋', '🌿'] };
  } else if (month >= 6 && month <= 8) {
    return { dish: 'Cold Gazpacho', reason: 'Cool summer vibes', emoji: '🍅', type: 'seasonal', decorations: ['☀️', '🌊', '🧊'] };
  } else if (month >= 9 && month <= 11) {
    return { dish: 'Roasted Vegetables', reason: "Cozy autumn flavors", emoji: '🥕', type: 'seasonal', decorations: ['🍂', '🌾', '🎃'] };
  } else {
    return { dish: 'Hot Ramen Bowl', reason: 'Winter comfort food', emoji: '🍜', type: 'seasonal', decorations: ['❄️', '🔥', '🧣'] };
  }
}

export default function HomePage({ eatingPreference = 'unsure', onBotSelect, onMoodMatchSelect }: { eatingPreference?: string; onBotSelect?: (botId: string) => void; onMoodMatchSelect?: () => void }) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const seasonalPick = getSeasonalPick();

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    if (characterId === 'mood-matcher' && onMoodMatchSelect) {
      onMoodMatchSelect();
    } else if (onBotSelect) {
      onBotSelect(characterId);
    }
  };

  const handleQuickAction = (actionId: string) => {
    // Can integrate navigation or functionality
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <TouchableOpacity style={styles.profilePic} onPress={() => setShowProfileModal(true)} activeOpacity={0.8}>
            <Text style={{ fontSize: 28 }}>👤</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Hi, Zihan!</Text>
            <Text style={styles.greetingSubtitle}>What sounds good today?</Text>
            <Text style={{ color: '#FB7185', fontWeight: 'bold', marginTop: 6 }}>
              {eatingPreference}
            </Text>
          </View>
        </View>

        {/* AI Bot Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🧸</Text> Pick Your AI</Text>
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
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🍽️</Text> Today's Special</Text>
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
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>⚡</Text> Quick</Text>
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

      {/* User Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProfileModal(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My Profile</Text>
            <View style={styles.modalPlaceholder} />
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Profile Info */}
            <View style={styles.profileSection}>
              <View style={styles.profileAvatar}>
                <Text style={{ fontSize: 48 }}>👤</Text>
              </View>
              <Text style={styles.profileName}>{userPreferences.profileData.name}</Text>
              <Text style={styles.profileJoinDate}>Since {userPreferences.profileData.joinDate}</Text>
              <Text style={styles.profileStats}>{userPreferences.profileData.completedChats} chats</Text>
            </View>

            {/* Eating Preference */}
            <View style={styles.preferenceSection}>
              <Text style={styles.preferenceSectionTitle}>🍽️ Diet</Text>
              <View style={[styles.preferenceCard, { backgroundColor: preferenceLabels[userPreferences.eatingPreference].color }]}>
                <Text style={styles.preferenceEmoji}>{preferenceLabels[userPreferences.eatingPreference].emoji}</Text>
                <Text style={styles.preferenceText}>{preferenceLabels[userPreferences.eatingPreference].text}</Text>
              </View>
            </View>

            {/* Foods to Avoid */}
            <View style={styles.preferenceSection}>
              <Text style={styles.preferenceSectionTitle}>🚫 Avoid</Text>
              <View style={styles.preferenceGrid}>
                {userPreferences.foodsToAvoid.map((item, index) => (
                  <View key={index} style={[styles.preferenceCard, { backgroundColor: preferenceLabels[item].color }]}>
                    <Text style={styles.preferenceEmoji}>{preferenceLabels[item].emoji}</Text>
                    <Text style={styles.preferenceText}>{preferenceLabels[item].text}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Allergies */}
            <View style={styles.preferenceSection}>
              <Text style={styles.preferenceSectionTitle}>⚠️ Allergies</Text>
              <View style={styles.preferenceGrid}>
                {userPreferences.allergies.map((item, index) => (
                  <View key={index} style={[styles.preferenceCard, { backgroundColor: preferenceLabels[item].color }]}>
                    <Text style={styles.preferenceEmoji}>{preferenceLabels[item].emoji}</Text>
                    <Text style={styles.preferenceText}>{preferenceLabels[item].text}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Favorite Cuisines */}
            <View style={styles.preferenceSection}>
              <Text style={styles.preferenceSectionTitle}>❤️ Favorites</Text>
              <View style={styles.cuisineGrid}>
                {userPreferences.profileData.favoriteCuisines.map((cuisine, index) => (
                  <View key={index} style={styles.cuisineCard}>
                    <Text style={styles.cuisineText}>{cuisine}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
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
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#FFF7ED' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalCloseButton: { padding: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  modalCloseText: { fontSize: 16, color: '#6B7280', fontWeight: 'bold' },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' },
  modalPlaceholder: { width: 50 },
  modalContent: { flex: 1, paddingHorizontal: 20 },
  // Profile section
  profileSection: { alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FBCFE8', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  profileJoinDate: { fontSize: 14, color: '#6B7280', marginBottom: 2 },
  profileStats: { fontSize: 14, color: '#FB7185', fontWeight: '600' },
  // Preference sections
  preferenceSection: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  preferenceSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  preferenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preferenceCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  preferenceEmoji: { fontSize: 16, marginRight: 8 },
  preferenceText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cuisineCard: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1, marginBottom: 8 },
  cuisineText: { fontSize: 14, fontWeight: '600', color: '#374151' },
}); 