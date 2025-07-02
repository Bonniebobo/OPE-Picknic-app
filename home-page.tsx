"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

const characters = [
  {
    id: "mood-matcher",
    name: "Mood Matcher",
    tagline: "Let's find comfort together",
    emoji: "🩷",
    description: "A gentle, empathetic bot who understands your emotions and gives comforting food suggestions",
    background: "bg-pink-100",
    accent: "bg-pink-200",
    border: "border-pink-300",
    glow: "shadow-pink-200",
    avatarColors: {
      body: "bg-pink-200",
      head: "bg-pink-300",
      cheeks: "bg-pink-400",
      eyes: "bg-gray-800",
      mouth: "bg-gray-700",
    },
  },
  {
    id: "recipe-helper",
    name: "Recipe Helper",
    tagline: "Your caring kitchen companion",
    emoji: "🥕",
    description: "A caring kitchen companion who helps you decide what to cook",
    background: "bg-orange-100",
    accent: "bg-orange-200",
    border: "border-orange-300",
    glow: "shadow-orange-200",
    avatarColors: {
      body: "bg-orange-200",
      head: "bg-orange-300",
      cheeks: "bg-orange-400",
      eyes: "bg-gray-800",
      mouth: "bg-gray-700",
    },
  },
  {
    id: "experienced-explorer",
    name: "Experienced Explorer",
    tagline: "Discover hidden culinary gems",
    emoji: "🌍",
    description: "A wise culinary adventurer who knows the hidden gems around the world",
    background: "bg-green-100",
    accent: "bg-green-200",
    border: "border-green-300",
    glow: "shadow-green-200",
    avatarColors: {
      body: "bg-green-200",
      head: "bg-green-300",
      cheeks: "bg-green-400",
      eyes: "bg-gray-800",
      mouth: "bg-gray-700",
    },
  },
  {
    id: "play-mode-bot",
    name: "Play Mode Bot",
    tagline: "Let's play to decide!",
    emoji: "🎮",
    description: "A fun, playful bot that helps you choose food through interactive games",
    background: "bg-purple-100",
    accent: "bg-purple-200",
    border: "border-purple-300",
    glow: "shadow-purple-200",
    avatarColors: {
      body: "bg-purple-200",
      head: "bg-purple-300",
      cheeks: "bg-purple-400",
      eyes: "bg-gray-800",
      mouth: "bg-gray-700",
    },
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

interface HomePageProps {
  eatingPreference?: string
  onBotSelect?: (botId: string) => void
}

// Flat cartoon avatar component
const FlatAvatar = ({ colors }: { colors: any }) => (
  <div className="relative w-16 h-16">
    {/* Body */}
    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 ${colors.body} rounded-full`}></div>

    {/* Head */}
    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-14 ${colors.head} rounded-full`}>
      {/* Eyes */}
      <div className={`absolute top-4 left-3 w-1.5 h-1.5 ${colors.eyes} rounded-full`}></div>
      <div className={`absolute top-4 right-3 w-1.5 h-1.5 ${colors.eyes} rounded-full`}></div>

      {/* Mouth */}
      <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-1 ${colors.mouth} rounded-full`}></div>

      {/* Cheeks */}
      <div className={`absolute top-5 left-2 w-1.5 h-1 ${colors.cheeks} rounded-full opacity-60`}></div>
      <div className={`absolute top-5 right-2 w-1.5 h-1 ${colors.cheeks} rounded-full opacity-60`}></div>
    </div>

    {/* Arms */}
    <div className={`absolute top-8 left-1 w-2 h-4 ${colors.body} rounded-full transform -rotate-12`}></div>
    <div className={`absolute top-8 right-1 w-2 h-4 ${colors.body} rounded-full transform rotate-12`}></div>
  </div>
)

export default function HomePage({ eatingPreference = "unsure", onBotSelect }: HomePageProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
    console.log("Starting interaction with:", characterId)
    if (onBotSelect) {
      onBotSelect(characterId)
    }
  }

  const handleQuickAction = (actionId: string) => {
    console.log("Quick action:", actionId)
  }

  // Enhanced seasonal and festive pick system
  const getSolarTermInfo = () => {
    // Simplified solar terms mapping (in a real app, this would be more sophisticated)
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()

    if (month === 2 && day >= 4) return { term: "立春", name: "Lichun", season: "spring" }
    if (month === 3 && day >= 6) return { term: "惊蛰", name: "Jingzhe", season: "spring" }
    if (month === 3 && day >= 21) return { term: "春分", name: "Chunfen", season: "spring" }
    if (month === 6 && day >= 6) return { term: "芒种", name: "Mangzhong", season: "summer" }
    if (month === 7 && day >= 7) return { term: "小暑", name: "Xiaoshu", season: "summer" }
    if (month === 7 && day >= 23) return { term: "大暑", name: "Dashu", season: "summer" }
    if (month === 9 && day >= 8) return { term: "白露", name: "Bailu", season: "autumn" }
    if (month === 9 && day >= 23) return { term: "秋分", name: "Qiufen", season: "autumn" }
    if (month === 10 && day >= 24) return { term: "霜降", name: "Shuangjiang", season: "autumn" }
    if (month === 12 && day >= 7) return { term: "大雪", name: "Daxue", season: "winter" }
    if (month === 12 && day >= 22) return { term: "冬至", name: "Dongzhi", season: "winter" }
    if (month === 1 && day >= 6) return { term: "小寒", name: "Xiaohan", season: "winter" }

    // Default to current season
    if (month >= 3 && month <= 5) return { term: "春", name: "Spring", season: "spring" }
    if (month >= 6 && month <= 8) return { term: "夏", name: "Summer", season: "summer" }
    if (month >= 9 && month <= 11) return { term: "秋", name: "Autumn", season: "autumn" }
    return { term: "冬", name: "Winter", season: "winter" }
  }

  const getFestiveInfo = () => {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()

    // Global holidays
    if (month === 2 && day === 14) return { name: "Valentine's Day", emoji: "💝", type: "global" }
    if (month === 10 && day === 31) return { name: "Halloween", emoji: "🎃", type: "global" }
    if (month === 12 && day === 25) return { name: "Christmas", emoji: "🎄", type: "global" }
    if (month === 11 && day >= 22 && day <= 28) return { name: "Thanksgiving", emoji: "🦃", type: "global" }

    // Chinese festivals (simplified dates)
    if (month === 9 && day >= 15 && day <= 17) return { name: "Mid-Autumn Festival", emoji: "🥮", type: "chinese" }
    if (month === 2 && day >= 10 && day <= 16) return { name: "Chinese New Year", emoji: "🧧", type: "chinese" }
    if (month === 6 && day >= 20 && day <= 22) return { name: "Dragon Boat Festival", emoji: "🐲", type: "chinese" }

    return null
  }

  const getSeasonalPick = () => {
    const solarTerm = getSolarTermInfo()
    const festive = getFestiveInfo()

    // Festive picks take priority
    if (festive) {
      const festivePicksData = {
        "Valentine's Day": {
          dish: "Heart-shaped Strawberry Tarts",
          reason: "Sweet treats to celebrate love and connection",
          emoji: "🍓",
          background: "bg-gradient-to-br from-pink-100 via-red-100 to-pink-200",
          decorations: ["💕", "🌹", "💝"],
          type: "festive",
        },
        "Mid-Autumn Festival": {
          dish: "Traditional Mooncakes with Tea",
          reason: "Celebrate family reunion with classic festival treats",
          emoji: "🥮",
          background: "bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200",
          decorations: ["🌕", "🏮", "🐰"],
          type: "festive",
        },
        Halloween: {
          dish: "Pumpkin Spice Everything",
          reason: "Embrace the spooky season with warming autumn flavors",
          emoji: "🎃",
          background: "bg-gradient-to-br from-orange-100 via-amber-100 to-orange-200",
          decorations: ["👻", "🕷️", "🍂"],
          type: "festive",
        },
        Christmas: {
          dish: "Festive Gingerbread Cookies",
          reason: "Spread holiday cheer with traditional Christmas treats",
          emoji: "🍪",
          background: "bg-gradient-to-br from-red-100 via-green-100 to-red-200",
          decorations: ["🎄", "❄️", "🎁"],
          type: "festive",
        },
        "Chinese New Year": {
          dish: "Lucky Dumplings & Hot Pot",
          reason: "Welcome prosperity with traditional New Year feast",
          emoji: "🥟",
          background: "bg-gradient-to-br from-red-100 via-yellow-100 to-red-200",
          decorations: ["🧧", "🐉", "🎆"],
          type: "festive",
        },
        Thanksgiving: {
          dish: "Roasted Turkey with Cranberry",
          reason: "Gather with loved ones for a grateful feast",
          emoji: "🦃",
          background: "bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-200",
          decorations: ["🍂", "🌽", "🥧"],
          type: "festive",
        },
      }

      return festivePicksData[festive.name as keyof typeof festivePicksData] || getSeasonalDefault(solarTerm)
    }

    // Solar term seasonal picks
    const solarTermPicks = {
      立春: {
        dish: "Fresh Spring Vegetable Stir-fry",
        reason: `Welcome ${solarTerm.term} (${solarTerm.name}) with tender spring greens`,
        emoji: "🌱",
        background: "bg-gradient-to-br from-green-100 via-lime-100 to-emerald-200",
        decorations: ["🌸", "🦋", "🌿"],
        type: "solar-term",
      },
      大暑: {
        dish: "Cooling Mung Bean Soup",
        reason: `Beat the ${solarTerm.term} (${solarTerm.name}) heat with refreshing summer treats`,
        emoji: "🍧",
        background: "bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-200",
        decorations: ["☀️", "🌊", "🧊"],
        type: "solar-term",
      },
      白露: {
        dish: "Warming Pear & Ginger Soup",
        reason: `Nourish yourself during ${solarTerm.term} (${solarTerm.name}) with moistening foods`,
        emoji: "🍐",
        background: "bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-200",
        decorations: ["🍂", "🌾", "🍯"],
        type: "solar-term",
      },
      冬至: {
        dish: "Hearty Lamb Hot Pot",
        reason: `Celebrate ${solarTerm.term} (${solarTerm.name}) with warming, nourishing dishes`,
        emoji: "🍲",
        background: "bg-gradient-to-br from-red-100 via-orange-100 to-amber-200",
        decorations: ["❄️", "🔥", "🧣"],
        type: "solar-term",
      },
    }

    return solarTermPicks[solarTerm.term as keyof typeof solarTermPicks] || getSeasonalDefault(solarTerm)
  }

  const getSeasonalDefault = (solarTerm: any) => {
    const seasonalDefaults = {
      spring: {
        dish: "Fresh Seasonal Salad Bowl",
        reason: "Embrace spring's renewal with crisp, fresh ingredients",
        emoji: "🥗",
        background: "bg-gradient-to-br from-green-100 via-lime-100 to-emerald-200",
        decorations: ["🌸", "🦋", "🌿"],
        type: "seasonal",
      },
      summer: {
        dish: "Chilled Gazpacho Soup",
        reason: "Cool down with refreshing summer flavors",
        emoji: "🍅",
        background: "bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-200",
        decorations: ["☀️", "🌊", "🧊"],
        type: "seasonal",
      },
      autumn: {
        dish: "Roasted Root Vegetable Medley",
        reason: "Savor autumn's harvest with warming, earthy flavors",
        emoji: "🥕",
        background: "bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-200",
        decorations: ["🍂", "🌾", "🎃"],
        type: "seasonal",
      },
      winter: {
        dish: "Comforting Bone Broth Ramen",
        reason: "Warm your soul with nourishing winter comfort food",
        emoji: "🍜",
        background: "bg-gradient-to-br from-red-100 via-orange-100 to-amber-200",
        decorations: ["❄️", "🔥", "🧣"],
        type: "seasonal",
      },
    }

    return seasonalDefaults[solarTerm.season as keyof typeof seasonalDefaults]
  }

  // Floating decoration component
  const FloatingDecorations = ({ decorations }: { decorations: string[] }) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {decorations.map((decoration, index) => (
        <div
          key={index}
          className={`absolute text-2xl animate-bounce opacity-60`}
          style={{
            top: `${20 + index * 25}%`,
            left: `${10 + index * 30}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${2 + index * 0.5}s`,
          }}
        >
          {decoration}
        </div>
      ))}
    </div>
  )

  // Replace the existing Today's Pick section with this enhanced version:
  const seasonalPick = getSeasonalPick()

  return (
    <div className="pb-4">
      {/* Greeting Section */}
      <div className="pt-12 pb-4 px-6">
        <div className="flex items-center gap-4">
          {/* User Profile Picture */}
          <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">👤</span>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Hi, Zihan!</h1>
            <p className="text-base text-gray-600">Ready for today's taste adventure?</p>
          </div>
        </div>
      </div>

      {/* AI Bot Selection Section */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🧸</span>
          Choose Your AI Companion
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
                } ${character.background} border-0 rounded-3xl overflow-hidden h-40`}
                onClick={() => handleCharacterSelect(character.id)}
              >
                <CardContent className="p-4 h-full flex flex-col justify-center">
                  <div className="text-center">
                    {/* Flat Cartoon Avatar */}
                    <div className="flex justify-center mb-3">
                      <FlatAvatar colors={character.avatarColors} />
                    </div>

                    {/* Character Info */}
                    <h3 className="text-base font-bold text-gray-800 mb-1">{character.name}</h3>
                    <p className="text-xs text-gray-600 font-medium leading-tight">{character.tagline}</p>

                    {/* Selection Indicator */}
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

      {/* Enhanced Seasonal/Festive Pick */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🍽️</span>
          {seasonalPick.type === "festive"
            ? "Festive Special"
            : seasonalPick.type === "solar-term"
              ? "Seasonal Wisdom"
              : "Today's Pick"}
        </h2>

        <Card
          className={`${seasonalPick.background} border-0 shadow-xl rounded-3xl overflow-hidden relative transform hover:scale-102 transition-all duration-300`}
        >
          {/* Floating decorations */}
          <FloatingDecorations decorations={seasonalPick.decorations} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-start gap-5">
              {/* Enhanced emoji display */}
              <div className="relative">
                <div className="text-6xl animate-pulse">{seasonalPick.emoji}</div>
                {seasonalPick.type === "festive" && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: "3s" }}>
                    ✨
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">{seasonalPick.dish}</h3>
                <p className="text-base text-gray-700 font-medium leading-relaxed mb-4">{seasonalPick.reason}</p>

                {/* Type indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/60 px-3 py-1 rounded-full font-bold text-gray-700 uppercase tracking-wide">
                    {seasonalPick.type === "festive"
                      ? "🎉 Festival"
                      : seasonalPick.type === "solar-term"
                        ? "🌿 Solar Term"
                        : "🌸 Seasonal"}
                  </span>
                  {seasonalPick.type === "solar-term" && (
                    <span className="text-xs bg-white/60 px-3 py-1 rounded-full font-bold text-gray-700">
                      二十四节气
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-xl p-3 mt-1 transform hover:scale-110 transition-all duration-200"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Enhanced bottom section for festive picks */}
            {seasonalPick.type === "festive" && (
              <div className="mt-4 pt-4 border-t border-white/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Perfect for celebrating together</span>
                  <div className="flex gap-1">
                    {seasonalPick.decorations.slice(0, 3).map((decoration, index) => (
                      <span key={index} className="text-lg animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                        {decoration}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
    </div>
  )
}
