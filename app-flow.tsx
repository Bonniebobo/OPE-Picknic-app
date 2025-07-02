"use client"

import { useState } from "react"
import PicknicWelcome from "./welcome-screen"
import EatingPreferenceScreen from "./eating-preference-screen"
import MainApp from "./main-app"
import PicknicOnboarding from "./onboarding-screen"

type FlowStep = "welcome" | "onboarding" | "eating-preference" | "main-app"

export default function AppFlow() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("welcome")
  const [eatingPreference, setEatingPreference] = useState<string>("unsure")

  const handleOnboardingComplete = (preference: string) => {
    setEatingPreference(preference)
    setCurrentStep("eating-preference")
  }

  const handleWelcomeComplete = () => {
    setCurrentStep("onboarding")
  }

  const handleEatingPreferenceComplete = (preference: string) => {
    setEatingPreference(preference)
    setCurrentStep("main-app")
  }

  switch (currentStep) {
    case "welcome":
      return <PicknicWelcome onComplete={handleWelcomeComplete} />
    case "onboarding":
      return <PicknicOnboarding onComplete={handleOnboardingComplete} />
    case "eating-preference":
      return <EatingPreferenceScreen onComplete={handleEatingPreferenceComplete} />
    case "main-app":
      return <MainApp eatingPreference={eatingPreference} />
    default:
      return <PicknicWelcome onComplete={handleWelcomeComplete} />
  }
}
