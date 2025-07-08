"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalendarProps } from "@/types/date-input"
import { cn } from "@/lib/utils"
import { getMonthDays, isSameDate, isDateInRange } from "@/lib/date-utils"

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]

export function Calendar({ selectedDates, onDateSelect, selectionMode, minDate, maxDate, className }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day")

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const monthDays = getMonthDays(currentYear, currentMonth)

    const navigate = (direction: "prev" | "next") => {
        setCurrentDate(prev => {
            const newDate = new Date(prev)
            if (viewMode === "day") {
                newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
            } else if (viewMode === "month") {
                newDate.setFullYear(prev.getFullYear() + (direction === "next" ? 1 : -1))
            } else if (viewMode === "year") {
                newDate.setFullYear(prev.getFullYear() + (direction === "next" ? 12 : -12))
            }
            return newDate
        })
    }

    const isDateSelected = (date: Date) => selectedDates.some(selectedDate => isSameDate(selectedDate, date))
    const isDateDisabled = (date: Date) => !isDateInRange(date, minDate, maxDate)
    const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return
        onDateSelect(date)
    }

    return (
        <div className="mt-4 p-4 rounded-t-lg shadow-lg" style={{
            backgroundImage: 'url(/images/calendar-bg.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
        }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("prev")} className="h-8 w-8 p-0 hover:bg-purple-200">
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-lg font-medium text-gray-800 flex gap-1">
                    <span onClick={() => setViewMode("month")} className="cursor-pointer hover:underline">
                        {MONTHS[currentMonth]}
                    </span>
                    <span onClick={() => setViewMode("year")} className="cursor-pointer hover:underline">
                        {currentYear}
                    </span>
                </div>

                <Button variant="ghost" size="sm" onClick={() => navigate("next")} className="h-8 w-8 p-0 hover:bg-purple-200">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Grid based on viewMode */}
            {viewMode === "day" && (
                <>
                    <div className="grid grid-cols-7 gap-3 mb-2">
                        {WEEKDAYS.map((day, index) => (
                            <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                        {monthDays.map((date, index) => {
                            const isSelected = isDateSelected(date)
                            const isDisabled = isDateDisabled(date)
                            const isOtherMonth = !isCurrentMonth(date)

                            return (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDateClick(date)}
                                    disabled={isDisabled}
                                    className={cn(
                                        "h-8 w-8 p-0 text-sm font-normal hover:rounded-full",
                                        isSelected && "bg-white rounded-full",
                                        !isSelected && !isOtherMonth && "hover:bg-purple-200",
                                        isOtherMonth && "text-gray-400",
                                        isDisabled && "opacity-50 cursor-not-allowed",
                                    )}
                                >
                                    {date.getDate()}
                                </Button>
                            )
                        })}
                    </div>
                </>
            )}

            {viewMode === "month" && (
                <div className="grid grid-cols-3 gap-6">
                    {MONTHS.map((monthName, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const newDate = new Date(currentDate)
                                newDate.setMonth(index)
                                setCurrentDate(newDate)
                                setViewMode("day")
                            }}
                            className="h-10 w-full"
                        >
                            {monthName.substring(0, 3)}
                        </Button>
                    ))}
                </div>
            )}

            {viewMode === "year" && (
                <div className="grid grid-cols-3 gap-6">
                    {Array.from({ length: 12 }, (_, i) => currentYear - (currentYear % 12) + i).map(year => (
                        <Button
                            key={year}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const newDate = new Date(currentDate)
                                newDate.setFullYear(year)
                                setCurrentDate(newDate)
                                setViewMode("month")
                            }}
                            className="h-10 w-full"
                        >
                            {year}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
