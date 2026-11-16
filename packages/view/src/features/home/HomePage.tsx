import { useState } from "react"
import { PageContainer, PageHeader } from "@/components/layout/Page"
import { Button } from "@/components/ui/button"
import { ParcoursFormDialog } from "@/features/parcours/ParcoursFormDialog"

export function HomePage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <PageContainer>
      <div className="flex w-full flex-row items-center justify-between">
        <PageHeader
          title="Gestion des parcours & notes"
          description="Bienvenue sur l'espace de gestion de l'UPJV."
        />
        <Button onClick={() => setDialogOpen(true)}>Créer un parcours</Button>
        <ParcoursFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </PageContainer>
  )
}
