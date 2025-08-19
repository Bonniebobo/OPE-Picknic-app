import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

interface PicknicOnboardingProps {
  onComplete?: (preference: string) => void;
}

export default function OnboardingScreen({ onComplete }: PicknicOnboardingProps = {}) {
  const [preference, setPreference] = useState<string>('unsure');

  const handleComplete = () => {
    if (onComplete) {
      onComplete(preference);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.mascotPlaceholder}>
            {/* <PicknicMascot /> */}
            <Text style={{ fontSize: 48 }}>🚀</Text>
          </View>
          <Text style={styles.title}>Onboarding</Text>
          <Text style={styles.subtitle}>Let's get you set up!</Text>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text>Onboarding content goes here.</Text>
            </View>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleComplete}>
            <Text style={styles.ctaButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7ED', // Can use LinearGradient for gradient colors later
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
    padding: 24,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 