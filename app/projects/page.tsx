"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Check, FolderOpen, Clock, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  const projects = useStore((state) => state.projects)
  const models = useStore((state) => state.models)
  const activeProject = useStore((state) => state.activeProject)
  const addProject = useStore((state) => state.addProject)
  const updateProject = useStore((state) => state.updateProject)
  const deleteProject = useStore((state) => state.deleteProject)
  const setActiveProject = useStore((state) => state.setActiveProject)

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
      })
      setNewProjectName("")
      setNewProjectDescription("")
      setIsAddProjectOpen(false)
    }
  }

  const handleUpdateProject = () => {
    if (editingProject && newProjectName.trim()) {
      updateProject(editingProject.id, {
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
      })
      setEditingProject(null)
      setNewProjectName("")
      setNewProjectDescription("")
    }
  }

  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id)
      setProjectToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (project) => {
    setEditingProject(project)
    setNewProjectName(project.name)
    setNewProjectDescription(project.description || "")
  }

  const openDeleteDialog = (project) => {
    setProjectToDelete(project)
    setIsDeleteDialogOpen(true)
  }

  const getProjectModelsCount = (projectId) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.models.length : 0
  }

  return (
    <Layout>
      <Header
        title="Projects"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actions={
          <Button
            onClick={() => setIsAddProjectOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
      />

      <main className="flex-1 overflow-auto p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#1e2a3b] rounded-lg">
            <p className="text-gray-300 mb-4">No projects found</p>
            <Button
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              onClick={() => setIsAddProjectOpen(true)}
            >
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className={`bg-[#131e2d] border-[#1e2a3b] ${project.id === activeProject ? "ring-2 ring-pink-500" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                    {project.id === activeProject && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-600">Active</Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-300">{project.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Database className="h-4 w-4 mr-2 text-pink-400" />
                      <span>{getProjectModelsCount(project.id)} models</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-pink-400" />
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {project.id !== activeProject ? (
                    <Button
                      variant="outline"
                      className="border-[#1e2a3b] text-gray-200"
                      className="border-[#1e2a3b] text-gray-200"
                      onClick={() => setActiveProject(project.id)}
                    >
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Set as Active
                    </Button>
                  ) : (
                    <Button variant="outline" className="border-[#1e2a3b] text-gray-200" disabled>
                      <Check className="mr-2 h-4 w-4" />
                      Active Project
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-white"
                      onClick={() => openEditDialog(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {project.id !== "default" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-300 hover:text-red-400"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Add Project Dialog */}
      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="bg-[#0a1120] border-[#1e2a3b]">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Project</DialogTitle>
            <DialogDescription className="text-gray-300">
              Add a new project to organize your database models.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-200">
                Project Name
              </label>
              <Input
                id="name"
                placeholder="My Laravel Project"
                className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-200">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                placeholder="A brief description of your project"
                className="bg-[#131e2d] border-[#1e2a3b] text-gray-200 min-h-[100px]"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#1e2a3b] text-gray-200"
              onClick={() => setIsAddProjectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              onClick={handleAddProject}
              disabled={!newProjectName.trim()}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="bg-[#0a1120] border-[#1e2a3b]">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Project</DialogTitle>
            <DialogDescription className="text-gray-300">Update your project details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium text-gray-200">
                Project Name
              </label>
              <Input
                id="edit-name"
                placeholder="My Laravel Project"
                className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium text-gray-200">
                Description (Optional)
              </label>
              <Textarea
                id="edit-description"
                placeholder="A brief description of your project"
                className="bg-[#131e2d] border-[#1e2a3b] text-gray-200 min-h-[100px]"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#1e2a3b] text-gray-200"
              onClick={() => setEditingProject(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              onClick={handleUpdateProject}
              disabled={!newProjectName.trim()}
            >
              Update Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#0a1120] border-[#1e2a3b]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will delete the project "{projectToDelete?.name}". This action cannot be undone.
              {projectToDelete && getProjectModelsCount(projectToDelete.id) > 0 && (
                <p className="mt-2 text-red-400">
                  Warning: This project contains {getProjectModelsCount(projectToDelete.id)} models that will be removed
                  from the project.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1e2a3b] text-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteProject}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}
