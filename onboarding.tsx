"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Check } from "lucide-react"
import { PicknicMascot } from "./mascot"
import EatingPreferenceScreen from "./eating-preference-screen"

interface Option {
  id: string
  text: string
  emoji: string
  color: string
}

interface Question {
  id: string
  title: string
  subtitle: string
  type: "single" | "multi"
  options: Option[]
}

const questions: Question[] = [
  {
    id: "eating-preference",
    title: "What's your usual eating preference?",
    subtitle: "Help us understand your dietary style so we can suggest the perfect meals! 🍽️",
    type: "single",
    options: [
      {
        id: "vegetarian",
        text: "Vegetarian",
        emoji: "🥗",
        color: "bg-green-100 hover:bg-green-200 border-green-200",
      },
      {
        id: "vegan",
        text: "Vegan",
        emoji: "🌱",
        color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-200",
      },
      {
        id: "omnivore",
        text: "Omnivore",
        emoji: "🍖",
        color: "bg-orange-100 hover:bg-orange-200 border-orange-200",
      },
      {
        id: "not-sure",
        text: "Not sure",
        emoji: "❓",
        color: "bg-purple-100 hover:bg-purple-200 border-purple-200",
      },
    ],
  },
  {
    id: "foods-to-avoid",
    title: "Are there any foods you dislike or want to avoid?",
    subtitle: "Select all that apply - we'll make sure to skip these in your recommendations! 🚫",
    type: "multi",
    options: [
      {
        id: "spicy",
        text: "Spicy food",
        emoji: "🌶️",
        color: "bg-red-100 hover:bg-red-200 border-red-200",
      },
      {
        id: "seafood",
        text: "Seafood",
        emoji: "🐟",
        color: "bg-blue-100 hover:bg-blue-200 border-blue-200",
      },
      {
        id: "onion-garlic",
        text: "Onion / Garlic",
        emoji: "🧄",
        color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-200",
      },
      {
        id: "organ-meats",
        text: "Organ meats",
        emoji: "🐷",
        color: "bg-pink-100 hover:bg-pink-200 border-pink-200",
      },
      {
        id: "none",
        text: "None",
        emoji: "🚫",
        color: "bg-gray-100 hover:bg-gray-200 border-gray-200",
      },
    ],
  },
  {
    id: "allergies",
    title: "Do you have any food allergies we should know about?",
    subtitle: "Your safety is our priority! Select any allergies you have so we can keep you safe 🛡️",
    type: "multi",
    options: [
      {
        id: "peanuts",
        text: "Peanuts",
        emoji: "🥜",
        color: "bg-amber-100 hover:bg-amber-200 border-amber-200",
      },
      {
        id: "dairy",
        text: "Dairy",
        emoji: "🥛",
        color: "bg-blue-100 hover:bg-blue-200 border-blue-200",
      },
      {
        id: "gluten",
        text: "Gluten",
        emoji: "🍞",
        color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-200",
      },
      {
        id: "eggs",
        text: "Eggs",
        emoji: "🥚",
        color: "bg-orange-100 hover:bg-orange-200 border-orange-200",
      },
      {
        id: "no-allergies",
        text: "No allergies",
        emoji: "✅",
        color: "bg-green-100 hover:bg-green-200 border-green-200",
      },
    ],
  },
]

interface PicknicOnboardingProps {
  onComplete?: (preference: string) => void
}

export default function PicknicOnboarding({ onComplete }: PicknicOnboardingProps = {}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [showEatingPreference, setShowEatingPreference] = useState(false)

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const canContinue = selectedOptions.length > 0

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion.type === "single") {
      setSelectedOptions([optionId])
    } else {
      // Multi-select logic
      if (optionId === "none" || optionId === "no-allergies") {
        // If "None" or "No allergies" is selected, clear all others
        setSelectedOptions([optionId])
      } else {
        // Remove "None" or "No allergies" if selecting other options
        const filteredOptions = selectedOptions.filter((id) => id !== "none" && id !== "no-allergies")

        if (selectedOptions.includes(optionId)) {
          setSelectedOptions(filteredOptions.filter((id) => id !== optionId))
        } else {
          setSelectedOptions([...filteredOptions, optionId])
        }
      }
    }
  }

  const handleNext = () => {
    // Save current answers
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.type === "single" ? selectedOptions[0] : selectedOptions,
    }))

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOptions([])
    } else {
      // Handle completion - navigate to eating preference screen
      console.log("Onboarding completed:", { ...answers, [currentQuestion.id]: selectedOptions })
      setShowEatingPreference(true)
    }
  }

  const handleSkip = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOptions([])
    } else {
      // Handle completion - navigate to eating preference screen
      console.log("Onboarding completed:", answers)
      setShowEatingPreference(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      // Restore previous answers for the previous question
      const prevQuestion = questions[currentStep - 1]
      const prevAnswer = answers[prevQuestion.id]
      if (prevAnswer) {
        setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : [prevAnswer])
      } else {
        setSelectedOptions([])
      }
    }
  }

  const handleEatingPreferenceComplete = (preference: string) => {
    console.log("Eating preference selected:", preference)
    // Pass the preference back to the parent component
    if (onComplete) {
      onComplete(preference)
    }
  }

  // Show eating preference screen after onboarding completion
  if (showEatingPreference) {
    return <EatingPreferenceScreen onComplete={handleEatingPreferenceComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* iPhone safe area container */}
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* Header with safe area */}
        <div className="pt-12 pb-6 px-6">
          <div className="text-center mb-8">
            {/* Mascot Logo */}
            <PicknicMascot />

            {/* Progress */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-3">
                {currentStep + 1} of {questions.length}
              </div>
              <div className="w-full bg-white/60 rounded-full h-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-pink-400 to-orange-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl mb-6">
            <CardContent className="p-6">
              {/* Question */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">{currentQuestion.title}</h2>
                <p className="text-base text-gray-600 leading-relaxed">{currentQuestion.subtitle}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptions.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 transform active:scale-95 ${
                        isSelected
                          ? `${option.color} scale-[1.02] shadow-lg`
                          : "bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                            isSelected ? "bg-white/70" : "bg-gray-100"
                          }`}
                        >
                          <span className="text-2xl">{option.emoji}</span>
                        </div>
                        <span className="flex-1 text-left text-lg font-semibold text-gray-800">{option.text}</span>
                        {isSelected && (
                          <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Multi-select hint */}
              {currentQuestion.type === "multi" && (
                <p className="text-sm text-gray-500 text-center mt-4">You can select multiple options</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom navigation with safe area */}
        <div className="px-6 pb-8">
          <div className="flex items-center justify-between gap-4">
            {currentStep > 0 ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600 hover:bg-white/40 rounded-2xl px-4 py-3 font-medium"
              >
                Back
              </Button>
            ) : (
              <div /> // Empty div to maintain spacing
            )}

            <Button
              onClick={handleNext}
              disabled={!canContinue}
              className={`rounded-2xl px-6 py-3 font-bold shadow-lg transition-all duration-200 ${
                canContinue
                  ? "bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentStep === questions.length - 1 ? "Almost Done! 🎉" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 hover:bg-white/40 rounded-2xl px-4 py-3 font-medium"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
