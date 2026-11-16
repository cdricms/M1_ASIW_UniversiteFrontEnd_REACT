import { PageContainer, PageHeader } from "@/components/layout/Page"
import { ParcoursFormDialog } from "@/components/ParcoursFormDialog"
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
import type { ParcoursForm, ParcoursResponse } from "@/types/types"
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
  const form = useForm<ParcoursForm>({
    resolver: zodResolver(parcoursSchema),
    defaultValues: {
      nomParcours: "",
      anneeFormation: 1,
    },
  })

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { error, data, loading, submit } = useApi<ParcoursResponse, ParcoursForm>(
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
  const [open, setOpen] = useState(false)
  
  return (
    
    <PageContainer>
      <div className="flex w-full flex-row items-center justify-between">
        <PageHeader
          title="Gestion des parcours & notes"
          description="Bienvenue sur l'espace de gestion de l'UPJV."
        />
        <Button onClick={() => setOpen(true)}>Créer un parcours</Button>
        <ParcoursFormDialog open={open} onOpenChange={setOpen} />
      </div>
    </PageContainer>
  )
}
