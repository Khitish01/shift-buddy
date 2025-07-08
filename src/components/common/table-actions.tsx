
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Helper components for common table actions and renders
export const TableActions = {
  // Common action generators
  editAction: <T,>(onEdit: (row: T) => void) => ({
    label: 'Edit',
    onClick: onEdit,
    variant: 'outline' as const,
    icon: <Edit className="w-4 h-4 mr-1" />
  }),

  deleteAction: <T,>(onDelete: (row: T) => void) => ({
    label: 'Delete',
    onClick: onDelete,
    variant: 'destructive' as const,
    icon: <Trash2 className="w-4 h-4 mr-1" />
  }),

  viewAction: <T,>(onView: (row: T) => void) => ({
    label: 'View',
    onClick: onView,
    variant: 'ghost' as const,
    icon: <Eye className="w-4 h-4 mr-1" />
  }),
};

// Common cell renderers
export const CellRenderers = {
  // Badge renderer for status-like fields
  badge: (variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default') =>
    (value: any) => (
      <Badge variant={variant} className="capitalize">
        {value === true ? 'Active' : 'InActive'}
      </Badge>
    ),

  // Currency formatter
  currency: (value: number) => (
    <span className="font-medium">
      ${value?.toLocaleString()}
    </span>
  ),

  // Number formatter
  number: (value: number) => (
    <span className="font-mono">
      {value?.toLocaleString()}
    </span>
  ),

  // Truncated text with tooltip
  truncatedText: (maxLength: number = 30) => (value: string) => (
    <span title={value} className="truncate block max-w-xs">
      {value?.length > maxLength ? `${value.substring(0, maxLength)}...` : value}
    </span>
  ),

  // Date formatter
  date: (value: string | Date) => {
    const date = new Date(value);
    return <span>{date?.toLocaleDateString()}</span>;
  },

  // Boolean as Yes/No
  boolean: (value: boolean) => (
    <Badge variant={value ? 'default' : 'secondary'}>
      {value ? 'Yes' : 'No'}
    </Badge>
  )
};