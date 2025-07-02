"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, Plus, Filter } from "lucide-react"

const likedItems = [
  {
    id: "1",
    name: "Homemade Ramen",
    type: "recipe",
    emoji: "🍜",
    category: "Comfort Food",
    mood: "Cozy",
    background: "bg-orange-100",
  },
  {
    id: "2",
    name: "Sakura Sushi",
    type: "restaurant",
    emoji: "🍣",
    category: "Japanese",
    mood: "Adventurous",
    background: "bg-pink-100",
  },
  {
    id: "3",
    name: "Thai Green Curry",
    type: "recipe",
    emoji: "🍛",
    category: "Spicy",
    mood: "Energetic",
    background: "bg-green-100",
  },
  {
    id: "4",
    name: "Artisan Pizza Co.",
    type: "restaurant",
    emoji: "🍕",
    category: "Italian",
    mood: "Social",
    background: "bg-red-100",
  },
]

const dislikedItems = [
  {
    id: "1",
    name: "Spicy Food",
    type: "ingredient",
    emoji: "🌶️",
    reason: "Too hot for me",
    background: "bg-red-100",
  },
  {
    id: "2",
    name: "Seafood",
    type: "category",
    emoji: "🐟",
    reason: "Allergic reaction",
    background: "bg-blue-100",
  },
  {
    id: "3",
    name: "Organ Meats",
    type: "ingredient",
    emoji: "🫘",
    reason: "Texture preference",
    background: "bg-gray-100",
  },
]

export default function CollectionPage() {
  const [activeSection, setActiveSection] = useState<"liked" | "disliked">("liked")
  const [showFilters, setShowFilters] = useState(false)

  const handleAddNew = () => {
    console.log("Adding new item to", activeSection)
  }

  const handleRemoveItem = (itemId: string, section: "liked" | "disliked") => {
    console.log("Removing item", itemId, "from", section)
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Collection</h1>
          <p className="text-base text-gray-600">Curate your food preferences and discoveries</p>
        </div>
      </div>

      {/* Section Toggle */}
      <div className="px-6 mb-6">
        <div className="flex bg-white/60 rounded-3xl p-1 shadow-inner">
          <button
            onClick={() => setActiveSection("liked")}
            className={`flex-1 py-3 px-4 rounded-3xl font-semibold transition-all duration-200 ${
              activeSection === "liked"
                ? "bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ❤️ Liked ({likedItems.length})
          </button>
          <button
            onClick={() => setActiveSection("disliked")}
            className={`flex-1 py-3 px-4 rounded-3xl font-semibold transition-all duration-200 ${
              activeSection === "disliked"
                ? "bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🚫 Disliked ({dislikedItems.length})
          </button>
        </div>
      </div>

      {/* Filter Button */}
      <div className="px-6 mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          className="text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-2xl"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Content */}
      <div className="px-6">
        {activeSection === "liked" ? (
          <div className="space-y-4">
            {likedItems.map((item) => (
              <Card
                key={item.id}
                className={`${item.background} border-0 shadow-lg rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-xl`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-white/50 px-2 py-1 rounded-full font-medium text-gray-700">
                          {item.type}
                        </span>
                        <span className="text-xs bg-white/50 px-2 py-1 rounded-full font-medium text-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Mood: {item.mood}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, "liked")}
                      className="p-2 rounded-xl hover:bg-white/40 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dislikedItems.map((item) => (
              <Card
                key={item.id}
                className={`${item.background} border-0 shadow-lg rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-xl`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                      <span className="text-xs bg-white/50 px-2 py-1 rounded-full font-medium text-gray-700 mb-2 inline-block">
                        {item.type}
                      </span>
                      <p className="text-sm text-gray-600 font-medium">{item.reason}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, "disliked")}
                      className="p-2 rounded-xl hover:bg-white/40 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Button */}
        <div className="mt-8">
          <Button
            onClick={handleAddNew}
            className="w-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white rounded-3xl py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New {activeSection === "liked" ? "Favorite" : "Dislike"}
          </Button>
        </div>
      </div>
    </div>
  )
}
