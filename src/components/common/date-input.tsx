"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DateInputProps } from "@/types/date-input"
import { formatDate, parseDate, isSameDate } from "@/lib/date-utils"
import { Calendar } from "./calendar"

export function DateInput({
    value,
    onChange,
    dateFormat = "yyyy-mm-dd",
    selectionMode = "single",
    calendarMode = "dropdown",
    placeholder,
    disabled = false,
    readonly = false,
    className,
    minDate,
    maxDate,
}: DateInputProps) {
    const [isOpen, setIsOpen] = useState(calendarMode === "inline")
    const [inputValue, setInputValue] = useState("")
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [positionAbove, setPositionAbove] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const parsedMinDate = minDate ? parseDate(minDate, dateFormat) : undefined
    const parsedMaxDate = maxDate ? parseDate(maxDate, dateFormat) : undefined

    useEffect(() => {
        if (!value) {
            setSelectedDates([])
            setInputValue("")
            return
        }

        const dates: Date[] = []
        const values = Array.isArray(value) ? value : [value]

        for (const val of values) {
            const parsed = parseDate(val, dateFormat)
            if (parsed) {
                dates.push(parsed)
            }
        }

        setSelectedDates(dates)

        if (selectionMode === "single" && dates.length > 0) {
            setInputValue(formatDate(dates[0], dateFormat))
        } else if (selectionMode === "multiple") {
            setInputValue(dates.map((date) => formatDate(date, dateFormat)).join(", "))
        }
    }, [value, dateFormat, selectionMode])

    useEffect(() => {
        if (calendarMode !== "dropdown" || !isOpen) return

        const checkPosition = () => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top

            // Assuming calendar height around 300px; adjust as needed
            setPositionAbove(spaceBelow < 300 && spaceAbove > spaceBelow)
        }

        checkPosition()
        window.addEventListener("resize", checkPosition)
        window.addEventListener("scroll", checkPosition, true)

        return () => {
            window.removeEventListener("resize", checkPosition)
            window.removeEventListener("scroll", checkPosition, true)
        }
    }, [isOpen, calendarMode])

    useEffect(() => {
        if (calendarMode !== "dropdown") return
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [calendarMode])

    const handleDateSelect = (date: Date) => {
        let newSelectedDates: Date[]
        if (selectionMode === "single") {
            newSelectedDates = [date]
            setIsOpen(calendarMode === "dropdown" ? false : true)
        } else {
            const isAlreadySelected = selectedDates.some((selectedDate) => isSameDate(selectedDate, date))
            if (isAlreadySelected) {
                newSelectedDates = selectedDates.filter((selectedDate) => !isSameDate(selectedDate, date))
            } else {
                newSelectedDates = [...selectedDates, date]
            }
        }

        setSelectedDates(newSelectedDates)

        if (selectionMode === "single" && newSelectedDates.length > 0) {
            const formatted = formatDate(newSelectedDates[0], dateFormat)
            setInputValue(formatted)
            onChange?.(formatted)
        } else if (selectionMode === "multiple") {
            const formatted = newSelectedDates.map((d) => formatDate(d, dateFormat))
            setInputValue(formatted.join(", "))
            onChange?.(formatted)
        } else {
            setInputValue("")
            onChange?.(selectionMode === "single" ? "" : [])
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readonly) {
            e.preventDefault()
            return
        }

        const newValue = e.target.value
        setInputValue(newValue)

        if (selectionMode === "single") {
            const parsed = parseDate(newValue, dateFormat)
            if (parsed) {
                setSelectedDates([parsed])
                onChange?.(newValue)
            } else if (newValue === "") {
                setSelectedDates([])
                onChange?.("")
            }
        }
    }

    const handleInputFocus = () => {
        if (calendarMode === "dropdown" && !disabled) {
            setIsOpen(true)
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (readonly) {
            if (e.key !== "Tab" && e.key !== "Escape") {
                e.preventDefault()
            }
            if (e.key === "Escape" && calendarMode === "dropdown") {
                setIsOpen(false)
            }
        }
    }

    const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (readonly) {
            e.preventDefault()
        }
    }

    const clearSelection = () => {
        setSelectedDates([])
        setInputValue("")
        onChange?.(selectionMode === "single" ? "" : [])
    }

    const toggleCalendar = () => {
        if (calendarMode === "dropdown") {
            setIsOpen(!isOpen)
        }
    }

    const getPlaceholder = () => {
        if (placeholder) return placeholder
        const formatExample = dateFormat.replace(/yyyy/g, "2024").replace(/mm/g, "12").replace(/dd/g, "31")
        return selectionMode === "multiple" ? `Select dates (${formatExample})` : `Select date (${formatExample})`
    }

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <div className="relative">
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 pr-20"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                    onPaste={handleInputPaste}
                    placeholder={getPlaceholder()}
                    disabled={disabled}
                    readOnly={readonly}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {selectedDates.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                    {calendarMode === "dropdown" && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={toggleCalendar}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                        >
                            <CalendarIcon className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {(isOpen || calendarMode === "inline") && (
                <div
                    className={cn(
                        calendarMode === "dropdown" && "absolute left-0 z-50",
                        positionAbove ? "bottom-full mb-2" : "top-full mt-[-10px]",
                        calendarMode === "inline" && "mt-4"
                    )}
                >
                    <Calendar
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                        selectionMode={selectionMode}
                        minDate={parsedMinDate}
                        maxDate={parsedMaxDate}
                    />
                </div>
            )}
        </div>
    )
}
