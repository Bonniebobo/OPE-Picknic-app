"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, MapPin, Upload, Dice6, Users } from "lucide-react"
import PicknicResultsScreen from "./picknic-results-screen"

interface BotInteractionScreenProps {
  botId: string
  eatingPreference: string
  onBack: () => void
}

const botData = {
  "mood-matcher": {
    name: "Mood Matcher",
    emoji: "🩷",
    background: "bg-pink-100",
    description: "I understand your emotions and give comforting food suggestions",
    options: [
      {
        id: "select-mood",
        title: "Tell me your mood",
        description: "Select how you're feeling right now",
        icon: "😊",
        background: "bg-pink-50",
      },
      {
        id: "upload-selfie",
        title: "Upload a selfie",
        description: "I'll detect your mood from your expression",
        icon: "📸",
        background: "bg-pink-50",
      },
    ],
  },
  "experienced-explorer": {
    name: "Experienced Explorer",
    emoji: "🌍",
    background: "bg-green-100",
    description: "A wise culinary adventurer who knows hidden gems around the world",
    options: [
      {
        id: "share-location",
        title: "Share your location",
        description: "Discover authentic restaurants nearby",
        icon: "📍",
        background: "bg-green-50",
      },
      {
        id: "upload-scene",
        title: "Upload scene photo",
        description: "I'll suggest local cuisine from your photo",
        icon: "🏞️",
        background: "bg-green-50",
      },
      {
        id: "explore-flavors",
        title: "Explore new flavors",
        description: "Try untried flavor profiles and cuisines",
        icon: "🌶️",
        background: "bg-green-50",
      },
    ],
  },
  "recipe-helper": {
    name: "Recipe Helper",
    emoji: "🥕",
    background: "bg-orange-100",
    description: "Your caring kitchen companion who helps you decide what to cook",
    options: [
      {
        id: "select-ingredients",
        title: "Choose ingredients",
        description: "Select what you have or want to use",
        icon: "🥬",
        background: "bg-orange-50",
      },
      {
        id: "photo-fridge",
        title: "Photo your fridge",
        description: "I'll extract ingredients from your photo",
        icon: "📷",
        background: "bg-orange-50",
      },
    ],
  },
  "play-mode-bot": {
    name: "Play Mode Bot",
    emoji: "🎮",
    background: "bg-purple-100",
    description: "A fun, playful bot that helps you choose food through interactive games",
    options: [
      {
        id: "spin-wheel",
        title: "Spin the wheel",
        description: "Let the wheel decide your meal",
        icon: "🎡",
        background: "bg-purple-50",
      },
      {
        id: "this-or-that",
        title: "This or That",
        description: "Quick elimination game to find your pick",
        icon: "⚖️",
        background: "bg-purple-50",
      },
      {
        id: "play-with-friend",
        title: "Play with a friend",
        description: "Multiplayer voting game",
        icon: "👥",
        background: "bg-purple-50",
      },
    ],
  },
}

export default function BotInteractionScreen({ botId, eatingPreference, onBack }: BotInteractionScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showPicknicResults, setShowPicknicResults] = useState(false)
  const [userContext, setUserContext] = useState<any>(null)

  const bot = botData[botId as keyof typeof botData]

  if (!bot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Bot not found</p>
      </div>
    )
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    console.log("Selected option:", optionId, "for bot:", botId)

    // Simulate collecting user context based on the option
    const mockContext = {
      "select-mood": "cozy",
      "upload-selfie": "happy",
      "share-location": "downtown",
      "upload-scene": "local_market",
      "explore-flavors": "spicy",
      "select-ingredients": ["tomato", "basil", "cheese"],
      "photo-fridge": ["eggs", "milk", "vegetables"],
    }

    setUserContext(mockContext[optionId as keyof typeof mockContext])
  }

  const handleHavePicknic = () => {
    console.log("Have a Picknic clicked for bot:", botId)
    setShowPicknicResults(true)
  }

  const handleBackFromPicknic = () => {
    setShowPicknicResults(false)
  }

  // Show Picknic Results screen
  if (showPicknicResults) {
    return (
      <PicknicResultsScreen
        botId={botId}
        eatingPreference={eatingPreference}
        onBack={handleBackFromPicknic}
        userContext={userContext}
      />
    )
  }

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "📸":
      case "📷":
        return <Camera className="w-8 h-8 text-gray-600" />
      case "📍":
        return <MapPin className="w-8 h-8 text-gray-600" />
      case "🏞️":
        return <Upload className="w-8 h-8 text-gray-600" />
      case "🎡":
        return <Dice6 className="w-8 h-8 text-gray-600" />
      case "👥":
        return <Users className="w-8 h-8 text-gray-600" />
      default:
        return <span className="text-4xl">{iconType}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-xl hover:bg-white/40">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Back to Home</h1>
          </div>

          {/* Bot Header */}
          <Card className={`${bot.background} border-0 shadow-lg rounded-3xl overflow-hidden mb-6`}>
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">{bot.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{bot.name}</h2>
              <p className="text-base text-gray-600 font-medium">{bot.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Interaction Options */}
        <div className="flex-1 px-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How would you like to start?</h3>

          <div className="space-y-4">
            {bot.options.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                  selectedOption === option.id
                    ? "scale-102 shadow-xl ring-2 ring-gray-300"
                    : "shadow-lg hover:shadow-xl"
                } ${option.background} border-0 rounded-3xl overflow-hidden`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center shadow-sm">
                      {getIconComponent(option.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{option.title}</h4>
                      <p className="text-sm text-gray-600 font-medium">{option.description}</p>
                    </div>
                    {selectedOption === option.id && (
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Have a Picknic Button */}
          <div className="mt-8 mb-8">
            <Button
              onClick={handleHavePicknic}
              className="w-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white rounded-3xl py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              🧺 Have a Picknic
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
