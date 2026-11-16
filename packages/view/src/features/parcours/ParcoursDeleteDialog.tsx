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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import useApi from "@/lib/useApi"
import type { Parcours } from "@/types/types"
import { useState } from "react"

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
  const [nomConfirmation, setNomConfirmation] = useState("")

  const { submit, loading } = useApi<{ message: string }, void>(
    `/parcours/${parcours.id}`,
    { method: "DELETE" },
  )

  const onConfirm = async () => {
    if (nomConfirmation !== parcours.nomParcours) {return}
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
        <Field data-invalid={nomConfirmation !== parcours.nomParcours}>
          <FieldLabel htmlFor="input-confirmation">Entrez le nom du parcours pour confirmer la suppression.</FieldLabel>
          <Input id="input-confirmation" placeholder={parcours.nomParcours}
            value={nomConfirmation}
            onChange={(e) => {setNomConfirmation(e.target.value)}} 
            aria-invalid={nomConfirmation !== parcours.nomParcours} />
          <FieldDescription>
            {nomConfirmation !== parcours.nomParcours && (
              <span className="text-destructive">Le nom saisi ne correspond pas.</span>
            )}
          </FieldDescription>
        </Field>
        
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={loading} />}>
            Annuler
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} disabled={loading || nomConfirmation !== parcours.nomParcours}>
            {loading ? "Suppression…" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
