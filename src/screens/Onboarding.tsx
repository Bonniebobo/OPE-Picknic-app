import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import EatingPreferenceScreen from './EatingPreferenceScreen';
// 占位：后续可替换为自定义组件
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
}

const questions: Question[] = [
  {
    id: 'eating-preference',
    title: "What's your usual eating preference?",
    subtitle: 'Help us understand your dietary style so we can suggest the perfect meals! 🍽️',
    type: 'single',
    options: [
      { id: 'vegetarian', text: 'Vegetarian', emoji: '🥗', color: '#D1FAE5' },
      { id: 'vegan', text: 'Vegan', emoji: '🌱', color: '#A7F3D0' },
      { id: 'omnivore', text: 'Omnivore', emoji: '🍖', color: '#FED7AA' },
      { id: 'not-sure', text: 'Not sure', emoji: '❓', color: '#DDD6FE' },
    ],
  },
  {
    id: 'foods-to-avoid',
    title: 'Are there any foods you dislike or want to avoid?',
    subtitle: "Select all that apply - we'll make sure to skip these in your recommendations! 🚫",
    type: 'multi',
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
    title: 'Do you have any food allergies we should know about?',
    subtitle: 'Your safety is our priority! Select any allergies you have so we can keep you safe 🛡️',
    type: 'multi',
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
  const [showEatingPreference, setShowEatingPreference] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const canContinue = selectedOptions.length > 0;

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      // Multi-select logic
      if (optionId === 'none' || optionId === 'no-allergies') {
        setSelectedOptions([optionId]);
      } else {
        const filteredOptions = selectedOptions.filter((id) => id !== 'none' && id !== 'no-allergies');
        if (selectedOptions.includes(optionId)) {
          setSelectedOptions(filteredOptions.filter((id) => id !== optionId));
        } else {
          setSelectedOptions([...filteredOptions, optionId]);
        }
      }
    }
  };

  const handleNext = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.type === 'single' ? selectedOptions[0] : selectedOptions,
    }));
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      setShowEatingPreference(true);
    }
  };

  const handleSkip = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      setShowEatingPreference(true);
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

  const handleEatingPreferenceComplete = (preference: string) => {
    if (onComplete) {
      onComplete(preference);
    }
  };

  if (showEatingPreference) {
    return <EatingPreferenceScreen onComplete={handleEatingPreferenceComplete} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          {/* <PicknicMascot /> */}
          <Text style={{ fontSize: 48 }}>🧺</Text>
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
                <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
                <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>
              </View>
              {/* Options */}
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleOptionSelect(option.id)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected ? option.color : '#fff',
                        borderColor: isSelected ? '#FB7185' : '#E5E7EB',
                        transform: [{ scale: isSelected ? 1.02 : 1 }],
                        shadowOpacity: isSelected ? 0.18 : 0.12,
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.optionRow}>
                      <View style={[styles.optionEmojiBox, { backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : '#F3F4F6' }] }>
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
                <Text style={styles.multiHint}>You can select multiple options</Text>
              )}
            </View>
          </View>
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomNavRow}>
          {currentStep > 0 ? (
            <TouchableOpacity style={styles.skipButton} onPress={handleBack}>
              <Text style={styles.skipButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleNext}
            disabled={!canContinue}
          >
            <Text style={[styles.continueButtonText, !canContinue && styles.continueButtonTextDisabled]}>
              {currentStep === questions.length - 1 ? 'Almost Done! 🎉' : 'Continue'}
            </Text>
            {/* <ArrowRight /> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
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
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
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
  questionHeader: {
    alignItems: 'center',
    marginBottom: 16,
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
  },
  optionButton: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
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
    width: 48,
    height: 48,
    borderRadius: 12,
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
    fontSize: 22,
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
    marginTop: 8,
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
    paddingHorizontal: 24,
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