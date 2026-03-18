"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  error?: string;
  onSortingChange?: (sorting: SortingState) => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  currentPage?: number;
  itemsPerPage?: number;
  total?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  meta?: Record<string, any>;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: RowSelectionState) => void;
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  error,
  onSortingChange,
  onPageChange,
  onItemsPerPageChange,
  currentPage = 1,
  itemsPerPage = 20,
  total,
  manualPagination = true,
  manualSorting = true,
  meta,
  enableRowSelection = false,
  onRowSelectionChange,
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination,
    manualSorting,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
      onPageChange?.(newState.pageIndex + 1);
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      onRowSelectionChange?.(newSelection);
    },
    state: {
      sorting,
      rowSelection,
    },
    meta,
  });

  const totalPages = total ? Math.ceil(total / itemsPerPage) : table.getPageCount();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100">
                {enableRowSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                      aria-label="Tout sélectionner"
                      className="border-slate-300 data-[state=checked]:bg-vital-green data-[state=checked]:border-vital-green"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-500 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  {enableRowSelection && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Sélectionner la ligne"
                        className="border-slate-300 data-[state=checked]:bg-vital-green data-[state=checked]:border-vital-green"
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-slate-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center text-slate-400"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-xs text-slate-500">
          {total !== undefined ? (
            <div className="flex flex-col gap-0.5">
              <div><span className="text-vital-green font-bold">{Object.keys(rowSelection).length}</span> sur {data.length} ligne(s) sélectionnée(s)</div>
              <div>Affichage de <span className="text-slate-900 font-medium">{data.length}</span> sur {total} résultat(s)</div>
            </div>
          ) : (
            <div><span className="text-vital-green font-bold">{Object.keys(rowSelection).length}</span> sur {data.length} ligne(s) sélectionnée(s)</div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Lignes par page</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-vital-green/50"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1);
                onPageChange?.(newPage);
              }}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </Button>
            
            <span className="text-xs text-slate-500">
              Page <span className="text-slate-900 font-medium">{currentPage}</span> sur {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.min(totalPages, currentPage + 1);
                onPageChange?.(newPage);
              }}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
