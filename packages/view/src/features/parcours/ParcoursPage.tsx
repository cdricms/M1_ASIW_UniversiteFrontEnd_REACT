import { PageContainer, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { parcoursColumns } from "@/components/ui/columns";
import useApi from "@/lib/useApi";
import type { Parcours } from "@/types/types";

export function ParcoursPage() {
  const { error, data, loading } = useApi<Parcours[], void>("/parcours", { immediate: true });

  return (
    <PageContainer>
      <PageHeader title="Parcours" description="Liste et gestion des parcours." />
      {error ? (
        <p className="text-destructive">Erreur lors du chargement.</p>
      ) : loading ? (
        <p>Chargement…</p>
      ) : (
        <DataTable 
          columns={parcoursColumns}
          data={data ?? []}
          filterColumn={{ id: "anneeFormation", label: "Année" }}
        />
      )}
    </PageContainer>
  );
}