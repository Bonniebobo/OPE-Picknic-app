import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
// 占位：后续可替换为自定义组件
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
      console.log('Continue pressed, selected:', selectedOption);
      onComplete(selectedOption);
    }
  };

  const handleSkip = () => {
    console.log('Skip pressed');
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
                        backgroundColor: isSelected ? option.selectedBg : option.background,
                        borderColor: isSelected ? option.border : 'transparent',
                        transform: [{ scale: isSelected ? 1.02 : 1 }],
                        shadowOpacity: isSelected ? 0.18 : 0.12,
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.optionRow}>
                      <View
                        style={[
                          styles.optionEmojiBox,
                          { backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)' },
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
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionEmojiBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: 'linear-gradient(45deg, #FB7185, #FDBA74)', // 可用渐变色库替换
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
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
}); 