import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const features = [
  {
    id: 'mood-matcher',
    name: 'Mood Matcher',
    emoji: '🩷',
    description: 'Discover meals based on your current emotion and facial expressions',
    background: '#FCE7F3',
    accent: '#FBCFE8',
    border: '#F9A8D4',
    icon: '🧠',
  },
  {
    id: 'recipe-helper',
    name: 'Recipe Helper',
    emoji: '🥕',
    description: 'Upload food photos or select ingredients to get AI-generated recipes',
    background: '#FFEDD5',
    accent: '#FED7AA',
    border: '#FDBA74',
    icon: '🍳',
  },
  {
    id: 'experienced-explorer',
    name: 'Experienced Explorer',
    emoji: '🌍',
    description: 'Explore curated food suggestions based on your habits, mood, time, and location',
    background: '#DCFCE7',
    accent: '#BBF7D0',
    border: '#86EFAC',
    icon: '🗺️',
  },
  {
    id: 'play-mode-bot',
    name: 'Play Mode Bot',
    emoji: '🎮',
    description: 'Enjoy relaxing, food-themed mini games to unwind and explore',
    background: '#F3E8FF',
    accent: '#E9D5FF',
    border: '#D8B4FE',
    icon: '🎲',
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
          <Text style={styles.emoji}>🧺</Text>
          <Text style={styles.title}>Welcome to Picknic!</Text>
          <Text style={styles.subtitle}>Your AI-powered food companion</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Discover our core features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <View key={feature.id} style={[styles.featureCard, { backgroundColor: feature.background }]}>
                <View style={styles.featureCardContent}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.accent }]}>
                    <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                  </View>
                  <Text style={styles.featureName}>{feature.name}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleBegin}>
            <Text style={styles.ctaButtonText}>Continue</Text>
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
    backgroundColor: '#FFF7ED',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
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
  featuresSection: {
    paddingHorizontal: 24,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureCard: {
    width: '47%',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
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
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 