"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface TableAction {
    id: string
    label: string
    icon: React.ReactNode
    onClick: (row: any) => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    className?: string
}

export interface ColumnDefinition {
    key: string
    label: string
    type: "text" | "image" | "badge" | "date" | "number" | "actions"
    sortable?: boolean
    width?: string
    className?: string
    render?: (value: any, row: any) => React.ReactNode
    badgeVariant?: "default" | "secondary" | "destructive" | "outline"
    badgeColorMap?: Record<string, "default" | "secondary" | "destructive" | "outline">
}

export interface DataTableProps {
    data: any[]
    columns: ColumnDefinition[]
    actions?: TableAction[]
    sortable?: boolean
    paginated?: boolean
    pageSize?: number
    pageSizeOptions?: number[]
    className?: string
    rowClassName?: string
    headerClassName?: string
    onRowClick?: (row: any) => void
    loading?: boolean
    emptyMessage?: string
}

export function DataTable({
    data,
    columns,
    actions = [],
    sortable = true,
    paginated = true,
    pageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    className = "",
    rowClassName = "",
    headerClassName = "",
    onRowClick,
    loading = false,
    emptyMessage = "No data available",
}: DataTableProps) {
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: "asc" | "desc"
    } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageSize, setCurrentPageSize] = useState(pageSize)

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortConfig || !sortable) return data

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue === bValue) return 0

            const comparison = aValue < bValue ? -1 : 1
            return sortConfig.direction === "desc" ? comparison * -1 : comparison
        })
    }, [data, sortConfig, sortable])

    // Pagination logic
    const paginatedData = useMemo(() => {
        if (!paginated) return sortedData

        const startIndex = (currentPage - 1) * currentPageSize
        return sortedData.slice(startIndex, startIndex + currentPageSize)
    }, [sortedData, currentPage, currentPageSize, paginated])

    const totalPages = Math.ceil(sortedData.length / currentPageSize)

    const handleSort = (key: string) => {
        if (!sortable) return

        setSortConfig((current) => {
            if (current?.key === key) {
                return current.direction === "asc" ? { key, direction: "desc" } : null
            }
            return { key, direction: "asc" }
        })
    }

    const renderCellContent = (column: ColumnDefinition, value: any, row: any) => {
        if (column.render) {
            return column.render(value, row)
        }

        switch (column.type) {
            case "image":
                return (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={value || "/placeholder.svg"} alt={row.name || "Avatar"} />
                        <AvatarFallback>{(row.name || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                )
            case "badge":
                let displayValue = value
                let badgeVariant: any = column.badgeVariant || "default"
                let customClasses = "capitalize border-none rounded-full py-1 px-4"

                if (typeof value === "boolean") {
                    displayValue = value ? "Active" : "Inactive"
                    badgeVariant = "custom"

                    // Apply custom classes for active/inactive
                    customClasses += value
                        ? " text-[#1F9254] bg-[#EBF9F1]"
                        : " text-[#FF8285] bg-[#FBE7E8]"
                } else if (column.badgeColorMap) {
                    badgeVariant = column.badgeColorMap[value] || column.badgeVariant || "default"
                }

                return (
                    <Badge variant={badgeVariant} className={customClasses}>
                        {displayValue}
                    </Badge>
                )
            case "actions":
                return (
                    <div className="flex items-center gap-1">
                        {actions.map((action) => (
                            <Button
                                key={action.id}
                                variant={action.variant || "ghost"}
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    action.onClick(row)
                                }}
                                className={action.className}
                                aria-label={action.label}
                            >
                                {action.icon}
                            </Button>
                        ))}
                    </div>
                )
            case "date":
                return new Date(value).toLocaleDateString()
            case "number":
                return typeof value === "number" ? value.toLocaleString() : value
            default:
                return value
        }
    }

    const getSortIcon = (columnKey: string) => {
        if (!sortable || !sortConfig || sortConfig.key !== columnKey) {
            return null
        }
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
        )
    }

    if (loading) {
        return (
            <div className="w-full p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className={`w-full ${className}`}>
            {/* Table */}
            <div className="">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${headerClassName}`}>
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-4 py-3 text-left text-sm font-semibold text-black ${column.sortable !== false && sortable ? "cursor-pointer hover:text-foreground" : ""
                                            } ${column.className || ""}`}
                                        style={{ width: column.width }}
                                        onClick={() => column.sortable !== false && handleSort(column.key)}
                                    >
                                        <div className="flex items-center">
                                            {column.label}
                                            {column.sortable !== false && getSortIcon(column.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, index) => (
                                    <tr
                                        key={row.id || index}
                                        className={`transition-colors ${index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-[#FFFFFF]"
                                            } ${onRowClick ? "cursor-pointer" : ""} ${rowClassName}`}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className={`px-4 py-3 text-sm ${column.className || ""}`}>
                                                {renderCellContent(column, row[column.key], row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {paginated && paginatedData.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Show</span>
                        <Select
                            value={currentPageSize.toString()}
                            onValueChange={(value) => {
                                setCurrentPageSize(Number(value))
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>entries</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNumber = i + 1
                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className="w-10"
                                >
                                    {pageNumber}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
