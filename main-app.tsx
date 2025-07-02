"use client"

import { useState } from "react"
import { MessageCircle, Calendar, Home, FolderOpen } from "lucide-react"
import HomePage from "./home-page"
import ChatPage from "./chat-page"
import CalendarPage from "./calendar-page"
import CollectionPage from "./collection-page"
import BotInteractionScreen from "./bot-interaction-screen"

type TabType = "home" | "chat" | "calendar" | "collection"

interface MainAppProps {
  eatingPreference?: string
}

export default function MainApp({ eatingPreference = "unsure" }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [selectedBot, setSelectedBot] = useState<string | null>(null)

  const handleBotSelect = (botId: string) => {
    setSelectedBot(botId)
  }

  const handleBackToHome = () => {
    setSelectedBot(null)
    setActiveTab("home")
  }

  const renderCurrentTab = () => {
    if (selectedBot) {
      return <BotInteractionScreen botId={selectedBot} eatingPreference={eatingPreference} onBack={handleBackToHome} />
    }

    switch (activeTab) {
      case "home":
        return <HomePage eatingPreference={eatingPreference} onBotSelect={handleBotSelect} />
      case "chat":
        return <ChatPage />
      case "calendar":
        return <CalendarPage />
      case "collection":
        return <CollectionPage />
      default:
        return <HomePage eatingPreference={eatingPreference} onBotSelect={handleBotSelect} />
    }
  }

  // Hide bottom navigation when in bot interaction
  const showBottomNav = !selectedBot

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* iPhone safe area container */}
      <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">{renderCurrentTab()}</div>

        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100 px-6 py-3 shadow-lg">
            <div className="flex items-center justify-around">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
                  activeTab === "home" ? "bg-gradient-to-r from-pink-100 to-orange-100 shadow-sm" : "hover:bg-gray-100"
                }`}
              >
                <Home className={`w-5 h-5 ${activeTab === "home" ? "text-gray-700" : "text-gray-500"}`} />
                <span className={`text-xs font-medium ${activeTab === "home" ? "text-gray-700" : "text-gray-500"}`}>
                  Home
                </span>
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
                  activeTab === "chat" ? "bg-gradient-to-r from-pink-100 to-orange-100 shadow-sm" : "hover:bg-gray-100"
                }`}
              >
                <MessageCircle className={`w-5 h-5 ${activeTab === "chat" ? "text-gray-700" : "text-gray-500"}`} />
                <span className={`text-xs font-medium ${activeTab === "chat" ? "text-gray-700" : "text-gray-500"}`}>
                  Chat
                </span>
              </button>

              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
                  activeTab === "calendar"
                    ? "bg-gradient-to-r from-pink-100 to-orange-100 shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                <Calendar className={`w-5 h-5 ${activeTab === "calendar" ? "text-gray-700" : "text-gray-500"}`} />
                <span className={`text-xs font-medium ${activeTab === "calendar" ? "text-gray-700" : "text-gray-500"}`}>
                  Calendar
                </span>
              </button>

              <button
                onClick={() => setActiveTab("collection")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
                  activeTab === "collection"
                    ? "bg-gradient-to-r from-pink-100 to-orange-100 shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                <FolderOpen className={`w-5 h-5 ${activeTab === "collection" ? "text-gray-700" : "text-gray-500"}`} />
                <span
                  className={`text-xs font-medium ${activeTab === "collection" ? "text-gray-700" : "text-gray-500"}`}
                >
                  Collection
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
