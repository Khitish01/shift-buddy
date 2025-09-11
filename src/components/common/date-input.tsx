"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DateInputProps } from "@/types/date-input"
import { formatDate, parseDate, isSameDate } from "@/lib/date-utils"
import { Calendar } from "./calendar"
import { z, ZodError } from "zod"

interface ValidatableDateInputProps extends DateInputProps {
    schema?: z.ZodTypeAny // ✅ optional schema for validation
}

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
    schema, // ✅ new optional prop
}: ValidatableDateInputProps) {
    const [isOpen, setIsOpen] = useState(calendarMode === "inline")
    const [inputValue, setInputValue] = useState("")
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [rangeStart, setRangeStart] = useState<Date | null>(null)
    const [positionAbove, setPositionAbove] = useState(false)
    const [error, setError] = useState<string>("") // ✅ validation error
    const containerRef = useRef<HTMLDivElement>(null)

    const parsedMinDate = minDate ? parseDate(minDate, dateFormat) : undefined
    const parsedMaxDate = maxDate ? parseDate(maxDate, dateFormat) : undefined

    const getDatesBetween = (start: Date, end: Date): Date[] => {
        const dates = []
        const current = new Date(start)
        while (current <= end) {
            dates.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }
        return dates
    }

    // ---------------- VALIDATION ----------------
    const validateValue = (val: string | string[]) => {
        if (!schema) return // ✅ no schema → skip validation
        try {
            schema.parse(val)
            setError("")
        } catch (err) {
            if (err instanceof ZodError && err.issues.length > 0) {
                setError(err.issues[0].message)
            } else {
                setError("Invalid date")
            }
        }
    }
    // --------------------------------------------

    useEffect(() => {
        if (!value) {
            setSelectedDates([])
            setInputValue("")
            validateValue("") // ✅ validate empty
            return
        }

        const dates: Date[] = []
        const values = Array.isArray(value) ? value : [value]

        for (const val of values) {
            const parsed = parseDate(val, dateFormat)
            if (parsed) dates.push(parsed)
        }

        setSelectedDates(dates)

        if (selectionMode === "single" && dates.length > 0) {
            const formatted = formatDate(dates[0], dateFormat)
            setInputValue(formatted)
            validateValue(formatted)
        } else if (selectionMode === "multiple") {
            const formatted = dates.map((date) => formatDate(date, dateFormat))
            setInputValue(formatted.join(", "))
            validateValue(formatted)
        } else if (selectionMode === "range" && dates.length === 2) {
            const formatted = `${formatDate(dates[0], dateFormat)} - ${formatDate(dates[1], dateFormat)}`
            setInputValue(formatted)
            validateValue([formatDate(dates[0], dateFormat), formatDate(dates[1], dateFormat)])
        }
    }, [value, dateFormat, selectionMode])

    useEffect(() => {
        if (calendarMode !== "dropdown" || !isOpen) return

        const checkPosition = () => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
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
        } else if (selectionMode === "range") {
            if (!rangeStart || selectedDates.length === 2) {
                newSelectedDates = [date]
                setRangeStart(date)
            } else {
                const start = rangeStart
                const end = date
                const [startDate, endDate] = start <= end ? [start, end] : [end, start]
                newSelectedDates = getDatesBetween(startDate, endDate)
                setRangeStart(null)
                setIsOpen(calendarMode === "dropdown" ? false : true)
            }
        } else {
            const isAlreadySelected = selectedDates.some((d) => isSameDate(d, date))
            newSelectedDates = isAlreadySelected
                ? selectedDates.filter((d) => !isSameDate(d, date))
                : [...selectedDates, date]
        }

        setSelectedDates(newSelectedDates)

        if (selectionMode === "single" && newSelectedDates.length > 0) {
            const formatted = formatDate(newSelectedDates[0], dateFormat)
            setInputValue(formatted)
            onChange?.(formatted)
            validateValue(formatted) // ✅ validate
        } else if (selectionMode === "multiple") {
            const formatted = newSelectedDates.map((d) => formatDate(d, dateFormat))
            setInputValue(formatted.join(", "))
            onChange?.(formatted)
            validateValue(formatted) // ✅ validate
        } else if (selectionMode === "range") {
            if (newSelectedDates.length >= 2) {
                const startFormatted = formatDate(newSelectedDates[0], dateFormat)
                const endFormatted = formatDate(newSelectedDates[newSelectedDates.length - 1], dateFormat)
                const allFormatted = newSelectedDates.map(d => formatDate(d, dateFormat))
                setInputValue(`${startFormatted} - ${endFormatted}`)
                onChange?.(allFormatted)
                validateValue(allFormatted)
            } else if (newSelectedDates.length === 1) {
                const formatted = formatDate(newSelectedDates[0], dateFormat)
                setInputValue(formatted)
                onChange?.([formatted])
                validateValue([formatted])
            } else {
                setInputValue("")
                onChange?.([])
                validateValue("")
            }
        } else {
            setInputValue("")
            onChange?.(selectionMode === "single" ? "" : [])
            validateValue("") // ✅ validate empty
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
                validateValue(newValue)
            } else if (newValue === "") {
                setSelectedDates([])
                onChange?.("")
                validateValue("")
            }
        }
    }

    const clearSelection = () => {
        setSelectedDates([])
        setRangeStart(null)
        setInputValue("")
        onChange?.(selectionMode === "single" ? "" : [])
        validateValue("") // ✅ validate empty
    }

    const toggleCalendar = () => {
        if (calendarMode === "dropdown") setIsOpen(!isOpen)
    }

    const getPlaceholder = () => {
        if (placeholder) return placeholder
        const formatExample = dateFormat.replace(/yyyy/g, "2024").replace(/mm/g, "12").replace(/dd/g, "31")
        if (selectionMode === "multiple") return `Select dates (${formatExample})`
        if (selectionMode === "range") return `Select date range (${formatExample} - ${formatExample})`
        return `Select date (${formatExample})`
    }

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none pr-20 appearance-none bg-white
            ${error ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && calendarMode === "dropdown" && setIsOpen(true)}
                    placeholder={getPlaceholder()}
                    disabled={disabled}
                    readOnly={readonly}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {selectedDates.length > 0 && (
                        <Button type="button" variant="ghost" size="sm" onClick={clearSelection} className="h-6 w-6 p-0 hover:bg-gray-100">
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                    {calendarMode === "dropdown" && (
                        <Button type="button" variant="ghost" size="sm" onClick={toggleCalendar} className="h-6 w-6 p-0 hover:bg-gray-100">
                            <CalendarIcon className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* ✅ show error */}

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
