import { useMemo } from "react";
import { PageContainer, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { getParcoursColumns } from "@/components/ui/columns";
import useApi from "@/lib/useApi";
import type { Parcours } from "@/types/types";

export function ParcoursPage() {
  const { error, data, loading, submit: refetch } = useApi<Parcours[], void>(
    "/parcours",
    { immediate: true },
  );

  // Après une modification, on recharge la liste
  const columns = useMemo(() => getParcoursColumns(() => refetch()), [refetch]);

  return (
    <PageContainer>
      <PageHeader title="Parcours" description="Liste et gestion des parcours." />
      {error ? (
        <p className="text-destructive">Erreur lors du chargement.</p>
      ) : loading && !data ? (
        // seulement au premier chargement : le tableau reste affiché pendant un refetch
        <p>Chargement…</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          filterColumn={{ id: "anneeFormation", label: "Année" }}
        />
      )}
    </PageContainer>
  );
}
