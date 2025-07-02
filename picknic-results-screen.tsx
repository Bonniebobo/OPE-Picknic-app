"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChefHat, Truck, UtensilsCrossed } from "lucide-react"

interface PicknicResultsScreenProps {
  botId: string
  eatingPreference: string
  onBack: () => void
  userContext?: any // Could include mood, ingredients, location, etc.
}

const diningModes = [
  {
    id: "cook",
    name: "Cook at Home",
    emoji: "🍳",
    icon: ChefHat,
    background: "bg-orange-100",
    accent: "bg-orange-200",
    border: "border-orange-300",
  },
  {
    id: "delivery",
    name: "Order Delivery",
    emoji: "🛵",
    icon: Truck,
    background: "bg-blue-100",
    accent: "bg-blue-200",
    border: "border-blue-300",
  },
  {
    id: "restaurant",
    name: "Go Out",
    emoji: "🍽️",
    icon: UtensilsCrossed,
    background: "bg-purple-100",
    accent: "bg-purple-200",
    border: "border-purple-300",
  },
]

const botContextData = {
  "mood-matcher": {
    name: "Mood Matcher",
    emoji: "🩷",
    background: "bg-pink-100",
    getSuggestions: (mood = "cozy") => ({
      cook: {
        dish: "Comforting Chicken Soup",
        description: "Perfect comfort dish to warm your heart on a quiet evening",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Matches your cozy mood",
      },
      delivery: {
        dish: "Thai Comfort Curry",
        description: "Soothing flavors delivered to your doorstep",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Gentle spices for emotional comfort",
      },
      restaurant: {
        dish: "Cozy Café Brunch",
        description: "Warm atmosphere perfect for your current mood",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Peaceful dining environment",
      },
    }),
  },
  "experienced-explorer": {
    name: "Experienced Explorer",
    emoji: "🌍",
    background: "bg-green-100",
    getSuggestions: (location = "local") => ({
      cook: {
        dish: "Authentic Sichuan Mapo Tofu",
        description: "Master this regional classic with traditional techniques",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Authentic cultural experience",
      },
      delivery: {
        dish: "Hidden Gem Dumplings",
        description: "Family-run restaurant with 30-year secret recipe",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Local culinary treasure",
      },
      restaurant: {
        dish: "Underground Ramen Bar",
        description: "Hidden local ramen gem in a quiet alley nearby",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Authentic neighborhood discovery",
      },
    }),
  },
  "recipe-helper": {
    name: "Recipe Helper",
    emoji: "🥕",
    background: "bg-orange-100",
    getSuggestions: (ingredients: string[] = ["tomato", "basil"]) => ({
      cook: {
        dish: "Fresh Tomato Basil Pasta",
        description: "Perfect use of your fresh ingredients in 20 minutes",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Uses your available ingredients",
      },
      delivery: {
        dish: "Italian Trattoria Special",
        description: "Similar flavors professionally prepared and delivered",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Matches your ingredient preferences",
      },
      restaurant: {
        dish: "Farm-to-Table Italian",
        description: "Restaurant specializing in fresh, seasonal ingredients",
        image: "/placeholder.svg?height=200&width=300",
        reason: "Celebrates fresh ingredients like yours",
      },
    }),
  },
}

export default function PicknicResultsScreen({
  botId,
  eatingPreference,
  onBack,
  userContext,
}: PicknicResultsScreenProps) {
  const [selectedMode, setSelectedMode] = useState<string>(eatingPreference || "")
  const [showModeSelector, setShowModeSelector] = useState(!eatingPreference || eatingPreference === "unsure")

  const botData = botContextData[botId as keyof typeof botContextData]

  if (!botData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Bot not found</p>
      </div>
    )
  }

  const suggestions = botData.getSuggestions(userContext)

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId)
    setShowModeSelector(false)
  }

  const handleSuggestionAction = (modeId: string, suggestion: any) => {
    console.log("Action for:", modeId, suggestion)
    // This would navigate to detailed view or booking/recipe page
  }

  const handleSwitchMode = () => {
    setShowModeSelector(true)
  }

  // If no mode selected, show mode selector
  if (showModeSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
        <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
          {/* Header */}
          <div className="pt-12 pb-6 px-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-xl hover:bg-white/40">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Choose Dining Mode</h1>
            </div>

            <Card className={`${botData.background} border-0 shadow-lg rounded-3xl overflow-hidden mb-6`}>
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{botData.emoji}</div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">{botData.name}</h2>
                <p className="text-sm text-gray-600">How would you like to enjoy your meal?</p>
              </CardContent>
            </Card>
          </div>

          {/* Mode Selection */}
          <div className="flex-1 px-6">
            <div className="space-y-4">
              {diningModes.map((mode) => (
                <Card
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-200 transform hover:scale-102 ${mode.background} border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl`}
                  onClick={() => handleModeSelect(mode.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center shadow-sm">
                        <mode.icon className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{mode.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {mode.id === "cook" && "Prepare something delicious at home"}
                          {mode.id === "delivery" && "Get your favorites delivered"}
                          {mode.id === "restaurant" && "Discover a great place to dine"}
                        </p>
                      </div>
                      <div className="text-3xl">{mode.emoji}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show suggestions for selected mode
  const currentMode = diningModes.find((mode) => mode.id === selectedMode)
  const currentSuggestions = Object.entries(suggestions).map(([key, value]) => ({
    modeId: key,
    ...value,
    mode: diningModes.find((m) => m.id === key),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-xl hover:bg-white/40">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Your Picknic Results</h1>
          </div>

          {/* Bot Context Header */}
          <Card className={`${botData.background} border-0 shadow-lg rounded-3xl overflow-hidden mb-4`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{botData.emoji}</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{botData.name} Suggestions</h2>
                    <p className="text-sm text-gray-600">Curated just for you</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSwitchMode}
                  className="text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-xl px-3 py-2"
                >
                  Switch Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Mode Indicator */}
          {currentMode && (
            <div className="flex items-center justify-center mb-4">
              <div className={`${currentMode.background} px-4 py-2 rounded-full flex items-center gap-2 shadow-sm`}>
                <currentMode.icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">{currentMode.name}</span>
                <span className="text-lg">{currentMode.emoji}</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="flex-1 px-6 pb-8">
          <div className="space-y-6">
            {currentSuggestions.map((suggestion) => (
              <Card
                key={suggestion.modeId}
                className={`${suggestion.mode?.background} border-0 shadow-xl rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-2xl transform hover:scale-102`}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 rounded-t-3xl overflow-hidden">
                    <img
                      src={suggestion.image || "/placeholder.svg"}
                      alt={suggestion.dish}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">{suggestion.mode?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{suggestion.dish}</h3>
                    <p className="text-base text-gray-600 font-medium mb-3 leading-relaxed">{suggestion.description}</p>

                    {/* Reason Badge */}
                    <div className="mb-4">
                      <span className="text-xs bg-white/60 px-3 py-1 rounded-full font-medium text-gray-700">
                        💡 {suggestion.reason}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleSuggestionAction(suggestion.modeId, suggestion)}
                      className="w-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white rounded-2xl py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      {suggestion.modeId === "cook" && "🍳 Get Recipe"}
                      {suggestion.modeId === "delivery" && "🛵 Order Now"}
                      {suggestion.modeId === "restaurant" && "🍽️ See Details"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="mt-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-2xl py-3 font-medium"
            >
              Try Different Options
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
