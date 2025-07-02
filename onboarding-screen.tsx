"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { PicknicMascot } from "./mascot"

interface PicknicOnboardingProps {
  onComplete?: (preference: string) => void
}

export default function PicknicOnboarding({ onComplete }: PicknicOnboardingProps = {}) {
  const [preference, setPreference] = useState<string>("unsure")

  const handleComplete = () => {
    if (onComplete) {
      onComplete(preference)
    }
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

            <div className="text-4xl mb-4">🚀</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Onboarding</h1>
            <p className="text-lg text-gray-600 font-medium">Let's get you set up!</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl mb-8">
            <CardContent className="p-6">
              <p>Onboarding content goes here.</p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="px-6 pb-8">
          <div className="space-y-4">
            {/* Main CTA Button */}
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white rounded-3xl py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
