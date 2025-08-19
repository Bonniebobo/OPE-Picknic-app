import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// Placeholder: can be replaced with custom component later
// import { PicknicMascot } from '../components/PicknicMascot';
// import { ArrowRight } from '../components/ArrowRight';
// import { Check } from '../components/Check';

interface Option {
  id: string;
  text: string;
  emoji: string;
  color: string;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'single' | 'multi';
  options: Option[];
  headerEmoji: string;
}

const questions: Question[] = [
  {
    id: 'eating-preference',
    title: "What's your diet?",
    subtitle: 'Help us suggest better meals',
    type: 'single',
    headerEmoji: '🍽️',
    options: [
      { id: 'vegetarian', text: 'Vegetarian', emoji: '🥗', color: '#D1FAE5' },
      { id: 'vegan', text: 'Vegan', emoji: '🌱', color: '#A7F3D0' },
      { id: 'omnivore', text: 'Omnivore', emoji: '🍖', color: '#FED7AA' },
      { id: 'not-sure', text: 'Not sure', emoji: '❓', color: '#DDD6FE' },
    ],
  },
  {
    id: 'foods-to-avoid',
    title: 'Any foods to avoid?',
    subtitle: "We'll skip these in recommendations",
    type: 'multi',
    headerEmoji: '🚫',
    options: [
      { id: 'spicy', text: 'Spicy food', emoji: '🌶️', color: '#FECACA' },
      { id: 'seafood', text: 'Seafood', emoji: '🐟', color: '#BFDBFE' },
      { id: 'onion-garlic', text: 'Onion / Garlic', emoji: '🧄', color: '#FEF3C7' },
      { id: 'organ-meats', text: 'Organ meats', emoji: '🐷', color: '#FBCFE8' },
      { id: 'none', text: 'None', emoji: '🚫', color: '#E5E7EB' },
    ],
  },
  {
    id: 'allergies',
    title: 'Any food allergies?',
    subtitle: 'Keep you safe with recommendations',
    type: 'multi',
    headerEmoji: '⚠️',
    options: [
      { id: 'peanuts', text: 'Peanuts', emoji: '🥜', color: '#FDE68A' },
      { id: 'dairy', text: 'Dairy', emoji: '🥛', color: '#BFDBFE' },
      { id: 'gluten', text: 'Gluten', emoji: '🍞', color: '#FEF3C7' },
      { id: 'eggs', text: 'Eggs', emoji: '🥚', color: '#FED7AA' },
      { id: 'no-allergies', text: 'No allergies', emoji: '✅', color: '#D1FAE5' },
    ],
  },
];

interface PicknicOnboardingProps {
  onComplete?: (preference: string) => void;
}

export default function Onboarding({ onComplete }: PicknicOnboardingProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const canContinue = selectedOptions.length > 0;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOptions([]);
    } else {
      onComplete?.('onboarding-complete');
    }
  };

  const handleSkip = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      if (onComplete) {
        onComplete('onboarding-skipped');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      const prevQuestion = questions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id];
      if (prevAnswer) {
        setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : [prevAnswer]);
      } else {
        setSelectedOptions([]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          {/* <PicknicMascot /> */}
          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{currentStep + 1} of {questions.length}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {/* Question */}
              <View style={styles.questionHeader}>
                <Text style={styles.headerEmoji}>{currentQuestion.headerEmoji}</Text>
                <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
                <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>
              </View>
              {/* Options */}
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => {
                      if (currentQuestion.type === 'single') {
                        setSelectedOptions([option.id]);
                      } else {
                        if (option.id === 'none' || option.id === 'no-allergies') {
                          setSelectedOptions([option.id]);
                        } else {
                          const filteredOptions = selectedOptions.filter((id) => id !== 'none' && id !== 'no-allergies');
                          if (selectedOptions.includes(option.id)) {
                            setSelectedOptions(filteredOptions.filter((id) => id !== option.id));
                          } else {
                            setSelectedOptions([...filteredOptions, option.id]);
                          }
                        }
                      }
                    }}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected ? option.color : 'rgba(255,255,255,0.95)',
                        borderColor: isSelected ? '#FB7185' : 'rgba(229, 231, 235, 0.8)',
                        transform: [{ scale: isSelected ? 1.02 : 1 }],
                        shadowOpacity: isSelected ? 0.15 : 0.08,
                        shadowColor: isSelected ? '#FB7185' : '#000',
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.optionRow}>
                      <View style={[styles.optionEmojiBox, { backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(243, 244, 246, 0.8)' }] }>
                        <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      </View>
                      <Text style={styles.optionLabel}>{option.text}</Text>
                      {isSelected && (
                        <View style={styles.selectedIndicatorOuter}>
                          <View style={styles.selectedIndicatorInner} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
              {currentQuestion.type === 'multi' && (
                <Text style={styles.multiHint}>Select multiple if needed</Text>
              )}
            </View>
          </View>
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNavRow}>
            {/* Left: Back Button */}
            <View style={styles.navButtonContainer}>
              {currentStep > 0 ? (
                <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
                  <Text style={styles.backButtonText} numberOfLines={1}>Back</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.navButtonPlaceholder} />
              )}
            </View>

            {/* Center: Continue Button */}
            <View style={styles.continueButtonContainer}>
              <TouchableOpacity
                style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
                onPress={handleNext}
                disabled={!canContinue}
                activeOpacity={0.9}
              >
                <Text style={[styles.continueButtonText, !canContinue && styles.continueButtonTextDisabled]}>
                  {currentStep === questions.length - 1 ? 'Done!' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right: Skip Button */}
            <View style={styles.navButtonContainer}>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.8}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 12,
    width: '100%',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FB7185',
    borderRadius: 4,
  },
  mainContent: {
    paddingHorizontal: 24,
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 42,
    marginBottom: 12,
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  questionSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  optionButton: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 10,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
  multiHint: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  // Bottom Navigation Styles
  bottomNavContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFF7ED',
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  navButtonPlaceholder: {
    width: 100,
    height: 48,
  },
  
  // Back Button
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Continue Button
  continueButtonContainer: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  continueButton: {
    backgroundColor: '#FB7185',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 140,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
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
  
  // Skip Button
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 