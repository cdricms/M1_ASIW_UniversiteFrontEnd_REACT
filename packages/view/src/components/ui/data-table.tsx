import { useMemo } from "react"
import { useTable, type Column, type ColumnDef, type RowData } from "@tanstack/react-table"
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const pageSizeItems = [10, 20, 50].map((n) => ({ label: `${n} / page`, value: n }))

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
          <SelectAnneeParcours items={filterOptions} filterCol={filterCol} />
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-md bg-card border">
        <Table>
          <TableHeader
            className='bg-black text-white rounded-md hover:bg-black'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-black">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-white pl-5 first:rounded-tl-md last:rounded-tr-md ${columnClassName(header.column.columnDef)}`}
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
                      className={`pl-5 ${columnClassName(cell.column.columnDef)}`}
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
          <Select
            items={pageSizeItems}
            value={table.state.pagination.pageSize}
            onValueChange={(v) => v != null && table.setPageSize(Number(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
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




export function SelectAnneeParcours<T extends RowData>({items, filterCol}: {items: string[], filterCol: Column<typeof features, T>}) {
const allItems = [{ label: "Toute", value: null }, ...items.map((item) => ({ label: item, value: item }))]

  return (
    <Select 
      items={allItems}
      value={(filterCol.getFilterValue() as string | undefined) ?? null}
      onValueChange={(e) =>
        filterCol.setFilterValue(e ?? undefined)
      }>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allItems.map((item) => (
            <SelectItem key={item.value ?? "__all__"} value={item.value}>
              Année : {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

