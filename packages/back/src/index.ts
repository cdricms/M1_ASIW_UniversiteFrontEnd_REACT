import { serve } from "bun"
import { initDatabase } from "./server/db"
import type {
  CreateEtudiantPayload,
  UpdateEtudiantPayload,
} from "./server/models/Etudiant"
import {
  createEtudiant,
  deleteEtudiant,
  getAllEtudiants,
  getEtudiantById,
  updateEtudiant,
} from "./server/services/etudiant/etudiants.service"
import type {
  CreateParcoursPayload,
  UpdateParcoursPayload,
} from "./server/models/Parcours"
import {
  createParcours,
  deleteParcours,
  getAllParcours,
  getParcoursById,
  getParcoursWithInscrits,
  updateParcours,
} from "./server/services/parcours/parcours.service"
import type { CreateUePayload, UpdateUePayload } from "./server/models/Ue"
import {
  createUe,
  deleteUe,
  getAllUes,
  getUeById,
  getUeByNumero,
  getUeWithParcours,
  updateUe,
  addUeToParcours,
  removeUeFromParcours,
  getUesForParcours,
  updateUeParcours,
} from "./server/services/ue/ue.service"
import { openapi, swaggerPage } from "./openapi"

initDatabase()

const server = serve({
  port: 3001,
  routes: {
    "/openapi.json": {
      GET: () => Response.json(openapi),
    },
    "/docs": {
      GET: () => new Response(swaggerPage, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }),
    },
    "/api/etudiants": {
      GET: async () => {
        const etudiants = getAllEtudiants()
        return Response.json(etudiants, { status: 200 })
      },

      POST: async (req: Request) => {
        try {
          const body = (await req.json()) as CreateEtudiantPayload

          if (!body.nom || !body.prenom || !body.email) {
            return Response.json(
              { error: "Nom, prenom and email are required" },
              { status: 400 }
            )
          }

          const existingEtudiant = getEtudiantById(
            getAllEtudiants().find((e) => e.email === body.email)?.id || -1
          )
          if (existingEtudiant) {
            return Response.json(
              { error: "Student with this email already exists" },
              { status: 409 }
            )
          }

          const etudiant = await createEtudiant(body)
          if (!etudiant) {
            return Response.json(
              { error: "Failed to create student" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Student created successfully", etudiant },
            { status: 201 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },
    },

    "/api/etudiants/:id": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const etudiant = getEtudiantById(id)
        if (!etudiant) {
          return Response.json({ error: "Student not found" }, { status: 404 })
        }

        return Response.json(etudiant, { status: 200 })
      },

      PUT: async (req) => {
        try {
          const id = parseInt(req.params.id)
          const body = (await req.json()) as UpdateEtudiantPayload

          const etudiant = getEtudiantById(id)
          if (!etudiant) {
            return Response.json(
              { error: "Student not found" },
              { status: 404 }
            )
          }

          const updated = updateEtudiant(id, body)
          if (!updated) {
            return Response.json(
              { error: "Failed to update student" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Student updated successfully", etudiant: updated },
            { status: 200 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },

      DELETE: async (req) => {
        const id = parseInt(req.params.id)

        const etudiant = getEtudiantById(id)
        if (!etudiant) {
          return Response.json({ error: "Student not found" }, { status: 404 })
        }

        const deleted = deleteEtudiant(id)
        if (!deleted) {
          return Response.json(
            { error: "Failed to delete student" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "Student deleted successfully" },
          { status: 200 }
        )
      },
    },

    "/api/parcours": {
      GET: async () => {
        const parcours = getAllParcours()
        return Response.json(parcours, { status: 200 })
      },

      POST: async (req: Request) => {
        try {
          const body = (await req.json()) as CreateParcoursPayload

          if (!body.nomParcours) {
            return Response.json(
              { error: "nomParcours is required" },
              { status: 400 }
            )
          }

          const parcours = await createParcours(body)
          if (!parcours) {
            return Response.json(
              { error: "Failed to create parcours" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Parcours created successfully", parcours },
            { status: 201 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },
    },

    "/api/parcours/:id": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        return Response.json(parcours, { status: 200 })
      },

      PUT: async (req) => {
        try {
          const id = parseInt(req.params.id)
          const body = (await req.json()) as UpdateParcoursPayload

          const parcours = getParcoursById(id)
          if (!parcours) {
            return Response.json(
              { error: "Parcours not found" },
              { status: 404 }
            )
          }

          const updated = updateParcours(id, body)
          if (!updated) {
            return Response.json(
              { error: "Failed to update parcours" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Parcours updated successfully", parcours: updated },
            { status: 200 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },

      DELETE: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const deleted = deleteParcours(id)
        if (!deleted) {
          return Response.json(
            { error: "Failed to delete parcours" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "Parcours deleted successfully" },
          { status: 200 }
        )
      },
    },

    "/api/parcours/:id/inscrits": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const parcoursWithInscrits = getParcoursWithInscrits(id)
        return Response.json(parcoursWithInscrits, { status: 200 })
      },
    },

    "/api/parcours/:id/ues": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const ues = getUesForParcours(id)
        return Response.json(ues, { status: 200 })
      },
    },

    "/api/ues": {
      GET: async () => {
        const ues = getAllUes()
        return Response.json(ues, { status: 200 })
      },

      POST: async (req: Request) => {
        try {
          const body = (await req.json()) as CreateUePayload

          if (!body.numeroUe || !body.intitule) {
            return Response.json(
              { error: "numeroUe and intitule are required" },
              { status: 400 }
            )
          }

          const existingUe = getUeByNumero(body.numeroUe)
          if (existingUe) {
            return Response.json(
              { error: "UE with this numeroUe already exists" },
              { status: 409 }
            )
          }

          const ue = await createUe(body)
          if (!ue) {
            return Response.json(
              { error: "Failed to create UE" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "UE created successfully", ue },
            { status: 201 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },
    },

    "/api/ues/:id": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const ue = getUeById(id)
        if (!ue) {
          return Response.json({ error: "UE not found" }, { status: 404 })
        }

        return Response.json(ue, { status: 200 })
      },

      PUT: async (req) => {
        try {
          const id = parseInt(req.params.id)
          const body = (await req.json()) as UpdateUePayload

          const ue = getUeById(id)
          if (!ue) {
            return Response.json({ error: "UE not found" }, { status: 404 })
          }

          const updated = updateUe(id, body)
          if (!updated) {
            return Response.json(
              { error: "Failed to update UE" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "UE updated successfully", ue: updated },
            { status: 200 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },

      DELETE: async (req) => {
        const id = parseInt(req.params.id)

        const ue = getUeById(id)
        if (!ue) {
          return Response.json({ error: "UE not found" }, { status: 404 })
        }

        const deleted = deleteUe(id)
        if (!deleted) {
          return Response.json(
            { error: "Failed to delete UE" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "UE deleted successfully" },
          { status: 200 }
        )
      },
    },

    "/api/ues/:id/parcours": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const ue = getUeById(id)
        if (!ue) {
          return Response.json({ error: "UE not found" }, { status: 404 })
        }

        const ueWithParcours = getUeWithParcours(id)
        return Response.json(ueWithParcours, { status: 200 })
      },

      PUT: async (req) => {
        try {
          const id = parseInt(req.params.id)
          const body = (await req.json()) as { parcoursIds: number[] }

          const ue = getUeById(id)
          if (!ue) {
            return Response.json({ error: "UE not found" }, { status: 404 })
          }

          if (!body.parcoursIds || !Array.isArray(body.parcoursIds)) {
            return Response.json(
              { error: "parcoursIds array is required" },
              { status: 400 }
            )
          }

          const updated = updateUeParcours(id, body.parcoursIds)
          if (!updated) {
            return Response.json(
              { error: "Failed to update UE parcours" },
              { status: 500 }
            )
          }

          const ueWithParcours = getUeWithParcours(id)
          return Response.json(
            { message: "UE parcours updated successfully", ue: ueWithParcours },
            { status: 200 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },
    },

    "/api/ues/:ueId/parcours/:parcoursId": {
      POST: async (req) => {
        const ueId = parseInt(req.params.ueId)
        const parcoursId = parseInt(req.params.parcoursId)

        const ue = getUeById(ueId)
        if (!ue) {
          return Response.json({ error: "UE not found" }, { status: 404 })
        }

        const parcours = getParcoursById(parcoursId)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const added = addUeToParcours(ueId, parcoursId)
        if (!added) {
          return Response.json(
            { error: "Failed to add UE to parcours" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "UE added to parcours successfully" },
          { status: 201 }
        )
      },

      DELETE: async (req) => {
        const ueId = parseInt(req.params.ueId)
        const parcoursId = parseInt(req.params.parcoursId)

        const ue = getUeById(ueId)
        if (!ue) {
          return Response.json({ error: "UE not found" }, { status: 404 })
        }

        const parcours = getParcoursById(parcoursId)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const removed = removeUeFromParcours(ueId, parcoursId)
        if (!removed) {
          return Response.json(
            { error: "Failed to remove UE from parcours" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "UE removed from parcours successfully" },
          { status: 200 }
        )
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,

    console: true,
  },

  fetch: async (req) => {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      })
    }

    return new Response("Not Found", { status: 404 })
  },
})

console.log(`🚀 Server running at ${server.url}`)
