"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import PicknicOnboarding from "./onboarding"
import { PicknicMascot } from "./mascot"

const characters = [
  {
    id: "buzzy-bunny",
    name: "Buzzy",
    emoji: "🐰",
    background: "bg-pink-100",
    accent: "bg-pink-200",
    tag: "🧠 Mood Matcher",
    icon: "🧠",
  },
  {
    id: "luma-cat",
    name: "Luma",
    emoji: "🐱",
    background: "bg-green-100",
    accent: "bg-green-200",
    tag: "🍳 Smart Chef",
    icon: "🍳",
  },
  {
    id: "foxy",
    name: "Foxy",
    emoji: "🦊",
    background: "bg-purple-100",
    accent: "bg-purple-200",
    tag: "🎲 Game Explorer",
    icon: "🎲",
  },
  {
    id: "truffina-dog",
    name: "Truffina",
    emoji: "🐶",
    background: "bg-orange-100",
    accent: "bg-orange-200",
    tag: "🗺️ Festive Guide",
    icon: "🗺️",
  },
]

interface PicknicWelcomeProps {
  onComplete?: () => void
}

export default function PicknicWelcome({ onComplete }: PicknicWelcomeProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleBegin = () => {
    setShowOnboarding(true)
  }

  const handleSkip = () => {
    console.log("Skipping setup...")
    if (onComplete) {
      onComplete()
    }
  }

  if (showOnboarding) {
    return <PicknicOnboarding onComplete={onComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* iPhone safe area container */}
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* Header with safe area */}
        <div className="pt-16 pb-8 px-6">
          <div className="text-center">
            {/* Flat Cartoon Mascot */}
            <PicknicMascot />

            <div className="text-4xl mb-4">🧺</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Picknic!</h1>
            <p className="text-lg text-gray-600 font-medium">Meet your AI food companions</p>
          </div>
        </div>

        {/* Characters Section */}
        <div className="flex-1 px-6">
          <div className="grid grid-cols-2 gap-4 mb-12">
            {characters.map((character) => (
              <Card
                key={character.id}
                className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-5">
                  <div className="text-center">
                    {/* Character Avatar */}
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${character.background} mb-4 shadow-md`}
                    >
                      <span className="text-4xl">{character.emoji}</span>
                    </div>

                    {/* Character Name */}
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{character.name}</h3>

                    {/* Tag with Icon */}
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${character.accent} text-sm font-semibold text-gray-700`}
                    >
                      <span className="text-xs">{character.icon}</span>
                      <span>{character.tag.split(" ").slice(1).join(" ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-6 pb-8">
          <div className="space-y-4">
            {/* Main CTA Button */}
            <Button
              onClick={handleBegin}
              className="w-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white rounded-3xl py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Let's Begin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Skip Link */}
            <div className="flex justify-end">
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors duration-200"
              >
                Skip Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
