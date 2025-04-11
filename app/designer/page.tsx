"use client"

import { useState } from "react"
import { PlusCircle, Download, Code, Database, Sparkles } from "lucide-react"
import { DragDropContext } from "@hello-pangea/dnd"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ModelForm } from "@/components/model-form"
import { CodePreview } from "@/components/code-preview"
import { ModelCard } from "@/components/model-card"
import { SchemaVisualizer } from "@/components/schema-visualizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"

export default function DesignerPage() {
  const [showCodePreview, setShowCodePreview] = useState(false)
  const [activeTab, setActiveTab] = useState("designer")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModelOpen, setIsAddModelOpen] = useState(false)

  // Get data from store
  const models = useStore((state) => state.models)
  const addModel = useStore((state) => state.addModel)
  const updateModel = useStore((state) => state.updateModel)
  const deleteModel = useStore((state) => state.deleteModel)
  const addField = useStore((state) => state.addField)
  const deleteField = useStore((state) => state.deleteField)
  const addRelationship = useStore((state) => state.addRelationship)
  const deleteRelationship = useStore((state) => state.deleteRelationship)
  const activeProject = useStore((state) => state.activeProject)
  const projects = useStore((state) => state.projects)

  const currentProject = projects.find((p) => p.id === activeProject)
  const projectModels = currentProject ? models.filter((model) => currentProject.models.includes(model.id)) : models

  const handleAddModel = (model) => {
    addModel(model)
    setIsAddModelOpen(false)
  }

  const handleAddField = (modelId, field) => {
    addField(modelId, field)
  }

  const handleAddRelationship = (modelId, relationship) => {
    addRelationship(modelId, relationship)
  }

  const handleDeleteModel = (modelId) => {
    deleteModel(modelId)
  }

  const handleDeleteField = (modelId, fieldId) => {
    deleteField(modelId, fieldId)
  }

  const handleDeleteRelationship = (modelId, relationshipId) => {
    deleteRelationship(modelId, relationshipId)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result
    const modelId = source.droppableId.split("-")[1]
    const type = source.droppableId.split("-")[0]

    if (type === "fields") {
      const model = models.find((m) => m.id === modelId)
      if (!model) return

      const fields = [...model.fields]
      const [removed] = fields.splice(source.index, 1)
      fields.splice(destination.index, 0, removed)

      updateModel(modelId, { fields })
    } else if (type === "relationships") {
      const model = models.find((m) => m.id === modelId)
      if (!model) return

      const relationships = [...model.relationships]
      const [removed] = relationships.splice(source.index, 1)
      relationships.splice(destination.index, 0, removed)

      updateModel(modelId, { relationships })
    }
  }

  const handleDownload = () => {
    // In a real app, this would call an API endpoint to generate and download the ZIP
    alert("In a real app, this would download a ZIP with all migrations")
  }

  const filteredModels = projectModels.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Header actions
  const headerActions = (
    <>
      <Dialog open={showCodePreview} onOpenChange={setShowCodePreview}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-[#1e2a3b] hover:border-[#2e3a4b] bg-[#131e2d] text-gray-200">
            <Code className="mr-2 h-4 w-4" />
            Preview Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] bg-[#0a1120] border-[#1e2a3b]">
          <DialogHeader>
            <DialogTitle className="text-white">Migration Code Preview</DialogTitle>
            <DialogDescription className="text-gray-300">
              Preview the generated Laravel migration code.
            </DialogDescription>
          </DialogHeader>
          <CodePreview models={filteredModels} />
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleDownload}
        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
      >
        <Download className="mr-2 h-4 w-4" />
        Download ZIP
      </Button>
    </>
  )

  return (
    <Layout>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} actions={headerActions} />

      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-[#1e2a3b] px-4">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="designer"
                className="data-[state=active]:bg-[#131e2d] data-[state=active]:text-white text-gray-200"
              >
                <Database className="mr-2 h-4 w-4" />
                Database Designer
              </TabsTrigger>
              <TabsTrigger
                value="visualizer"
                className="data-[state=active]:bg-[#131e2d] data-[state=active]:text-white text-gray-200"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Schema Visualizer
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="designer" className="flex-1 overflow-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Your Models</h2>
              <Button
                onClick={() => setIsAddModelOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    models={models}
                    onAddField={(field) => handleAddField(model.id, field)}
                    onAddRelationship={(relationship) => handleAddRelationship(model.id, relationship)}
                    onDeleteModel={() => handleDeleteModel(model.id)}
                    onDeleteField={(fieldId) => handleDeleteField(model.id, fieldId)}
                    onDeleteRelationship={(relationshipId) => handleDeleteRelationship(model.id, relationshipId)}
                  />
                ))}
              </div>
            </DragDropContext>

            {filteredModels.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-[#1e2a3b] rounded-lg">
                <div className="text-center p-6 max-w-md">
                  <h3 className="text-xl font-semibold mb-2 text-white">No Models Yet</h3>
                  <p className="text-gray-300 mb-4">
                    Start by adding a model to your project. Models represent database tables in your Laravel
                    application.
                  </p>
                  <Button
                    onClick={() => setIsAddModelOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Model
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visualizer" className="flex-1 overflow-auto p-4">
            <SchemaVisualizer models={filteredModels} />
          </TabsContent>
        </Tabs>
      </main>

      <Sheet open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
        <SheetContent className="bg-[#0a1120] border-[#1e2a3b]">
          <SheetHeader>
            <SheetTitle className="text-white">Add New Model</SheetTitle>
            <SheetDescription className="text-gray-300">
              Create a new database model for your Laravel application.
            </SheetDescription>
          </SheetHeader>
          <ModelForm onSubmit={handleAddModel} />
        </SheetContent>
      </Sheet>
    </Layout>
  )
}
