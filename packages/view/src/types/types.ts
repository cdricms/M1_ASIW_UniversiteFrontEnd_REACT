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

export const ParcoursSortedBy = {
  Name: 0,
  Year: 1,
  CreatedBy: 2
} as const

export type ParcoursSortedBy = typeof ParcoursSortedBy[keyof typeof ParcoursSortedBy]

export interface ParcoursParamsSort {
  sortedBy?: ParcoursSortedBy
  sortedByOrientation?: "up" | "down"
  searchQuery?: string
}