import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@base-ui/react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import useApi from "@/lib/useApi"
import type { Parcours, ParcoursForm, ParcoursResponse } from "@/types/types"

const parcoursSchema = z.object({
  nomParcours: z.string().trim().min(1, "Le nom du parcours est obligatoire"),
  anneeFormation: z.union([z.literal(1), z.literal(2)]),
})

export const ANNEE_FORMATION_ITEMS = [
  { value: 1, label: "M1" },
  { value: 2, label: "M2" },
] as const

const EMPTY_FORM: ParcoursForm = { nomParcours: "", anneeFormation: 1 }

interface ParcoursFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Absent : création (POST). Présent : modification (PUT). */
  parcours?: Parcours
  onSuccess?: (parcours: Parcours) => void
}

export function ParcoursFormDialog({
  open,
  onOpenChange,
  parcours,
  onSuccess,
}: ParcoursFormDialogProps) {
  const isEdit = parcours !== undefined

  const form = useForm<ParcoursForm>({
    resolver: zodResolver(parcoursSchema),
    defaultValues: EMPTY_FORM,
  })

  // Remplit (édition) ou vide (création) le formulaire à chaque ouverture
  useEffect(() => {
    if (!open) return
    form.reset(
      parcours
        ? {
            nomParcours: parcours.nomParcours,
            anneeFormation: parcours.anneeFormation,
          }
        : EMPTY_FORM,
    )
  }, [open, parcours, form])

  // Seules la route et la méthode dépendent du mode
  const { submit, error } = useApi<ParcoursResponse, ParcoursForm>(
    isEdit ? `/parcours/${parcours.id}` : "/parcours",
    { method: isEdit ? "PUT" : "POST" },
  )

  useEffect(() => {
    if (error) toast.add({ title: error })
  }, [error])

  const onSubmit = async (values: ParcoursForm) => {
    const res = await submit(values)
    if (!res) return // erreur : on laisse le dialogue ouvert
    toast.add({ title: res.message })
    onSuccess?.(res.parcours)
    onOpenChange(false)
  }

  const { isSubmitting, errors } = form.formState

  // En édition : rien à enregistrer tant que le nom n'a pas changé
  const nomParcours = form.watch("nomParcours")
  const nomInchange =
    isEdit && nomParcours.trim() === parcours.nomParcours.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le parcours" : "Créer un parcours"}
          </DialogTitle>
          <DialogDescription>
            Renseignez le nom du parcours et son année de formation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label htmlFor="nomParcours">Nom du parcours</Label>
              <Input
                className="border rounded-md p-1 pl-2.5"
                id="nomParcours"
                {...form.register("nomParcours")}
              />
              {errors.nomParcours && (
                <p className="text-sm text-destructive">
                  {errors.nomParcours.message}
                </p>
              )}
            </Field>

            <Controller
              control={form.control}
              name="anneeFormation"
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="anneeFormation">Année de formation</Label>
                  <Select
                    items={ANNEE_FORMATION_ITEMS}
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger
                      id="anneeFormation"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="Choisir l'année" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNEE_FORMATION_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isSubmitting || nomInchange}>
                {isSubmitting
                  ? "Enregistrement…"
                  : isEdit
                    ? "Enregistrer"
                    : "Créer le parcours"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
