"use client"

import type React from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface TableAction {
    id: string
    label: string
    icon?: React.ReactNode
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
    badgeColorMap?: Record<string, string>
}

export interface SortConfig {
    column: string
    direction: "asc" | "desc"
}

export interface DataTableProps {
    data: any[]
    columns: ColumnDefinition[]
    actions?: TableAction[] | ((row: any) => TableAction[])
    sortable?: boolean
    paginated?: boolean
    currentPage: number
    pageSize: number
    totalCount: number
    sortConfig?: SortConfig | null
    pageSizeOptions?: number[]
    className?: string
    rowClassName?: string
    headerClassName?: string
    onRowClick?: (row: any) => void
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    onSortChange?: (sortConfig: SortConfig | null) => void
    loading?: boolean
    emptyMessage?: string
}

export function DataTable({
    data,
    columns,
    actions = [],
    sortable = true,
    paginated = true,
    currentPage,
    pageSize,
    totalCount,
    sortConfig,
    pageSizeOptions = [5, 10, 20, 50],
    className = "",
    rowClassName = "",
    headerClassName = "",
    onRowClick,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    loading = false,
    emptyMessage = "No data available",
}: DataTableProps) {
    const totalPages = Math.ceil(totalCount / pageSize)

    const handleSort = (key: string) => {
        if (!sortable || !onSortChange) return

        let newSortConfig: SortConfig | null = null

        if (sortConfig?.column === key) {
            // If clicking the same column, toggle direction or clear sort
            if (sortConfig.direction === "asc") {
                newSortConfig = { column: key, direction: "desc" }
            } else {
                newSortConfig = null // Clear sort
            }
        } else {
            // New column, start with ascending
            newSortConfig = { column: key, direction: "asc" }
        }

        onSortChange(newSortConfig)
    }

    const handlePageChange = (page: number) => {
        if (onPageChange && page !== currentPage) {
            onPageChange(page)
        }
    }

    const handlePageSizeChange = (newPageSize: string) => {
        const size = Number(newPageSize)
        if (onPageSizeChange && size !== pageSize) {
            onPageSizeChange(size)
            // Reset to first page when changing page size
            if (onPageChange) {
                onPageChange(1)
            }
        }
    }

    const getValueByKey = (obj: any, key: string): any => {
        if (!obj || !key) return undefined;
        if (!key.includes(".")) return obj[key]; // direct key
        return key.split(".").reduce((acc, part) => acc?.[part], obj);
    };

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
                    customClasses += value ? " text-[#1F9254] bg-[#EBF9F1]" : " text-[#FF8285] bg-[#FBE7E8]"
                } else if (column.badgeColorMap) {
                    const colorConfig = column.badgeColorMap[value]
                    if (colorConfig) {
                        badgeVariant = "custom"
                        customClasses += ` ${colorConfig}`
                    }
                }

                return (
                    <Badge variant={badgeVariant} className={customClasses}>
                        {displayValue}
                    </Badge>
                )
            case "actions": {
                const rowActions = typeof actions === "function" ? actions(row) : actions

                return (
                    <div className="flex items-center gap-2">
                        {rowActions.map((action, idx) => (
                            <Button
                                key={idx}
                                variant={action.variant || "ghost"}
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    action.onClick(row)
                                }}
                                className={`px-4 py-1 rounded-md text-sm font-medium ${action.className || ''}`}
                                aria-label={action.label}
                            >
                                {action.icon ? action.icon : action.label}
                            </Button>
                        ))}
                    </div>
                )
            }
            case "date":
                return new Date(value).toLocaleDateString()
            case "number":
                return typeof value === "number" ? value.toLocaleString() : value
            default:
                return value
        }
    }

    const getSortIcon = (columnKey: string) => {
        if (!sortable || !sortConfig || sortConfig.column !== columnKey) {
            return null
        }
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
        )
    }

    const getVisiblePageNumbers = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...")
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages)
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
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
                                {columns.map((column, idx) => (
                                    <th
                                        key={idx}
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
                            {data?.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data?.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`transition-colors ${index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-[#FFFFFF]"
                                            } ${onRowClick ? "cursor-pointer" : ""} ${rowClassName}`}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column, idx) => (
                                            <td key={idx} className={`px-4 py-3 text-sm ${column.className || ""}`}>
                                                {renderCellContent(column, getValueByKey(row, column.key) ?? '-', row)}
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
            {paginated && totalCount > 0 && (
                <div className="mt-4">
                    {/* Desktop View */}
                    <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Show</span>
                            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map((size, idx) => (
                                        <SelectItem key={idx} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span>entries</span>
                            <span className="ml-4">
                                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                                {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            {getVisiblePageNumbers().map((pageNumber, index) =>
                                pageNumber === "..." ? (
                                    <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber as number)}
                                        className="w-10"
                                    >
                                        {pageNumber}
                                    </Button>
                                )
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="flex flex-col md:hidden gap-3 text-sm text-muted-foreground">
                        <div className="flex justify-between items-center">
                            <span>
                                Showing {(currentPage - 1) * pageSize + 1} -{" "}
                                {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                            </span>
                            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                <SelectTrigger className="w-20 text-xs h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map((size, idx) => (
                                        <SelectItem key={idx} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex-1"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Prev
                            </Button>

                            <div className="flex items-center overflow-x-auto gap-1 px-2 scrollbar-hide">
                                {getVisiblePageNumbers().map((pageNumber, index) =>
                                    pageNumber === "..." ? (
                                        <span
                                            key={`dots-mobile-${index}`}
                                            className="px-2 text-muted-foreground"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <Button
                                            key={`mobile-${pageNumber}`}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNumber as number)}
                                            className="min-w-[2rem] px-2"
                                        >
                                            {pageNumber}
                                        </Button>
                                    )
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex-1"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    )
}
