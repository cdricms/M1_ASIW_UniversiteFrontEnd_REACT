import { EditIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-black hover:text-white"
          aria-label={`Modifier ${parcours.nomParcours}`}
          onClick={() => setEditOpen(true)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive hover:text-white"
          aria-label={`Supprimer ${parcours.nomParcours}`}
          onClick={() => setDeleteOpen(true)}
        >
          <TrashIcon />
        </Button>
      </div>

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
