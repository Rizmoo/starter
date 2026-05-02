import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Search, Download, ChevronRight } from "lucide-react"

import { Button } from "@/Components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Input } from "@/Components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Card, CardContent, CardFooter } from "@/Components/ui/card"
import { cn } from "@/Lib/utils"
import { exportTableToPDF } from "@/Lib/pdf-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Helper function to extract column header text
function extractColumnHeader(columnDef, column) {
  if (typeof columnDef.header === 'string') {
    return columnDef.header;
  }
  if (column && column.columnDef.meta?.title) {
    return column.columnDef.meta.title;
  }
  const accessorKey = columnDef.accessorKey;
  const id = columnDef.id;
  const formatHeader = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };
  if (accessorKey) return formatHeader(accessorKey);
  if (id && id !== 'actions' && id !== 'select') return formatHeader(id);
  return 'Field';
}

function getColumnPriority(
  column,
  index,
  primaryColumns
) {
  const columnId = column.id;
  const accessorKey = column.columnDef.accessorKey;
  if (columnId === 'actions') return 'action';
  if (columnId === 'select') return 'select';
  if (primaryColumns && (primaryColumns.includes(columnId) || (accessorKey && primaryColumns.includes(accessorKey)))) {
    return 'primary';
  }
  const primaryPatterns = ['name', 'title', 'number', 'id', 'code', 'reference'];
  const idOrKey = columnId || accessorKey || '';
  const lowerId = idOrKey.toLowerCase();
  if (primaryPatterns.some(pattern => lowerId.includes(pattern))) return 'primary';
  const secondaryPatterns = ['amount', 'total', 'price', 'balance', 'date', 'status', 'type', 'email', 'phone'];
  if (secondaryPatterns.some(pattern => lowerId.includes(pattern))) return 'secondary';
  if (index < 3) return 'secondary';
  return 'tertiary';
}

