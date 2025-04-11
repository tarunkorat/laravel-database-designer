"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Copy, Check, ArrowUpDown, Search, PlusCircle, Link2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateModelCode } from "@/lib/code-generator"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ModelForm } from "@/components/model-form"
import { Badge } from "@/components/ui/badge"

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("grid")
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isAddModelOpen, setIsAddModelOpen] = useState(false)

  const models = useStore((state) => state.models)
  const addModel = useStore((state) => state.addModel)
  const activeProject = useStore((state) => state.activeProject)
  const projects = useStore((state) => state.projects)

  const currentProject = projects.find((p) => p.id === activeProject)
  const projectModels = currentProject ? models.filter((model) => currentProject.models.includes(model.id)) : models

  const filteredModels = projectModels.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const sortedModels = [...filteredModels].sort((a, b) => {
    let comparison = 0

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === "fields") {
      comparison = a.fields.length - b.fields.length
    } else if (sortBy === "relationships") {
      comparison = a.relationships.length - b.relationships.length
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleAddModel = (model) => {
    addModel(model)
    setIsAddModelOpen(false)
  }

  return (
    <Layout>
      <Header
        title="Models"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actions={
          <Button
            onClick={() => setIsAddModelOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Model
          </Button>
        }
      />

      <main className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#131e2d] mb-6">
            <TabsTrigger value="grid" className="text-gray-200">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="text-gray-200">
              List View
            </TabsTrigger>
            <TabsTrigger value="code" className="text-gray-200">
              Code View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            {sortedModels.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#1e2a3b] rounded-lg">
                <p className="text-gray-300 mb-4">No models found</p>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  onClick={() => setIsAddModelOpen(true)}
                >
                  Create Your First Model
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedModels.map((model) => (
                  <Card key={model.id} className="bg-[#131e2d] border-[#1e2a3b]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
                        {model.name}
                      </CardTitle>
                      <p className="text-sm text-gray-300">{model.tableName || `${model.name.toLowerCase()}s`}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Fields</h4>
                          <div className="bg-[#0a1120] rounded-md p-2 max-h-32 overflow-y-auto">
                            {model.fields.length === 0 ? (
                              <p className="text-gray-400 text-sm text-center py-2">No fields defined</p>
                            ) : (
                              <ul className="space-y-1">
                                {model.fields.map((field) => (
                                  <li key={field.id} className="text-sm text-gray-300 flex justify-between">
                                    <span>{field.name}</span>
                                    <span className="text-gray-400">{field.type}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Relationships</h4>
                          <div className="bg-[#0a1120] rounded-md p-2 max-h-32 overflow-y-auto">
                            {model.relationships.length === 0 ? (
                              <p className="text-gray-400 text-sm text-center py-2">No relationships defined</p>
                            ) : (
                              <ul className="space-y-1">
                                {model.relationships.map((rel) => (
                                  <li key={rel.id} className="text-sm text-gray-300 flex items-center">
                                    <span className="mr-1">{rel.type}</span>
                                    <Link2 className="h-3 w-3 text-pink-400 mx-1" />
                                    <span>{rel.relatedModel}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex gap-1">
                            <Badge variant="outline" className="bg-[#0a1120] text-cyan-300 border-cyan-800">
                              {model.fields.length} Fields
                            </Badge>
                            <Badge variant="outline" className="bg-[#0a1120] text-pink-300 border-pink-800">
                              {model.relationships.length} Relations
                            </Badge>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-gray-200"
                            onClick={() => copyToClipboard(generateModelCode(model, models), `grid-${model.id}`)}
                          >
                            {copiedIndex === `grid-${model.id}` ? (
                              <>
                                <Check className="h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <div className="bg-[#131e2d] border border-[#1e2a3b] rounded-md overflow-hidden">
              <div className="p-4 flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <Input
                  placeholder="Filter models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0a1120] border-[#1e2a3b] text-gray-200"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#1e2a3b] border-[#1e2a3b]">
                    <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center">
                        Model Name
                        {sortBy === "name" && (
                          <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort("fields")}>
                      <div className="flex items-center">
                        Fields
                        {sortBy === "fields" && (
                          <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort("relationships")}>
                      <div className="flex items-center">
                        Relationships
                        {sortBy === "relationships" && (
                          <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300">Options</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedModels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                        No models found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedModels.map((model) => (
                      <TableRow key={model.id} className="hover:bg-[#1e2a3b] border-[#1e2a3b]">
                        <TableCell className="font-medium text-white">
                          {model.name}
                          <div className="text-xs text-gray-400">
                            {model.tableName || `${model.name.toLowerCase()}s`}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{model.fields.length}</TableCell>
                        <TableCell className="text-gray-300">{model.relationships.length}</TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {model.timestamps && (
                              <Badge variant="outline" className="bg-transparent text-gray-300 border-gray-600 text-xs">
                                Timestamps
                              </Badge>
                            )}
                            {model.softDeletes && (
                              <Badge variant="outline" className="bg-transparent text-gray-300 border-gray-600 text-xs">
                                Soft Deletes
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-gray-200"
                            onClick={() => copyToClipboard(generateModelCode(model, models), `list-${model.id}`)}
                          >
                            {copiedIndex === `list-${model.id}` ? (
                              <>
                                <Check className="h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="code">
            {sortedModels.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#1e2a3b] rounded-lg">
                <p className="text-gray-300 mb-4">No models to generate code for</p>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  onClick={() => setIsAddModelOpen(true)}
                >
                  Create Your First Model
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedModels.map((model, index) => (
                  <Card key={model.id} className="bg-[#131e2d] border-[#1e2a3b]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg text-white">{model.name} Model</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs text-gray-200"
                        onClick={() => copyToClipboard(generateModelCode(model, models), `code-${index}`)}
                      >
                        {copiedIndex === `code-${index}` ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] bg-[#0a1120] rounded-md">
                        <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                          {generateModelCode(model, models)}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
