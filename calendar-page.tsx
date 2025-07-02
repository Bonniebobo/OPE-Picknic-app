"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const calendarData = {
  "2024-01-15": { bot: "🐰", meal: "🍜", activity: "Comfort ramen chat" },
  "2024-01-16": { bot: "🐱", meal: "🍝", activity: "Pasta recipe discussion" },
  "2024-01-17": { bot: "🦊", meal: "🎲", activity: "Food challenge game" },
  "2024-01-18": { bot: "🐶", meal: "🌮", activity: "Taco Tuesday celebration" },
  "2024-01-19": { bot: "🐰", meal: "🥗", activity: "Healthy salad suggestions" },
  "2024-01-20": { bot: "🐱", meal: "🍕", activity: "Pizza making tips" },
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)) // January 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey)
    console.log("Selected date:", dateKey, calendarData[dateKey as keyof typeof calendarData])
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Food Calendar</h1>
          <p className="text-base text-gray-600">Track your AI companion chats and meals</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="h-12"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayData = calendarData[dateKey as keyof typeof calendarData]
                const isSelected = selectedDate === dateKey

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(dateKey)}
                    className={`h-12 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      isSelected
                        ? "bg-gradient-to-r from-pink-200 to-orange-200 shadow-lg scale-105"
                        : dayData
                          ? "bg-gradient-to-r from-pink-100 to-orange-100 hover:shadow-md"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-sm font-semibold text-gray-800">{day}</span>
                      {dayData && (
                        <div className="flex gap-0.5 mt-0.5">
                          <span className="text-xs">{dayData.bot}</span>
                          <span className="text-xs">{dayData.meal}</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        {selectedDate && calendarData[selectedDate as keyof typeof calendarData] && (
          <Card className="mt-6 bg-gradient-to-r from-pink-100 to-orange-100 border-0 shadow-lg rounded-3xl overflow-hidden">
            <CardContent className="p-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex items-center justify-center gap-4 text-3xl mb-2">
                  <span>{calendarData[selectedDate as keyof typeof calendarData].bot}</span>
                  <span>{calendarData[selectedDate as keyof typeof calendarData].meal}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {calendarData[selectedDate as keyof typeof calendarData].activity}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
