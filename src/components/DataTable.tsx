import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataTableProps, SortState, SortDirection } from '@/types/table';

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    actions = [],
    searchable = true,
    searchPlaceholder = "Search...",
    sortable = true,
    pagination = true,
    pageSize = 10,
    className,
    loading = false,
    emptyMessage = "No data found."
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((row: any) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortState.column || !sortState.direction) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortState.column!];
            const bValue = b[sortState.column!];

            if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortState]);

    // Paginate data
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (columnKey: string, columnSortable: boolean | undefined) => {
        if (!sortable || columnSortable === false) return;

        setSortState((prev: any) => {
            if (prev.column === columnKey) {
                const newDirection: SortDirection =
                    prev.direction === 'asc' ? 'desc' :
                        prev.direction === 'desc' ? null : 'asc';
                return { column: newDirection ? columnKey : null, direction: newDirection };
            }
            return { column: columnKey, direction: 'asc' };
        });
    };

    const getSortIcon = (columnKey: string) => {
        if (sortState.column !== columnKey) return <ArrowUpDown className="w-4 h-4" />;
        if (sortState.direction === 'asc') return <ArrowUp className="w-4 h-4" />;
        if (sortState.direction === 'desc') return <ArrowDown className="w-4 h-4" />;
        return <ArrowUpDown className="w-4 h-4" />;
    };

    const renderCell = (column: any, row: T, index: number) => {
        if (column.cell) {
            return column.cell(row);
        }

        if (column.render) {
            return column.render(row[column.key], row, index);
        }

        return row[column.key];
    };

    const LoadingSkeleton = () => (
        <>
            {Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                    {columns.map((column: any) => (
                        <TableCell key={column.key}>
                            <Skeleton className="h-6 w-full" />
                        </TableCell>
                    ))}
                    {actions.length > 0 && (
                        <TableCell>
                            <Skeleton className="h-8 w-16" />
                        </TableCell>
                    )}
                </TableRow>
            ))}
        </>
    );

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search Bar */}
            {searchable && (
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="border-0 border-b border-gray-200 hover:bg-white">
                            {columns.map((column: any) => (
                                <TableHead
                                    key={column.key}
                                    className={cn(
                                        "font-semibold text-gray-900 py-4 border-0",
                                        column.width && `w-${column.width}`,
                                        column.align === 'center' && 'text-center',
                                        column.align === 'right' && 'text-right',
                                        sortable && column.sortable !== false && 'cursor-pointer '
                                    )}
                                    onClick={() => handleSort(column.key, column.sortable)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{column.header}</span>
                                        {sortable && column.sortable !== false && getSortIcon(column.key)}
                                    </div>
                                </TableHead>
                            ))}
                            {actions.length > 0 && (
                                <TableHead className="w-20 text-center font-semibold text-gray-900 border-0">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <LoadingSkeleton />
                        ) : paginatedData.length === 0 ? (
                            <TableRow className="border-0 hover:bg-white">
                                <TableCell
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                    className="text-center py-8 text-gray-500 border-0"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((row: any, index: number) => (
                                <TableRow key={index} className="border-0 hover:bg-white">
                                    {columns.map((column: any) => (
                                        <TableCell
                                            key={column.key}
                                            className={cn(
                                                "py-4 border-0",
                                                column.align === 'center' && 'text-center',
                                                column.align === 'right' && 'text-right'
                                            )}
                                        >
                                            {renderCell(column, row, index)}
                                        </TableCell>
                                    ))}
                                    {actions.length > 0 && (
                                        <TableCell className="text-center border-0">
                                            {actions.length === 1 ? (
                                                <Button
                                                    variant={actions[0].variant || 'outline'}
                                                    size="sm"
                                                    onClick={() => actions[0].onClick(row)}
                                                    className="h-8"
                                                >
                                                    {actions[0].icon}
                                                    {actions[0].label}
                                                </Button>
                                            ) : (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {actions.map((action: any, actionIndex: number) => (
                                                            <DropdownMenuItem
                                                                key={actionIndex}
                                                                onClick={() => action.onClick(row)}
                                                                className="cursor-pointer"
                                                            >
                                                                {action.icon}
                                                                {action.label}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className="w-8 h-8"
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}