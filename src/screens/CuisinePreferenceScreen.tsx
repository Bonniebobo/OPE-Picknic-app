import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

interface CuisineOption {
  id: string;
  emoji: string;
  title: string;
  regions: string;
}

const cuisineOptions: CuisineOption[] = [
  {
    id: 'spicy',
    emoji: '🍜',
    title: 'Spicy & Bold',
    regions: 'India, Thailand, Sichuan',
  },
  {
    id: 'light',
    emoji: '🥗',
    title: 'Light & Fresh',
    regions: 'Japan, Vietnam, Mediterranean',
  },
  {
    id: 'hearty',
    emoji: '🍖',
    title: 'Hearty & Savory',
    regions: 'America, Korea, Germany',
  },
  {
    id: 'plant',
    emoji: '🥦',
    title: 'Plant-based',
    regions: 'California, Mediterranean',
  },
  {
    id: 'sweet',
    emoji: '🍰',
    title: 'Sweet & Comforting',
    regions: 'France, Hong Kong, USA',
  },
];

interface CuisinePreferenceScreenProps {
  onComplete: (selectedCuisines: string[]) => void;
  onSkip?: () => void;
}

export default function CuisinePreferenceScreen({ onComplete, onSkip }: CuisinePreferenceScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    onComplete(selected);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    else onComplete([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🍽️</Text>
          <Text style={styles.title}>What cuisines do you enjoy?</Text>
          <Text style={styles.subtitle}>
            Select all the cuisine styles you like. This helps us personalize your recommendations!
          </Text>
        </View>

        {/* Options */}
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {cuisineOptions.map((option) => {
                const isSelected = selected.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => toggleSelect(option.id)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected ? '#FDE68A' : 'rgba(255,255,255,0.95)',
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
                        <Text style={styles.optionLabel}>{option.title}</Text>
                        <Text style={styles.optionDesc}>{option.regions}</Text>
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
            style={[styles.continueButton, selected.length === 0 && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={selected.length === 0}
          >
            <Text style={[styles.continueButtonText, selected.length === 0 && styles.continueButtonTextDisabled]}>Continue</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  optionEmojiBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  optionDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedIndicatorOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FB7185',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  selectedIndicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bottomNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
    marginTop: 8,
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
    backgroundColor: '#F3F4F6',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  continueButtonTextDisabled: {
    color: '#BDBDBD',
  },
}); 