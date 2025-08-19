import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const characters = [
  { id: 'luma-cat', name: 'Luma', role: 'Smart Chef', emoji: '🐱', background: '#DCFCE7', accent: '#BBF7D0', border: '#86EFAC', description: 'Your culinary expert who knows the perfect recipe for any mood', glow: '#BBF7D0' },
  { id: 'buzzy-bunny', name: 'Buzzy', role: 'Mood Matcher', emoji: '🐰', background: '#FCE7F3', accent: '#FBCFE8', border: '#F9A8D4', description: 'Understands your feelings and suggests comfort foods', glow: '#FBCFE8' },
  { id: 'foxy', name: 'Foxy', role: 'Game Explorer', emoji: '🦊', background: '#E9D5FF', accent: '#C4B5FD', border: '#A78BFA', description: 'Makes eating fun with food games and challenges', glow: '#C4B5FD' },
  { id: 'truffina-dog', name: 'Truffina', role: 'Festive Guide', emoji: '🐶', background: '#FFEDD5', accent: '#FED7AA', border: '#FDBA74', description: 'Celebrates food culture and seasonal specialties', glow: '#FED7AA' },
];

const quickActions = [
  { id: 'explore', label: 'Explore Local', emoji: '🗺️', background: '#DBEAFE' },
  { id: 'pick-me', label: 'Pick for Me', emoji: '🎲', background: '#E9D5FF' },
  { id: 'diary', label: 'My Food Diary', emoji: '📓', background: '#DCFCE7' },
  { id: 'festival', label: 'Festival Tip', emoji: '✨', background: '#FEF9C3' },
];

interface PicknicHomeProps {
  eatingPreference?: string;
}

export default function HomeScreen({ eatingPreference = 'unsure' }: PicknicHomeProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleQuickAction = (actionId: string) => {
    // Can integrate navigation or functionality
  };

  const getDiningModeEmoji = () => {
    switch (eatingPreference) {
      case 'cook': return '🍳';
      case 'delivery': return '🛵';
      case 'restaurant': return '🍽️';
      default: return '🤔';
    }
  };

  const getDailyPick = () => {
    const picks: any = {
      cook: { dish: 'Homemade Ramen Bowl', reason: "We picked this based on your love for cooking & today's cozy weather", emoji: '🍜', background: '#FFEDD5' },
      delivery: { dish: 'Thai Green Curry', reason: 'We picked this based on your delivery preference & your adventurous mood', emoji: '🍛', background: '#DCFCE7' },
      restaurant: { dish: 'Artisan Wood-Fired Pizza', reason: 'We picked this based on your dining out mood & nearby top-rated spots', emoji: '🍕', background: '#FECACA' },
      default: { dish: 'Warm Soba Noodles', reason: "We picked this based on your mood & today's weather", emoji: '🍲', background: '#E9D5FF' },
    };
    return picks[eatingPreference as keyof typeof picks] || picks.default;
  };

  const dailyPick = getDailyPick();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Greeting Section */}
        <View style={styles.greetingSection}>
          <View style={styles.profilePic}><Text style={{ fontSize: 28 }}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Hi, Zihan! <Text style={{ fontSize: 22 }}>{getDiningModeEmoji()}</Text></Text>
            <Text style={styles.greetingSubtitle}>Ready for your food adventure today?</Text>
          </View>
        </View>

        {/* Pick Your AI Companion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🧸</Text> Pick Your AI Companion</Text>
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
                    <Text style={styles.characterEmoji}>{character.emoji}</Text>
                    <Text style={styles.characterName}>{character.name}</Text>
                    <Text style={styles.characterRole}>{character.role}</Text>
                    {isSelected && <View style={styles.selectedDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Daily Food Suggestion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🍱</Text> Today's Pick for You</Text>
          <View style={[styles.dailyPickCard, { backgroundColor: dailyPick.background }] }>
            <View style={styles.dailyPickCardContent}>
              <Text style={styles.dailyPickEmoji}>{dailyPick.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dailyPickDish}>{dailyPick.dish}</Text>
                <Text style={styles.dailyPickReason}>{dailyPick.reason}</Text>
              </View>
              <TouchableOpacity style={styles.heartBtn} activeOpacity={0.7}>
                {/* <Heart /> */}
                <Text style={styles.heartIcon}>❤️</Text>
              </TouchableOpacity>
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

        {/* Daily Festival Tip Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Text style={{ fontSize: 20 }}>🎉</Text> Daily Festival Tip</Text>
          <View style={[styles.festivalCard, { backgroundColor: '#FEF9C3' }] }>
            <View style={styles.festivalCardContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={styles.festivalEmoji}>🥮</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.festivalTitle}>It's Mid-Autumn Festival!</Text>
                  <Text style={styles.festivalDesc}>Try traditional mooncakes with tea</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.infoBtn} activeOpacity={0.7}>
                {/* <Info /> */}
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoBtnText}>What's this?</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  characterCard: { width: '48%', height: 110, borderRadius: 24, borderWidth: 2, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, padding: 8 },
  characterEmoji: { fontSize: 32, marginBottom: 2 },
  characterName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginTop: 2 },
  characterRole: { fontSize: 12, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  selectedDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FB7185', alignSelf: 'center', marginTop: 6 },
  dailyPickCard: { backgroundColor: '#FFF', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, marginBottom: 8 },
  dailyPickCardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  dailyPickEmoji: { fontSize: 36, marginRight: 12 },
  dailyPickDish: { fontSize: 17, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  dailyPickReason: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  heartBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.4)' },
  heartIcon: { fontSize: 20, color: '#FB7185' },
  quickActionsRow: { flexDirection: 'row', marginTop: 4 },
  quickActionButton: { borderRadius: 24, paddingVertical: 16, paddingHorizontal: 18, alignItems: 'center', marginRight: 12, minWidth: 85, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6, elevation: 2 },
  quickActionEmoji: { fontSize: 28, marginBottom: 4 },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: '#374151', textAlign: 'center' },
  festivalCard: { backgroundColor: '#FEF9C3', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, marginBottom: 8 },
  festivalCardContent: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  festivalEmoji: { fontSize: 28, marginRight: 12 },
  festivalTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  festivalDesc: { fontSize: 13, color: '#6B7280' },
  infoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12, marginLeft: 12 },
  infoIcon: { fontSize: 16, marginRight: 4 },
  infoBtnText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
}); 