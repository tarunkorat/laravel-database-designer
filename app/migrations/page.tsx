"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, ArrowUpDown, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateMigrationCode, generatePivotTableCode } from "@/lib/code-generator"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MigrationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("migrations")
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const models = useStore((state) => state.models)
  const activeProject = useStore((state) => state.activeProject)
  const projects = useStore((state) => state.projects)

  const currentProject = projects.find((p) => p.id === activeProject)
  const projectModels = currentProject ? models.filter((model) => currentProject.models.includes(model.id)) : models

  const filteredModels = projectModels.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Find all many-to-many relationships to generate pivot tables
  const manyToManyRelationships = []
  projectModels.forEach((model) => {
    model.relationships.forEach((rel) => {
      if (rel.type === "belongsToMany") {
        // Check if this relationship is already in the list (from the other side)
        const exists = manyToManyRelationships.some(
          (r) => r.models.includes(model.name) && r.models.includes(rel.relatedModel),
        )

        if (!exists) {
          manyToManyRelationships.push({
            models: [model.name, rel.relatedModel],
            pivotTable: rel.pivotTable || [model.name.toLowerCase(), rel.relatedModel.toLowerCase()].sort().join("_"),
          })
        }
      }
    })
  })

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

  const handleDownloadAll = () => {
    // In a real app, this would generate and download a ZIP file with all migrations
    alert("In a real app, this would download a ZIP with all migrations")
  }

  return (
    <Layout>
      <Header
        title="Migrations"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actions={
          <Button
            onClick={handleDownloadAll}
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        }
      />

      <main className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#131e2d] mb-6">
            <TabsTrigger value="migrations" className="text-gray-200">
              Table Migrations
            </TabsTrigger>
            <TabsTrigger value="pivots" className="text-gray-200">
              Pivot Tables
            </TabsTrigger>
            <TabsTrigger value="list" className="text-gray-200">
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="migrations">
            {sortedModels.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#1e2a3b] rounded-lg">
                <p className="text-gray-300 mb-4">No models to generate migrations for</p>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  onClick={() => (window.location.href = "/designer")}
                >
                  Create Your First Model
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedModels.map((model, index) => (
                  <Card key={model.id} className="bg-[#131e2d] border-[#1e2a3b]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg text-white">{model.name} Migration</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs text-gray-200"
                        onClick={() => copyToClipboard(generateMigrationCode(model), `migration-${index}`)}
                      >
                        {copiedIndex === `migration-${index}` ? (
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
                          {generateMigrationCode(model)}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pivots">
            {manyToManyRelationships.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#1e2a3b] rounded-lg">
                <p className="text-gray-300 mb-4">No many-to-many relationships found</p>
                <p className="text-gray-400">Add belongsToMany relationships to generate pivot tables</p>
              </div>
            ) : (
              <div className="space-y-6">
                {manyToManyRelationships.map((rel, index) => (
                  <Card key={index} className="bg-[#131e2d] border-[#1e2a3b]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg text-white">{rel.pivotTable} Pivot Table</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs text-gray-200"
                        onClick={() => copyToClipboard(generatePivotTableCode(rel), `pivot-${index}`)}
                      >
                        {copiedIndex === `pivot-${index}` ? (
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
                          {generatePivotTableCode(rel)}
                        </pre>
                      </ScrollArea>
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
                  placeholder="Filter migrations..."
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
                        Migration Name
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
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedModels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                        No migrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedModels.map((model, index) => (
                      <TableRow key={model.id} className="hover:bg-[#1e2a3b] border-[#1e2a3b]">
                        <TableCell className="font-medium text-white">
                          {model.name}
                          <div className="text-xs text-gray-400">
                            {model.tableName || `${model.name.toLowerCase()}s`}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{model.fields.length}</TableCell>
                        <TableCell className="text-gray-300">{model.relationships.length}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-gray-200"
                            onClick={() => copyToClipboard(generateMigrationCode(model), `list-${index}`)}
                          >
                            {copiedIndex === `list-${index}` ? (
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
        </Tabs>
      </main>
    </Layout>
  )
}