// ─── Mobile List View ───────────────────────────────────────────────
function MobileListView({
  rows, columns, isLoading, onRowClick, primaryColumns, maxSecondaryFields = 4,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <div className="text-center text-muted-foreground py-16 md:hidden">No results.</div>;
  }

  return (
    <div className="space-y-3 md:hidden">
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const primaryCells = [];
        const secondaryCells = [];
        const tertiaryCells = [];
        let actionCell = null;
        let selectCell = null;

        cells.forEach((cell, index) => {
          const priority = getColumnPriority(cell.column, index, primaryColumns);
          switch (priority) {
            case 'primary': primaryCells.push(cell); break;
            case 'secondary': secondaryCells.push(cell); break;
            case 'tertiary': tertiaryCells.push(cell); break;
            case 'action': actionCell = cell; break;
            case 'select': selectCell = cell; break;
          }
        });

        const displaySecondary = secondaryCells.slice(0, maxSecondaryFields);
        const hasMoreFields = secondaryCells.length > maxSecondaryFields || tertiaryCells.length > 0;

        const handleCardClick = (e) => {
          const target = e.target;
          if (target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('input') || target.closest('select')) return;
          onRowClick?.(row.original);
        };

        return (
          <Card
            key={row.id}
            className={cn("overflow-hidden transition-colors", onRowClick && !actionCell && "cursor-pointer hover:bg-accent/50 active:bg-accent")}
            onClick={onRowClick && !actionCell ? handleCardClick : undefined}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0 space-y-1.5">
                  {primaryCells.length > 0 ? (
                    primaryCells.map((cell) => {
                      const header = extractColumnHeader(cell.column.columnDef, cell.column);
                      const cellValue = flexRender(cell.column.columnDef.cell, cell.getContext());
                      return (
                        <div key={cell.id} className="flex items-center gap-2 flex-wrap">
                          {primaryCells.length > 1 && header && (
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{header}:</span>
                          )}
                          <div className="text-sm font-semibold break-words">{cellValue}</div>
                        </div>
                      );
                    })
                  ) : (
                    cells.length > 0 && cells[0].column.id !== 'actions' && cells[0].column.id !== 'select' && (
                      <div className="text-sm font-semibold">{flexRender(cells[0].column.columnDef.cell, cells[0].getContext())}</div>
                    )
                  )}
                </div>
                {selectCell && (
                  <div className="shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                    {flexRender(selectCell.column.columnDef.cell, selectCell.getContext())}
                  </div>
                )}
              </div>

              {displaySecondary.length > 0 && (
                <div className="space-y-2.5 border-t pt-3">
                  {displaySecondary.map((cell) => {
                    const header = extractColumnHeader(cell.column.columnDef, cell.column);
                    const cellValue = flexRender(cell.column.columnDef.cell, cell.getContext());
                    return (
                      <div key={cell.id} className="flex items-start justify-between gap-2 text-sm">
                        <span className="text-muted-foreground shrink-0 min-w-[100px] text-xs">{header}:</span>
                        <div className="text-right flex-1 min-w-0 break-words">{cellValue}</div>
                      </div>
                    );
                  })}
                  {hasMoreFields && (
                    <div className="text-xs text-muted-foreground pt-1 italic">
                      +{secondaryCells.length - maxSecondaryFields + tertiaryCells.length} more fields
                    </div>
                  )}
                </div>
              )}

              {actionCell && (
                <CardFooter className="p-0 pt-3 mt-3 border-t flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="w-full flex justify-end">
                    <div className="min-h-[44px] flex items-center">
                      {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                    </div>
                  </div>
                </CardFooter>
              )}

              {onRowClick && !actionCell && (
                <div className="flex items-center justify-end mt-2 pt-2 border-t">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── DataTable ──────────────────────────────────────────────────────
export const DataTable = React.forwardRef((
  {
    columns, data, searchKey, searchPlaceholder, initialColumnVisibility = {},
    tableName = "data", onRowClick, meta, onPageChange, onPageLengthChange,
    onSearch, isLoading, pageLength = 15, pageLengthOptions = [15, 30, 50, 100],
    searchValue, mobileListConfig, companyDetails,
  },
  ref
) => {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchTerm, setSearchTerm] = React.useState(searchValue || "");

  React.useEffect(() => {
    if (searchValue !== undefined) setSearchTerm(searchValue);
  }, [searchValue]);

  const pageCount = meta?.last_page ?? -1;
  const [localPageSize, setLocalPageSize] = React.useState(pageLength);

  const table = useReactTable({
    data, columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: !!meta,
    pageCount,
    initialState: {
      pagination: { pageSize: pageLength },
    },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  const columnExists = searchKey && table.getAllColumns().some(c => c.id === searchKey);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      } else if (searchKey && columnExists) {
        table.getColumn(searchKey)?.setFilterValue(searchTerm);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch, searchKey, columnExists, table]);

  const getExportData = () => {
    const visibleColumns = table.getVisibleFlatColumns().filter(
      (col) => !['select', 'actions'].includes(col.id)
    );
    const headers = visibleColumns.map(col => extractColumnHeader(col.columnDef, col));
    const rows = table.getFilteredRowModel().rows.map(row =>
      visibleColumns.map(col => {
        const value = row.getValue(col.id);
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.map(item => typeof item === 'object' && item !== null ? (item.name || String(item)) : String(item)).join(', ');
        if (typeof value === 'object' && value !== null) return value.name || value.title || String(value);
        return String(value);
      })
    );
    return { headers, rows };
  };

  const exportToPdf = async () => {
    const { headers, rows } = getExportData();
    await exportTableToPDF(tableName, headers, rows, companyDetails);
  };

  const exportToExcel = () => {
    const { headers, rows } = getExportData();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const safeTableName = tableName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const formattedDate = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${safeTableName}_${formattedDate}.xlsx`);
  };

  React.useImperativeHandle(ref, () => ({ exportToPdf, exportToExcel }));

  // Pagination helpers
  const isServerPaginated = !!meta && !!onPageChange;
  const currentPage = isServerPaginated ? meta.current_page : table.getState().pagination.pageIndex + 1;
  const totalPages = isServerPaginated ? meta.last_page : table.getPageCount();
  const totalRows = isServerPaginated ? meta.total : table.getFilteredRowModel().rows.length;

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <div className="relative flex-1">
          {(onSearch || (searchKey && columnExists)) && (
            <>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder || `Search ${searchKey || 'data'}...`}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
              />
            </>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={exportToPdf}>
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button variant="outline" size="sm" onClick={exportToExcel}>
          <Download className="mr-2 h-4 w-4" /> Excel
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-card hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">Loading...</TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <MobileListView
        rows={table.getRowModel().rows}
        columns={columns}
        isLoading={isLoading ?? false}
        onRowClick={onRowClick}
        primaryColumns={mobileListConfig?.primaryColumns}
        maxSecondaryFields={mobileListConfig?.maxSecondaryFields}
      />

      {/* Pagination — works for both client-side and server-side */}
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}. Total {totalRows} rows.
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select
            value={String(isServerPaginated ? pageLength : localPageSize)}
            onValueChange={(value) => {
              const newSize = Number(value);
              if (isServerPaginated && onPageLengthChange) {
                onPageLengthChange(newSize);
              } else {
                setLocalPageSize(newSize);
                table.setPageSize(newSize);
              }
            }}
          >
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {pageLengthOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isServerPaginated) {
                  onPageChange(currentPage - 1);
                } else {
                  table.previousPage();
                }
              }}
              disabled={isServerPaginated ? currentPage === 1 : !table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isServerPaginated) {
                  onPageChange(currentPage + 1);
                } else {
                  table.nextPage();
                }
              }}
              disabled={isServerPaginated ? currentPage === totalPages : !table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

DataTable.displayName = "DataTable"
