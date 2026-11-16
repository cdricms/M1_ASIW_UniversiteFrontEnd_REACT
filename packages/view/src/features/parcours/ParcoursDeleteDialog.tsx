import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import useApi from "@/lib/useApi"
import type { Parcours } from "@/types/types"

interface ParcoursDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parcours: Parcours
  onSuccess?: () => void
}

export function ParcoursDeleteDialog({
  open,
  onOpenChange,
  parcours,
  onSuccess,
}: ParcoursDeleteDialogProps) {
  const { submit, loading } = useApi<{ message: string }, void>(
    `/parcours/${parcours.id}`,
    { method: "DELETE" },
  )

  const onConfirm = async () => {
    const res = await submit()
    if (!res) {
      toast.add({ title: "La suppression a échoué.", type: "error" })
      return // le dialogue reste ouvert pour pouvoir réessayer
    }
    toast.add({ title: `Parcours « ${parcours.nomParcours} » supprimé.`, type: "success" })
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le parcours ?</DialogTitle>
          <DialogDescription>
            Le parcours « {parcours.nomParcours} » sera définitivement supprimé.
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={loading} />}>
            Annuler
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Suppression…" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
