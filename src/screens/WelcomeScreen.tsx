import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const characters = [
  {
    id: 'buzzy-bunny',
    name: 'Buzzy',
    emoji: '🐰',
    background: '#FCE7F3', // bg-pink-100
    accent: '#FBCFE8', // bg-pink-200
    tag: '🧠 Mood Matcher',
    icon: '🧠',
  },
  {
    id: 'luma-cat',
    name: 'Luma',
    emoji: '🐱',
    background: '#DCFCE7', // bg-green-100
    accent: '#BBF7D0', // bg-green-200
    tag: '🍳 Smart Chef',
    icon: '🍳',
  },
  {
    id: 'foxy',
    name: 'Foxy',
    emoji: '🦊',
    background: '#F3E8FF', // bg-purple-100
    accent: '#E9D5FF', // bg-purple-200
    tag: '🎲 Game Explorer',
    icon: '🎲',
  },
  {
    id: 'truffina-dog',
    name: 'Truffina',
    emoji: '🐶',
    background: '#FFEDD5', // bg-orange-100
    accent: '#FED7AA', // bg-orange-200
    tag: '🗺️ Adventure Guide',
    icon: '🗺️',
  },
];

interface PicknicWelcomeProps {
  onComplete?: () => void;
}

export default function WelcomeScreen({ onComplete }: PicknicWelcomeProps) {
  const handleBegin = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.mascotPlaceholder}>
            {/* <PicknicMascot /> */}
            <Text style={{ fontSize: 48 }}>🧺</Text>
          </View>
          <Text style={styles.emoji}>🧺</Text>
          <Text style={styles.title}>Welcome to Picknic!</Text>
          <Text style={styles.subtitle}>Meet your AI food companions</Text>
        </View>

        {/* Characters Section */}
        <View style={styles.charactersSection}>
          <View style={styles.charactersGrid}>
            {characters.map((character) => (
              <View key={character.id} style={[styles.card, { backgroundColor: '#fff' }]}> {/* Card */}
                <View style={styles.cardContent}>
                  <View style={[styles.avatar, { backgroundColor: character.background }]}> {/* Avatar */}
                    <Text style={styles.avatarEmoji}>{character.emoji}</Text>
                  </View>
                  <Text style={styles.characterName}>{character.name}</Text>
                  <View style={[styles.tag, { backgroundColor: character.accent }]}> {/* Tag */}
                    <Text style={styles.tagIcon}>{character.icon}</Text>
                    <Text style={styles.tagText}>{character.tag.split(' ').slice(1).join(' ')}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleBegin}>
            <Text style={styles.ctaButtonText}>Let's Begin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Setup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7ED', // 渐变色可后续用LinearGradient实现
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  mascotPlaceholder: {
    marginBottom: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  charactersSection: {
    paddingHorizontal: 24,
    flex: 1,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    width: '47%',
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  bottomNav: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  ctaButton: {
    backgroundColor: '#FB7185',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'flex-end',
  },
  skipButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 