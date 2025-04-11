"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Code, FileCode, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const models = useStore((state) => state.models)
  const projects = useStore((state) => state.projects)
  const activeProject = useStore((state) => state.activeProject)

  const currentProject = projects.find((p) => p.id === activeProject) || projects[0]
  const projectModels = models.filter((model) => currentProject?.models.includes(model.id))

  // Get recent models (last 5)
  const recentModels = [...projectModels].sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id)).slice(0, 5)

  return (
    <Layout>
      <Header title="Dashboard" searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#131e2d] border-[#1e2a3b]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-200 flex items-center">
                <Database className="mr-2 h-5 w-5 text-pink-400" />
                Total Models
              </CardTitle>
              <CardDescription className="text-gray-400">Models in current project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{projectModels.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#131e2d] border-[#1e2a3b]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-200 flex items-center">
                <Code className="mr-2 h-5 w-5 text-pink-400" />
                Total Fields
              </CardTitle>
              <CardDescription className="text-gray-400">Fields across all models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {projectModels.reduce((acc, model) => acc + model.fields.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#131e2d] border-[#1e2a3b]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-200 flex items-center">
                <FileCode className="mr-2 h-5 w-5 text-pink-400" />
                Relationships
              </CardTitle>
              <CardDescription className="text-gray-400">Defined relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {projectModels.reduce((acc, model) => acc + model.relationships.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-[#131e2d] border-[#1e2a3b]">
              <CardHeader>
                <CardTitle className="text-lg text-gray-200">Recent Models</CardTitle>
                <CardDescription className="text-gray-400">Recently created or updated models</CardDescription>
              </CardHeader>
              <CardContent>
                {recentModels.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-4">No models created yet</p>
                    <Link href="/designer">
                      <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                        Create Your First Model
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentModels.map((model) => (
                      <div key={model.id} className="flex items-center justify-between p-3 bg-[#0a1120] rounded-md">
                        <div className="flex items-center">
                          <Database className="h-5 w-5 text-pink-400 mr-3" />
                          <div>
                            <div className="font-medium text-white">{model.name}</div>
                            <div className="text-sm text-gray-400">
                              {model.fields.length} fields • {model.relationships.length} relationships
                            </div>
                          </div>
                        </div>
                        <Link href="/designer">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-[#131e2d] border-[#1e2a3b]">
              <CardHeader>
                <CardTitle className="text-lg text-gray-200">Project Info</CardTitle>
                <CardDescription className="text-gray-400">Current project details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Project Name</div>
                    <div className="font-medium text-white">{currentProject?.name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Description</div>
                    <div className="font-medium text-white">{currentProject?.description || "No description"}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Created</div>
                    <div className="font-medium text-white flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(currentProject?.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/projects">
                      <Button variant="outline" size="sm" className="w-full border-[#1e2a3b] text-gray-200">
                        Manage Projects
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  )
}
