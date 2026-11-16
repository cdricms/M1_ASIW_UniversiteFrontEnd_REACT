import { EditIcon, EllipsisIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Parcours } from "@/types/types"
import { ParcoursDeleteDialog } from "./ParcoursDeleteDialog"
import { ParcoursFormDialog } from "./ParcoursFormDialog"

interface ParcoursActionsProps {
  parcours: Parcours
  onChanged?: () => void
}

export function ParcoursActions({ parcours, onChanged }: ParcoursActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions pour ${parcours.nomParcours}`}
            >
              <EllipsisIcon />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <EditIcon />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <TrashIcon />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* En dehors du menu : sinon les dialogues seraient démontés à sa fermeture */}
      <ParcoursFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        parcours={parcours}
        onSuccess={onChanged}
      />
      <ParcoursDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        parcours={parcours}
        onSuccess={onChanged}
      />
    </>
  )
}
