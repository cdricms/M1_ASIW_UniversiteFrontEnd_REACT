/** Contrat OpenAPI 3.0 de l'API définie dans src/index.ts. */
const id = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer" },
} as const;

const ok = { description: "Opération réussie" };
const missing = { description: "Ressource introuvable" };
const badRequest = { description: "Corps de requête invalide ou champs requis absents" };
const jsonBody = (schema: object) => ({
  required: true,
  content: { "application/json": { schema } },
});
const errorResponse = {
  type: "object",
  properties: { error: { type: "string" } },
};
const responses = (success: string, includeMissing = false) => ({
  "200": { description: success },
  ...(includeMissing ? { "404": missing } : {}),
  "400": badRequest,
  "500": { description: "Erreur serveur" },
});

export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "API de gestion des formations",
    version: "1.0.0",
    description: "API Bun locale pour les parcours, les UE et les étudiants. Les années de formation sont représentées par 1 (M1) et 2 (M2).",
  },
  servers: [{ url: "http://localhost:3001", description: "Serveur Bun local" }],
  tags: [
    { name: "Parcours" },
    { name: "UE" },
    { name: "Étudiants" },
  ],
  components: {
    schemas: {
      Parcours: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nomParcours: { type: "string" },
          anneeFormation: { type: "integer", enum: [1, 2] },
          created_at: { type: "string", format: "date-time" },
        },
      },
      UniteEnseignement: {
        type: "object",
        properties: {
          id: { type: "integer" },
          numeroUe: { type: "string" },
          intitule: { type: "string" },
          semestre: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Etudiant: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nom: { type: "string" },
          prenom: { type: "string" },
          email: { type: "string", format: "email" },
          parcours_id: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Error: errorResponse,
    },
  },
  paths: {
    "/api/parcours": {
      get: { tags: ["Parcours"], summary: "Lister les parcours", responses: responses("Liste des parcours") },
      post: {
        tags: ["Parcours"], summary: "Créer un parcours",
        requestBody: jsonBody({ type: "object", required: ["nomParcours"], properties: {
          nomParcours: { type: "string", example: "Architecture des systèmes d’information" },
          anneeFormation: { type: "integer", enum: [1, 2], default: 1, description: "1 = M1, 2 = M2" },
        } }),
        responses: { "201": { description: "Parcours créé" }, "400": badRequest, "500": { description: "Échec de création" } },
      },
    },
    "/api/parcours/{id}": {
      get: { tags: ["Parcours"], summary: "Consulter un parcours", parameters: [id], responses: responses("Parcours", true) },
      put: { tags: ["Parcours"], summary: "Modifier un parcours", parameters: [id], requestBody: jsonBody({ type: "object", properties: {
        nomParcours: { type: "string" }, anneeFormation: { type: "integer", enum: [1, 2] },
      } }), responses: { "200": ok, "400": badRequest, "404": missing, "500": { description: "Échec de mise à jour" } } },
      delete: { tags: ["Parcours"], summary: "Supprimer un parcours", parameters: [id], responses: { "200": ok, "404": missing, "500": { description: "Échec de suppression" } } },
    },
    "/api/parcours/{id}/inscrits": {
      get: { tags: ["Parcours"], summary: "Lister les étudiants inscrits à un parcours", parameters: [id], responses: responses("Parcours avec ses étudiants", true) },
    },
    "/api/parcours/{id}/ues": {
      get: { tags: ["Parcours", "UE"], summary: "Lister les UE d’un parcours", parameters: [id], responses: responses("UE du parcours", true) },
    },
    "/api/ues": {
      get: { tags: ["UE"], summary: "Lister les UE", responses: responses("Liste des UE") },
      post: { tags: ["UE"], summary: "Créer une UE", requestBody: jsonBody({ type: "object", required: ["numeroUe", "intitule"], properties: {
        numeroUe: { type: "string" }, intitule: { type: "string" }, semestre: { type: "integer" },
      } }), responses: { "201": { description: "UE créée" }, "400": badRequest, "409": { description: "Une UE porte déjà ce numéro" }, "500": { description: "Échec de création" } } },
    },
    "/api/ues/{id}": {
      get: { tags: ["UE"], summary: "Consulter une UE", parameters: [id], responses: responses("UE", true) },
      put: { tags: ["UE"], summary: "Modifier une UE", parameters: [id], requestBody: jsonBody({ type: "object", properties: {
        numeroUe: { type: "string" }, intitule: { type: "string" }, semestre: { type: "integer" },
      } }), responses: { "200": ok, "400": badRequest, "404": missing, "500": { description: "Échec de mise à jour" } } },
      delete: { tags: ["UE"], summary: "Supprimer une UE", parameters: [id], responses: { "200": ok, "404": missing, "500": { description: "Échec de suppression" } } },
    },
    "/api/ues/{id}/parcours": {
      get: { tags: ["UE", "Parcours"], summary: "Lister les parcours associés à une UE", parameters: [id], responses: responses("UE avec ses parcours", true) },
      put: { tags: ["UE", "Parcours"], summary: "Remplacer les parcours associés à une UE", parameters: [id], requestBody: jsonBody({ type: "object", required: ["parcoursIds"], properties: {
        parcoursIds: { type: "array", items: { type: "integer" }, example: [1, 2] },
      } }), responses: { "200": ok, "400": badRequest, "404": missing, "500": { description: "Échec de mise à jour" } } },
    },
    "/api/ues/{ueId}/parcours/{parcoursId}": {
      post: { tags: ["UE", "Parcours"], summary: "Associer une UE à un parcours", parameters: [
        { ...id, name: "ueId" }, { ...id, name: "parcoursId" },
      ], responses: { "201": { description: "Association créée" }, "404": missing, "500": { description: "Échec de l’association" } } },
      delete: { tags: ["UE", "Parcours"], summary: "Retirer une UE d’un parcours", parameters: [
        { ...id, name: "ueId" }, { ...id, name: "parcoursId" },
      ], responses: { "200": ok, "404": missing, "500": { description: "Échec du retrait" } } },
    },
    "/api/etudiants": {
      get: { tags: ["Étudiants"], summary: "Lister les étudiants", responses: responses("Liste des étudiants") },
      post: { tags: ["Étudiants"], summary: "Créer un étudiant", requestBody: jsonBody({ type: "object", required: ["nom", "prenom", "email"], properties: {
        nom: { type: "string" }, prenom: { type: "string" }, email: { type: "string", format: "email" }, parcours_id: { type: "integer" },
      } }), responses: { "201": { description: "Étudiant créé" }, "400": badRequest, "409": { description: "Un étudiant possède déjà cet email" }, "500": { description: "Échec de création" } } },
    },
    "/api/etudiants/{id}": {
      get: { tags: ["Étudiants"], summary: "Consulter un étudiant", parameters: [id], responses: responses("Étudiant", true) },
      put: { tags: ["Étudiants"], summary: "Modifier un étudiant", parameters: [id], requestBody: jsonBody({ type: "object", properties: {
        nom: { type: "string" }, prenom: { type: "string" }, email: { type: "string", format: "email" }, parcours_id: { type: "integer" },
      } }), responses: { "200": ok, "400": badRequest, "404": missing, "500": { description: "Échec de mise à jour" } } },
      delete: { tags: ["Étudiants"], summary: "Supprimer un étudiant", parameters: [id], responses: { "200": ok, "404": missing, "500": { description: "Échec de suppression" } } },
    },
  },
} as const;

export const swaggerPage = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Documentation API — Formations</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
    <script>SwaggerUIBundle({ url: "/openapi.json", dom_id: "#swagger-ui" });</script>
  </body>
</html>`;
