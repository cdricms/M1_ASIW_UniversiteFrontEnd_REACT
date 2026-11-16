import type { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, CreditCardIcon, DeleteIcon, Edit2Icon, EditIcon, EllipsisIcon, LogOutIcon, SettingsIcon, TrashIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Parcours } from "@/types/types"
import type { features } from "@/lib/parcours-table.features"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./dropdown-menu"

type F = typeof features

function SortableHeader({
  column,
  title,
}: {
  column: Column<F, Parcours>
  title: string
}) {
  const sorted = column.getIsSorted() // false | "asc" | "desc"
  return (
    <Button
      variant="ghost"
      className="-ml-3"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp />
      ) : sorted === "desc" ? (
        <ArrowDown />
      ) : (
        <ArrowUpDown />
      )}
    </Button>
  )
}

export const parcoursColumns: ColumnDef<F, Parcours>[] = [
  {
    accessorKey: "nomParcours",
    header: ({ column }) => <SortableHeader column={column} title="Nom" />,
  },
  {
    accessorKey: "anneeFormation",
    header: ({ column }) => (
      <SortableHeader column={column} title="Année de formation" />
    ),
    // colonne réduite à la largeur de l'en-tête, valeurs alignées à droite dessous
    meta: { className: "text-left" },
    filterFn: (row, id, value) => String(row.getValue(id)) === value,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <SortableHeader column={column} title="Créé le" />,
    cell: ({ row }) =>
      new Date(row.getValue<string>("created_at")).toLocaleDateString("fr-FR"),
  },
  {
    id: "actions",                 // pas d'accessorKey : aucune donnée liée
    header: "Actions",
    enableSorting: false,
    enableGlobalFilter: false,     // la recherche ignore cette colonne
    cell: ({ row }) => {
      const parcours = row.original   // l'objet Parcours complet de la ligne
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button
            variant="ghost"
            size="icon"
            aria-label={`Actions pour ${parcours.nomParcours}`}
            onClick={() => console.log("Actions", parcours.id)}
          >
            <EllipsisIcon />
          </Button>} />
          <DropdownMenuContent>
             <DropdownMenuItem>
              <EditIcon />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <TrashIcon />
                Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
