import { Card, PageContainer, PageHeader } from "@/components/layout/Page";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import useApi from "@/lib/useApi";
import type { Parcours, ParcoursParamsSort } from "@/types/types";
import { Button } from "@base-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useEffect, useState } from "react"

export function OrderButton(state: ParcoursParamsSort) {

  const [orientation, setOrientation] = useState<ParcoursParamsSort["sortedByOrientation"]>()

  const changeOrientation = () => {
    setOrientation(prev => prev === "up" ? "down" : "up")
  }

  return <Button onClick={changeOrientation}>
    {orientation === "up" ? <ArrowUpIcon/> : <ArrowDownIcon/>}
  </Button>
}

export function ParcoursPage() {

  const { error, data, loading, submit } = useApi<Parcours[], void>(
    "/parcours",
    {
      method: "GET",
    },
  )

  const [sortedData, setSortedData] = useState<Parcours[]>([])
  const [sortProps, setSortProps] = useState<ParcoursParamsSort>()
  

  const onLoad = async () => {
    const res = await submit()
    if (res) setSortedData(res)
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <PageContainer>
      <PageHeader title="Parcours" description="Liste et gestion des parcours." />
      <Table>
        <TableCaption>Liste des parcours</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nom <OrderButton/></TableHead>
            <TableHead>Année de formation <OrderButton/></TableHead>
            <TableHead>Créé le <OrderButton/></TableHead>
           </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData?.map(parcours =>
            <TableRow key={parcours.id}>
              <TableCell>{parcours.nomParcours}</TableCell>
              <TableCell>{parcours.anneeFormation}</TableCell>
              <TableCell>{parcours.created_at}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </PageContainer>
  );
}
