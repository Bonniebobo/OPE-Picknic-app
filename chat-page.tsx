"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Clock } from "lucide-react"

const chatHistory = [
  {
    id: "1",
    character: { name: "Buzzy", emoji: "🐰", background: "bg-pink-100" },
    lastMessage: "How about some comfort ramen for this rainy day?",
    timestamp: "2 hours ago",
    unread: 2,
  },
  {
    id: "2",
    character: { name: "Luma", emoji: "🐱", background: "bg-green-100" },
    lastMessage: "I found a perfect pasta recipe for you!",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    character: { name: "Foxy", emoji: "🦊", background: "bg-purple-100" },
    lastMessage: "Ready for today's food challenge?",
    timestamp: "2 days ago",
    unread: 1,
  },
  {
    id: "4",
    character: { name: "Truffina", emoji: "🐶", background: "bg-orange-100" },
    lastMessage: "Did you know it's National Taco Day?",
    timestamp: "3 days ago",
    unread: 0,
  },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId)
    console.log("Opening chat:", chatId)
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Chat History
          </h1>
          <p className="text-base text-gray-600">Continue your conversations with AI companions</p>
        </div>
      </div>

      {/* Chat List */}
      <div className="px-6">
        <div className="space-y-4">
          {chatHistory.map((chat) => (
            <Card
              key={chat.id}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                selectedChat === chat.id ? "scale-102 shadow-xl ring-2 ring-gray-300" : "shadow-lg hover:shadow-xl"
              } ${chat.character.background} border-0 rounded-3xl overflow-hidden`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  {/* Character Avatar */}
                  <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-3xl">{chat.character.emoji}</span>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-800">{chat.character.name}</h3>
                      <div className="flex items-center gap-2">
                        {chat.unread > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{chat.unread}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{chat.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start New Chat */}
        <div className="mt-8">
          <Button className="w-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white rounded-3xl py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Start New Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
