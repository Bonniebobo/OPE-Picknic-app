"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const eatingOptions = [
  {
    id: "cook",
    label: "Cook",
    emoji: "🍳",
    background: "bg-orange-100",
    selectedBg: "bg-orange-200",
    border: "border-orange-300",
    description: "Whip up something delicious at home",
  },
  {
    id: "delivery",
    label: "Delivery",
    emoji: "🛵",
    background: "bg-blue-100",
    selectedBg: "bg-blue-200",
    border: "border-blue-300",
    description: "Get your favorites delivered to you",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    emoji: "🍽️",
    background: "bg-purple-100",
    selectedBg: "bg-purple-200",
    border: "border-purple-300",
    description: "Discover a great place to dine out",
  },
  {
    id: "unsure",
    label: "Unsure Yet",
    emoji: "🤔",
    background: "bg-gray-100",
    selectedBg: "bg-gray-200",
    border: "border-gray-300",
    description: "Let me explore all my options",
  },
]

interface EatingPreferenceScreenProps {
  onComplete: (preference: string) => void
}

export default function EatingPreferenceScreen({ onComplete }: EatingPreferenceScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleContinue = () => {
    if (selectedOption) {
      onComplete(selectedOption)
    }
  }

  const handleSkip = () => {
    onComplete("unsure")
  }

  const canContinue = selectedOption !== null

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* iPhone safe area container */}
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* Header with safe area */}
        <div className="pt-16 pb-8 px-6">
          <div className="text-center">
            {/* Character Icon */}
            <div className="text-6xl mb-6">🐰</div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">How would you like to eat today?</h1>
            <p className="text-lg text-gray-600 font-medium">
              Choose your dining style and let's find the perfect meal for you!
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl mb-8">
            <CardContent className="p-6">
              {/* Eating Options */}
              <div className="space-y-4">
                {eatingOptions.map((option) => {
                  const isSelected = selectedOption === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 transform active:scale-95 ${
                        isSelected
                          ? `${option.selectedBg} ${option.border} scale-[1.02] shadow-lg`
                          : `${option.background} border-transparent hover:scale-[1.01] shadow-md hover:shadow-lg`
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Emoji Icon */}
                        <div
                          className={`flex items-center justify-center w-16 h-16 rounded-2xl ${
                            isSelected ? "bg-white/70" : "bg-white/50"
                          } shadow-sm`}
                        >
                          <span className="text-3xl">{option.emoji}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{option.label}</h3>
                          <p className="text-sm text-gray-600 font-medium">{option.description}</p>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom navigation with safe area */}
        <div className="px-6 pb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Skip Button */}
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 hover:bg-white/40 rounded-2xl px-4 py-3 font-medium"
            >
              Skip
            </Button>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`rounded-2xl px-8 py-3 font-bold shadow-lg transition-all duration-200 ${
                canContinue
                  ? "bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Let's Go!
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
