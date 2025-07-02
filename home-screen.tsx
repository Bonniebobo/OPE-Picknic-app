"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Calendar, User, Home, Heart, Info } from "lucide-react"

const characters = [
  {
    id: "luma-cat",
    name: "Luma",
    role: "Smart Chef",
    emoji: "🐱",
    background: "bg-green-100",
    accent: "bg-green-200",
    border: "border-green-300",
    description: "Your culinary expert who knows the perfect recipe for any mood",
    glow: "shadow-green-200",
  },
  {
    id: "buzzy-bunny",
    name: "Buzzy",
    role: "Mood Matcher",
    emoji: "🐰",
    background: "bg-pink-100",
    accent: "bg-pink-200",
    border: "border-pink-300",
    description: "Understands your feelings and suggests comfort foods",
    glow: "shadow-pink-200",
  },
  {
    id: "foxy",
    name: "Foxy",
    role: "Game Explorer",
    emoji: "🦊",
    background: "bg-purple-100",
    accent: "bg-purple-200",
    border: "border-purple-300",
    description: "Makes eating fun with food games and challenges",
    glow: "shadow-purple-200",
  },
  {
    id: "truffina-dog",
    name: "Truffina",
    role: "Festive Guide",
    emoji: "🐶",
    background: "bg-orange-100",
    accent: "bg-orange-200",
    border: "border-orange-300",
    description: "Celebrates food culture and seasonal specialties",
    glow: "shadow-orange-200",
  },
]

const quickActions = [
  {
    id: "explore",
    label: "Explore Local",
    emoji: "🗺️",
    background: "bg-blue-100",
    hoverBg: "hover:bg-blue-200",
  },
  {
    id: "pick-me",
    label: "Pick for Me",
    emoji: "🎲",
    background: "bg-purple-100",
    hoverBg: "hover:bg-purple-200",
  },
  {
    id: "diary",
    label: "My Food Diary",
    emoji: "📓",
    background: "bg-green-100",
    hoverBg: "hover:bg-green-200",
  },
  {
    id: "festival",
    label: "Festival Tip",
    emoji: "✨",
    background: "bg-yellow-100",
    hoverBg: "hover:bg-yellow-200",
  },
]

interface PicknicHomeProps {
  eatingPreference?: string
}

export default function PicknicHome({ eatingPreference = "unsure" }: PicknicHomeProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
    console.log("Selected character:", characterId)
  }

  const handleQuickAction = (actionId: string) => {
    console.log("Quick action:", actionId)
  }

  const getDiningModeEmoji = () => {
    switch (eatingPreference) {
      case "cook":
        return "🍳"
      case "delivery":
        return "🛵"
      case "restaurant":
        return "🍽️"
      default:
        return "🤔"
    }
  }

  const getDailyPick = () => {
    const picks = {
      cook: {
        dish: "Homemade Ramen Bowl",
        reason: "We picked this based on your love for cooking & today's cozy weather",
        emoji: "🍜",
        background: "bg-gradient-to-br from-orange-100 to-yellow-100",
      },
      delivery: {
        dish: "Thai Green Curry",
        reason: "We picked this based on your delivery preference & your adventurous mood",
        emoji: "🍛",
        background: "bg-gradient-to-br from-green-100 to-blue-100",
      },
      restaurant: {
        dish: "Artisan Wood-Fired Pizza",
        reason: "We picked this based on your dining out mood & nearby top-rated spots",
        emoji: "🍕",
        background: "bg-gradient-to-br from-red-100 to-orange-100",
      },
      default: {
        dish: "Warm Soba Noodles",
        reason: "We picked this based on your mood & today's weather",
        emoji: "🍲",
        background: "bg-gradient-to-br from-purple-100 to-pink-100",
      },
    }
    return picks[eatingPreference as keyof typeof picks] || picks.default
  }

  const dailyPick = getDailyPick()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* iPhone safe area container */}
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* User Greeting Section */}
        <div className="pt-12 pb-4 px-6">
          <div className="flex items-center gap-4">
            {/* User Profile Picture */}
            <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">👤</span>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Hi, Zihan!
                <span className="text-2xl">{getDiningModeEmoji()}</span>
              </h1>
              <p className="text-base text-gray-600">Ready for your food adventure today?</p>
            </div>
          </div>
        </div>

        {/* Pick Your AI Companion */}
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🧸</span>
            Pick Your AI Companion
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {characters.map((character) => {
              const isSelected = selectedCharacter === character.id
              return (
                <Card
                  key={character.id}
                  className={`cursor-pointer transition-all duration-300 transform ${
                    isSelected
                      ? `scale-105 shadow-2xl ${character.glow} ring-2 ${character.border} animate-pulse`
                      : "shadow-lg hover:scale-102 hover:shadow-xl"
                  } ${character.background} border-0 rounded-3xl overflow-hidden h-32`}
                  onClick={() => handleCharacterSelect(character.id)}
                >
                  <CardContent className="p-4 h-full flex flex-col justify-center">
                    <div className="text-center">
                      {/* Character Avatar */}
                      <div className="text-5xl mb-2">{character.emoji}</div>

                      {/* Character Info */}
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{character.name}</h3>
                      <p className="text-xs text-gray-600 font-medium">{character.role}</p>

                      {/* Selection Glow Effect */}
                      {isSelected && (
                        <div className="mt-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mx-auto animate-bounce"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Daily Food Suggestion */}
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🍱</span>
            Today's Pick for You
          </h2>

          <Card className={`${dailyPick.background} border-0 shadow-lg rounded-3xl overflow-hidden`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{dailyPick.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{dailyPick.dish}</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">{dailyPick.reason}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-xl p-2 mt-1"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Row */}
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚡</span>
            Quick Actions
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`flex-shrink-0 ${action.background} ${action.hoverBg} rounded-3xl p-4 min-w-[85px] flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
              >
                <div className="text-3xl">{action.emoji}</div>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Festival Tip Section */}
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎉</span>
            Daily Festival Tip
          </h2>

          <Card className="bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 border-0 shadow-lg rounded-3xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🥮</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">It's Mid-Autumn Festival!</h3>
                    <p className="text-sm text-gray-600 font-medium">Try traditional mooncakes with tea</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-xl flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">What's this?</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spacer to push bottom nav down */}
        <div className="flex-1"></div>

        {/* Bottom Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100 px-6 py-3 shadow-lg">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-gradient-to-r from-pink-100 to-orange-100 shadow-sm">
              <Home className="w-5 h-5 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">Home</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-gray-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Chat</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-gray-100 transition-colors">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Calendar</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
