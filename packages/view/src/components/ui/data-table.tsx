import { useMemo } from "react";
import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { features } from "@/pages/parcours/parcours-table.features"; // adapte le chemin

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[];
  data: TData[];
  /** Colonne dont on propose un filtre par valeur (liste déroulante) */
  filterColumn?: { id: string; label: string };
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  filterColumn,
}: DataTableProps<TData>) {
  // v9 gère sorting / filtres / pagination en interne
  const table = useTable<typeof features, TData>({
    features,
    columns,
    data,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const filterCol = filterColumn ? table.getColumn(filterColumn.id) : undefined;

  // valeurs uniques calculées depuis les données
  const filterOptions = useMemo(() => {
    if (!filterColumn) return [];
    const values = data.map((d) =>
      String((d as Record<string, unknown>)[filterColumn.id]),
    );
    return Array.from(new Set(values)).sort();
  }, [data, filterColumn]);

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
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={(filterCol.getFilterValue() as string) ?? ""}
            onChange={(e) => filterCol.setFilterValue(e.target.value || undefined)}
          >
            <option value="">{filterColumn!.label} : toutes</option>
            {filterOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
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
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
          <select
            className="h-9 rounded-md border bg-background px-2 text-sm"
            value={table.state.pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
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
  );
}