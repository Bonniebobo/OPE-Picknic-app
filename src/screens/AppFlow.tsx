import React, { useState, useCallback } from 'react';
import WelcomeScreen from './WelcomeScreen';
import EatingPreferenceScreen from './EatingPreferenceScreen';
import MainApp from './MainApp';
import Onboarding from './Onboarding';

type FlowStep = 'welcome' | 'onboarding' | 'eating-preference' | 'main-app';

export default function AppFlowV3() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [eatingPreference, setEatingPreference] = useState<string>('unsure');
  
  const handleWelcomeComplete = useCallback(() => {
    setCurrentStep('onboarding');
  }, []);
  
  const handleOnboardingComplete = useCallback((preference: string) => {
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
    case 'eating-preference':
      return <EatingPreferenceScreen onComplete={handleEatingPreferenceComplete} />;
    case 'main-app':
      return <MainApp eatingPreference={eatingPreference} />;
    default:
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }
} 