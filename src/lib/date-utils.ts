import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import type { DateFormat } from "@/types/date-input"

// Enable custom parse format plugin
dayjs.extend(customParseFormat)

const getFormatString = (format: DateFormat): string => {
  switch (format) {
    case "dd-mm-yyyy":
      return "DD-MM-YYYY"
    case "dd/mm/yyyy":
      return "DD/MM/YYYY"
    case "mm-dd-yyyy":
      return "MM-DD-YYYY"
    case "mm/dd/yyyy":
      return "MM/DD/YYYY"
    case "yyyy-mm-dd":
      return "YYYY-MM-DD"
    default:
      return "YYYY-MM-DD"
  }
}

export const formatDate = (date: Date, format: DateFormat): string => {
  const formatString = getFormatString(format)
  return dayjs(date).format(formatString)
}

export const parseDate = (dateString: string, format: DateFormat): Date | null => {
  if (!dateString || !dateString.trim()) return null

  const formatString = getFormatString(format)
  const parsed = dayjs(dateString, formatString, true) // strict parsing

  if (!parsed.isValid()) {
    return null
  }

  return parsed.toDate()
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return dayjs(date1).isSame(dayjs(date2), "day")
}

export const isDateInRange = (date: Date, minDate?: Date|null, maxDate?: Date|null): boolean => {
  const dayjsDate = dayjs(date)

  if (minDate && dayjsDate.isBefore(dayjs(minDate), "day")) return false
  if (maxDate && dayjsDate.isAfter(dayjs(maxDate), "day")) return false

  return true
}

export const getMonthDays = (year: number, month: number): Date[] => {
  const firstDay = dayjs().year(year).month(month).startOf("month")
  const lastDay = firstDay.endOf("month")
  const days: Date[] = []

  // Add empty cells for days before the first day of the month
  const startDay = firstDay.day()
  for (let i = 0; i < startDay; i++) {
    days.push(firstDay.subtract(startDay - i, "day").toDate())
  }

  // Add all days of the month
  for (let day = 1; day <= lastDay.date(); day++) {
    days.push(firstDay.date(day).toDate())
  }

//   // Add empty cells for days after the last day of the month
//   const remainingCells = 42 - days.length // 6 rows × 7 days
//   for (let i = 1; i <= remainingCells; i++) {
//     days.push(lastDay.add(i, "day").toDate())
//   }

  return days
}
