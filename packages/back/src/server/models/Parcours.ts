export interface Parcours {
  id: number;
  nomParcours: string;
  anneeFormation: number;
  created_at: string;
}

export interface CreateParcoursPayload {
  nomParcours: string;
  anneeFormation?: number;
}

export interface UpdateParcoursPayload {
  nomParcours?: string;
  anneeFormation?: number;
}

export interface ParcoursWithInscrits extends Parcours {
  inscrits: Array<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
  }>;
}
