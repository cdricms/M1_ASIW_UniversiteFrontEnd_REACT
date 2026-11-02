import { ChevronDownIcon } from "lucide-react"
import { useMemo } from "react"
import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { features } from "@/lib/parcours-table.features"

// Classes partagées par l'en-tête et les cellules d'une colonne (via `meta.className`)
function columnClassName(columnDef: { meta?: unknown }) {
  return (columnDef.meta as { className?: string } | undefined)?.className
}

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[]
  data: TData[]
  filterColumn?: { id: string; label: string }
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  filterColumn,
}: DataTableProps<TData>) {
  const table = useTable<typeof features, TData>({
    features,
    columns,
    data,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const filterCol = filterColumn ? table.getColumn(filterColumn.id) : undefined

  const filterOptions = useMemo(() => {
    if (!filterColumn) return []
    const values = data.map((d) =>
      String((d as Record<string, unknown>)[filterColumn.id]),
    )
    return Array.from(new Set(values)).sort()
  }, [data, filterColumn])

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Rechercher…"
          value={table.state.globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {filterCol && (
          <div className="relative">
            <select
              className="h-9 appearance-none rounded-md border bg-background pl-3 pr-8 text-sm"
              value={(filterCol.getFilterValue() as string) ?? ""}
              onChange={(e) =>
                filterCol.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">{filterColumn!.label} : toutes</option>
              {filterOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={columnClassName(header.column.columnDef)}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={columnClassName(cell.column.columnDef)}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} résultat(s)
        </span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="h-9 appearance-none rounded-md border bg-background pl-2 pr-8 text-sm"
              value={table.state.pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <span className="text-sm">
            Page {table.state.pagination.pageIndex + 1} sur{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
