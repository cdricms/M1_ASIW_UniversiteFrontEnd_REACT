export interface ParcoursForm {
  nomParcours: string
  anneeFormation: 1 | 2
}

export type Parcours = ParcoursForm & {
  id: number
  created_at: string
} 

export interface ParcoursResponse {
  message: string
  parcours: Parcours
}

export interface UpdateParcours {
  nomParcours?: string;
  anneeFormation?: number;
}