export interface Parcours {
  nomParcours: string
  anneeFormation: 1 | 2
}

export interface ParcoursResponse {
  message: string
  parcours:
    | Parcours
    | {
        id: number
        created_at: string
      }
}
