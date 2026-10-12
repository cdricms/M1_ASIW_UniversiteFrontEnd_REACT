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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import useApi from "@/lib/useApi"
import type { Parcours, ParcoursResponse } from "@/types/types"
import { Input } from "@base-ui/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const parcoursSchema = z.object({
  nomParcours: z.string().trim().min(1, "Le nom du parcours est obligatoire"),
  anneeFormation: z.union([z.literal(1), z.literal(2)]),
})

const ANNEE_FORMATION = {
  1: "M1",
  2: "M2",
}

export function HomePage() {
  const form = useForm<Parcours>({
    resolver: zodResolver(parcoursSchema),
    defaultValues: {
      nomParcours: "",
      anneeFormation: 1,
    },
  })

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { error, data, loading, submit } = useApi<ParcoursResponse, Parcours>(
    "/parcours",
    {
      method: "POST",
    },
  )

  const onSubmit = async () => {
    const res = await submit(form.getValues())
    if (res) toast.add({ title: res?.message })
    setDialogOpen(false)
  }

  useEffect(() => {
    if (error) toast.add({ title: error })
    setDialogOpen(false)
  }, [error])

  return (
    <PageContainer>
      <div className="flex w-full flex-row items-center justify-between">
        <PageHeader
          title="Gestion des parcours & notes"
          description="Bienvenue sur l'espace de gestion de l'UPJV."
        />

        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger render={<Button>Créer un parcours</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un parcours</DialogTitle>
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
                  {form.formState.errors.nomParcours && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.nomParcours.message}
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
                        value={ANNEE_FORMATION[field.value]}
                        onValueChange={(v) => field.onChange(Number(v))}
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
                          {Object.entries(ANNEE_FORMATION).map(([k, v]) => (
                            <SelectItem value={k}>{v}</SelectItem>
                          ))}
                          {/* <SelectItem value="1">1ère année</SelectItem> */}
                          {/* <SelectItem value="2">2ème année</SelectItem> */}
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
