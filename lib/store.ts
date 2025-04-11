import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Model = {
  id: string
  name: string
  tableName?: string
  timestamps: boolean
  softDeletes: boolean
  fields: Field[]
  relationships: Relationship[]
}

export type Field = {
  id: string
  name: string
  type: string
  length?: string
  nullable: boolean
  unique: boolean
  index: boolean
  default?: string
}

export type Relationship = {
  id: string
  type: string
  relatedModel: string
  foreignKey?: string
  localKey?: string
  pivotTable?: string
  morphType?: string
  morphId?: string
  throughModel?: string
}

export type Project = {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  models: string[] // Array of model IDs
}

type State = {
  models: Model[]
  projects: Project[]
  activeProject: string | null
  addModel: (model: Omit<Model, "id" | "fields" | "relationships">) => void
  updateModel: (id: string, model: Partial<Model>) => void
  deleteModel: (id: string) => void
  addField: (modelId: string, field: Omit<Field, "id">) => void
  updateField: (modelId: string, fieldId: string, field: Partial<Field>) => void
  deleteField: (modelId: string, fieldId: string) => void
  addRelationship: (modelId: string, relationship: Omit<Relationship, "id">) => void
  updateRelationship: (modelId: string, relationshipId: string, relationship: Partial<Relationship>) => void
  deleteRelationship: (modelId: string, relationshipId: string) => void
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "models">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string | null) => void
  addModelToProject: (projectId: string, modelId: string) => void
  removeModelFromProject: (projectId: string, modelId: string) => void
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      models: [],
      projects: [
        {
          id: "default",
          name: "Default Project",
          description: "Default project for Laravel migrations",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          models: [],
        },
      ],
      activeProject: "default",

      addModel: (model) =>
        set((state) => {
          const newModel = {
            ...model,
            id: Date.now().toString(),
            fields: [],
            relationships: [],
          }

          // Add model to active project if one exists
          let updatedProjects = [...state.projects]
          if (state.activeProject) {
            updatedProjects = state.projects.map((project) =>
              project.id === state.activeProject ? { ...project, models: [...project.models, newModel.id] } : project,
            )
          }

          return {
            models: [...state.models, newModel],
            projects: updatedProjects,
          }
        }),

      updateModel: (id, model) =>
        set((state) => ({
          models: state.models.map((m) => (m.id === id ? { ...m, ...model } : m)),
        })),

      deleteModel: (id) =>
        set((state) => {
          // Remove model from all projects
          const updatedProjects = state.projects.map((project) => ({
            ...project,
            models: project.models.filter((modelId) => modelId !== id),
          }))

          return {
            models: state.models.filter((m) => m.id !== id),
            projects: updatedProjects,
          }
        }),

      addField: (modelId, field) =>
        set((state) => ({
          models: state.models.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                fields: [...model.fields, { ...field, id: Date.now().toString() }],
              }
            }
            return model
          }),
        })),

      updateField: (modelId, fieldId, field) =>
        set((state) => ({
          models: state.models.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                fields: model.fields.map((f) => (f.id === fieldId ? { ...f, ...field } : f)),
              }
            }
            return model
          }),
        })),

      deleteField: (modelId, fieldId) =>
        set((state) => ({
          models: state.models.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                fields: model.fields.filter((f) => f.id !== fieldId),
              }
            }
            return model
          }),
        })),

      addRelationship: (modelId, relationship) =>
        set((state) => ({
          models: state.models.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                relationships: [...model.relationships, { ...relationship, id: Date.now().toString() }],
              }
            }
            return model
          }),
        })),

      updateRelationship: (modelId, relationshipId, relationship) =>
        set((state) => ({
          models: state.models.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                relationships: model.relationships.map((r) =>
                  r.id === relationshipId ? { ...r, ...relationship } : r,
                ),
              }
            }
            return model
          }),
        })),

      deleteRelationship: (modelId, relationshipId) =>
        set((state) => ({
          models: state.models.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                relationships: model.relationships.filter((r) => r.id !== relationshipId),
              }
            }
            return model
          }),
        })),

      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              models: [],
            },
          ],
        })),

      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProject: state.activeProject === id ? null : state.activeProject,
        })),

      setActiveProject: (id) =>
        set(() => ({
          activeProject: id,
        })),

      addModelToProject: (projectId, modelId) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id === projectId && !project.models.includes(modelId)) {
              return {
                ...project,
                models: [...project.models, modelId],
                updatedAt: new Date().toISOString(),
              }
            }
            return project
          }),
        })),

      removeModelFromProject: (projectId, modelId) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                models: project.models.filter((id) => id !== modelId),
                updatedAt: new Date().toISOString(),
              }
            }
            return project
          }),
        })),
    }),
    {
      name: "laravel-migration-designer",
    },
  ),
)
