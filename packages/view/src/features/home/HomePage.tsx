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
import { Input, Select } from "@base-ui/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

type Parcours = {
  nomParcours: string
  anneeFormation: 1 | 2
}

const Parcours = z.object({
  nomParcours: z.string(),
  anneeFormation: z.union([z.literal(1), z.literal(2)]),
}) satisfies z.ZodType<Parcours>

export function HomePage() {
  const form = useForm<Parcours>({
    resolver: zodResolver(Parcours),
    defaultValues: {
      nomParcours: "",
      anneeFormation: 1,
    },
  })

  // useApi("/parcours", { method: "POST", data: parcours })
  //
  //

  return (
    <PageContainer>
      <div className="flex flex-row justify-between w-full items-center">
        <PageHeader
          title="Gestion des parcours & notes"
          description="Bienvenue sur l'espace de gestion de l'UPJV."
        />
        <Dialog>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogTrigger
              render={<Button>Créer un parcours</Button>}
            ></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un parcours</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="nomParcours">Le nom du parcours stp</Label>
                  <Input
                    id="nomParcours"
                    defaultValue=""
                    {...form.register("nomParcours")}
                  ></Input>
                </Field>
              </FieldGroup>

              <Field name="anneeFormation"></Field>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </PageContainer>
  )
}
