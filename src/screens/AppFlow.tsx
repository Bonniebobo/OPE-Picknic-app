import React, { useState, useCallback } from 'react';
import WelcomeScreen from './WelcomeScreen';
import EatingPreferenceScreen from './EatingPreferenceScreen';
import MainApp from './MainApp';
import Onboarding from './Onboarding';
import CuisinePreferenceScreen from './CuisinePreferenceScreen';

type FlowStep = 'welcome' | 'onboarding' | 'cuisine-preference' | 'eating-preference' | 'main-app';

export default function AppFlowV3() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [eatingPreference, setEatingPreference] = useState<string>('unsure');
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  
  const handleWelcomeComplete = useCallback(() => {
    setCurrentStep('onboarding');
  }, []);
  
  const handleOnboardingComplete = useCallback(() => {
    setCurrentStep('cuisine-preference');
  }, []);
  
  const handleCuisinePreferenceComplete = useCallback((selectedCuisines: string[]) => {
    setCuisinePreferences(selectedCuisines);
    setCurrentStep('eating-preference');
  }, []);
  
  const handleEatingPreferenceComplete = useCallback((preference: string) => {
    setEatingPreference(preference);
    setCurrentStep('main-app');
  }, []);
  
  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    case 'onboarding':
      return <Onboarding onComplete={handleOnboardingComplete} />;
    case 'cuisine-preference':
      return <CuisinePreferenceScreen onComplete={handleCuisinePreferenceComplete} />;
    case 'eating-preference':
      return <EatingPreferenceScreen onComplete={handleEatingPreferenceComplete} />;
    case 'main-app':
      return <MainApp eatingPreference={eatingPreference} cuisinePreferences={cuisinePreferences} />;
    default:
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }
} 