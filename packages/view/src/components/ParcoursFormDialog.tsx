import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@base-ui/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import useApi from "@/lib/useApi"
import type { Parcours, ParcoursForm, ParcoursResponse } from "@/types/types"

const parcoursSchema = z.object({
  nomParcours: z.string().trim().min(1, "Le nom du parcours est obligatoire"),
  anneeFormation: z.union([z.literal(1), z.literal(2)]),
})

export const ANNEE_FORMATION = { 1: "M1", 2: "M2" } as const

const EMPTY_FORM: ParcoursForm = { nomParcours: "", anneeFormation: 1 }

interface ParcoursFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parcours?: Parcours            // absent = création, présent = modification
  onSuccess?: (p: Parcours) => void
}

export function ParcoursFormDialog({ open, onOpenChange, parcours, onSuccess }: ParcoursFormDialogProps) {
  const isEdit = parcours !== undefined

  const form = useForm<ParcoursForm>({
    resolver: zodResolver(parcoursSchema),
    defaultValues: EMPTY_FORM,
  })

  // Remplit (ou vide) le formulaire à chaque ouverture
  useEffect(() => {
    if (open) {
      form.reset(
        parcours
          ? { nomParcours: parcours.nomParcours, anneeFormation: parcours.anneeFormation }
          : EMPTY_FORM,
      )
    }
  }, [open, parcours, form])

  // Seules la route et la méthode changent selon le mode
  const { submit, error } = useApi<ParcoursResponse, ParcoursForm>(
    isEdit ? `/parcours/${parcours.id}` : "/parcours",
    { method: isEdit ? "PUT" : "POST" },
  )

  const onSubmit = async (values: ParcoursForm) => {
    const res = await submit(values)
    if (!res) return                         // en cas d'erreur, le dialogue reste ouvert
    toast.add({ title: res.message })
    onSuccess?.(res.parcours)
    onOpenChange(false)
  }

  useEffect(() => {
    if (error) toast.add({ title: error })
  }, [error])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le parcours" : "Créer un parcours"}</DialogTitle>
          <DialogDescription>Renseignez le nom du parcours et son année de formation.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* … tes deux champs nomParcours / anneeFormation, inchangés … */}

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Enregistrement…"
                  : isEdit ? "Enregistrer" : "Créer le parcours"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}