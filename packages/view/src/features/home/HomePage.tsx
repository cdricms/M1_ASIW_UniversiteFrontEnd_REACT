import { PageContainer, PageHeader } from "@/components/layout/Page"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@base-ui/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const parcoursSchema = z.object({
  nomParcours: z.string().trim().min(1, "Le nom du parcours est obligatoire"),
  anneeFormation: z.union([z.literal(1), z.literal(2)]),
})

type Parcours = z.infer<typeof parcoursSchema>

export function HomePage() {
  const form = useForm<Parcours>({
    resolver: zodResolver(parcoursSchema),
    defaultValues: {
      nomParcours: "",
      anneeFormation: 1,
    },
  })

  const submit = async (parcours: Parcours) => {
    try {
      console.log("Parcours à créer :", parcours)

      // await useApi("/parcours", {
      //   method: "POST",
      //   data: parcours,
      // })

      form.reset()
    } catch (error) {
      console.error("Erreur lors de la création du parcours :", error)
    }
  }

  return (
    <PageContainer>
      <div className="flex w-full flex-row items-center justify-between">
        <PageHeader
          title="Gestion des parcours & notes"
          description="Bienvenue sur l'espace de gestion de l'UPJV."
        />

        <Dialog>
          <DialogTrigger render={<Button>Créer un parcours</Button>} />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un parcours</DialogTitle>
              <DialogDescription>
                Renseignez le nom du parcours et son année de formation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(submit)}>
              <FieldGroup>
                <Field>
                  <Label htmlFor="nomParcours">Nom du parcours</Label>
                  <Input
                    id="nomParcours"
                    {...form.register("nomParcours")}
                  />
                  {form.formState.errors.nomParcours && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.nomParcours.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="anneeFormation">
                    Année de formation
                  </Label>
                  <select
                    id="anneeFormation"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    {...form.register("anneeFormation", {
                      setValueAs: (value) => Number(value),
                    })}
                  >
                    <option value={1}>1ère année</option>
                    <option value={2}>2ème année</option>
                  </select>
                  {form.formState.errors.anneeFormation && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.anneeFormation.message}
                    </p>
                  )}
                </Field>

                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? "Création..."
                      : "Créer le parcours"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  )
}
