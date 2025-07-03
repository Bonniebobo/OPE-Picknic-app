import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import EatingPreferenceScreen from './EatingPreferenceScreen';
import MainApp from './MainApp';
import Onboarding from './Onboarding';

type FlowStep = 'welcome' | 'onboarding' | 'eating-preference' | 'main-app';

export default function AppFlow() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [eatingPreference, setEatingPreference] = useState<string>('unsure');

  const handleOnboardingComplete = (preference: string) => {
    setEatingPreference(preference);
    setCurrentStep('eating-preference');
  };

  const handleWelcomeComplete = () => {
    setCurrentStep('onboarding');
  };

  const handleEatingPreferenceComplete = (preference: string) => {
    setEatingPreference(preference);
    setCurrentStep('main-app');
  };

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