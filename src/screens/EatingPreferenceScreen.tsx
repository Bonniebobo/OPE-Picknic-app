import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
// Placeholder: can be replaced with custom component later
// import { ArrowRight } from '../components/ArrowRight';

const eatingOptions = [
  {
    id: 'cook',
    label: 'Cook',
    emoji: '🍳',
    background: '#FFEDD5', // bg-orange-100
    selectedBg: '#FED7AA', // bg-orange-200
    border: '#FDBA74', // border-orange-300
    description: 'Whip up something delicious at home',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    emoji: '🛵',
    background: '#DBEAFE', // bg-blue-100
    selectedBg: '#BFDBFE', // bg-blue-200
    border: '#93C5FD', // border-blue-300
    description: 'Get your favorites delivered to you',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    emoji: '🍽️',
    background: '#F3E8FF', // bg-purple-100
    selectedBg: '#E9D5FF', // bg-purple-200
    border: '#D8B4FE', // border-purple-300
    description: 'Discover a great place to dine out',
  },
  {
    id: 'unsure',
    label: 'Unsure Yet',
    emoji: '🤔',
    background: '#F3F4F6', // bg-gray-100
    selectedBg: '#E5E7EB', // bg-gray-200
    border: '#D1D5DB', // border-gray-300
    description: 'Let me explore all my options',
  },
];

interface EatingPreferenceScreenProps {
  onComplete: (preference: string) => void;
}

export default function EatingPreferenceScreen({ onComplete }: EatingPreferenceScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    if (selectedOption) {
      onComplete(selectedOption);
    }
  };

  const handleSkip = () => {
    onComplete('unsure');
  };

  const canContinue = selectedOption !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🐰</Text>
          <Text style={styles.title}>How would you like to eat today?</Text>
          <Text style={styles.subtitle}>
            Choose your dining style and let's find the perfect meal for you!
          </Text>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {eatingOptions.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleOptionSelect(option.id)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected ? option.selectedBg : 'rgba(255,255,255,0.95)',
                        borderColor: isSelected ? '#FB7185' : 'rgba(229, 231, 235, 0.8)',
                        transform: [{ scale: isSelected ? 1.02 : 1 }],
                        shadowOpacity: isSelected ? 0.15 : 0.08,
                        shadowColor: isSelected ? '#FB7185' : '#000',
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.optionRow}>
                      <View
                        style={[
                          styles.optionEmojiBox,
                          { backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(243, 244, 246, 0.8)' },
                        ]}
                      >
                        <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      </View>
                      <View style={styles.optionContent}>
                        <Text style={styles.optionLabel}>{option.label}</Text>
                        <Text style={styles.optionDesc}>{option.description}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedIndicatorOuter}>
                          <View style={styles.selectedIndicatorInner} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomNavRow}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={[styles.continueButtonText, !canContinue && styles.continueButtonTextDisabled]}>Let's Go!</Text>
            {/* <ArrowRight /> */}
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
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  mainContent: {
    paddingHorizontal: 24,
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  optionButton: {
    width: '100%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionEmojiBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedIndicatorOuter: {
    width: 24,
    height: 24,
    backgroundColor: '#FB7185',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicatorInner: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  skipButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#FB7185',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 140,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
}); 