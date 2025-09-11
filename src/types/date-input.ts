export type DateFormat = "dd-mm-yyyy" | "dd/mm/yyyy" | "mm-dd-yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd"

export type CalendarMode = "inline" | "dropdown"

export type SelectionMode = "single" | "multiple" |"range"

// export type AddressType ="street" | "suburb"|"state"| "postCode"

export interface DateInputProps {
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  dateFormat?: DateFormat
  selectionMode?: SelectionMode
  calendarMode?: CalendarMode
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  className?: string
  minDate?: string
  maxDate?: string
}

export interface CalendarProps {
  selectedDates: Date[]
  onDateSelect: (date: Date) => void
  selectionMode: SelectionMode
  minDate?: Date | null
  maxDate?: Date | null
  className?: string
}
