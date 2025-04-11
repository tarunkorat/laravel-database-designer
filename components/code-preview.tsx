"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateMigrationCode, generateModelCode, generatePivotTableCode } from "@/lib/code-generator"

export function CodePreview({ models }) {
  const [activeTab, setActiveTab] = useState("migrations")
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Find all many-to-many relationships to generate pivot tables
  const manyToManyRelationships = []
  models.forEach((model) => {
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

  return (
    <Tabs defaultValue="migrations" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 bg-[#131e2d]">
        <TabsTrigger value="migrations" className="text-gray-200">
          Migrations
        </TabsTrigger>
        <TabsTrigger value="models" className="text-gray-200">
          Models
        </TabsTrigger>
        <TabsTrigger value="pivots" className="text-gray-200">
          Pivot Tables
        </TabsTrigger>
      </TabsList>

      <TabsContent value="migrations" className="border border-[#1e2a3b] rounded-md mt-4">
        {models.length === 0 ? (
          <div className="p-4 text-center text-gray-300">
            No models to generate migrations for. Add some models first.
          </div>
        ) : (
          <div className="space-y-4">
            {models.map((model, index) => (
              <div key={model.id} className="relative">
                <div className="flex justify-between items-center bg-[#131e2d] px-4 py-2 rounded-t-md">
                  <h3 className="font-medium text-white">{model.name} Migration</h3>
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
                </div>
                <ScrollArea className="h-[300px] bg-[#0a1120] rounded-b-md">
                  <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {generateMigrationCode(model)}
                  </pre>
                </ScrollArea>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="models" className="border border-[#1e2a3b] rounded-md mt-4">
        {models.length === 0 ? (
          <div className="p-4 text-center text-gray-300">No models to generate code for. Add some models first.</div>
        ) : (
          <div className="space-y-4">
            {models.map((model, index) => (
              <div key={model.id} className="relative">
                <div className="flex justify-between items-center bg-[#131e2d] px-4 py-2 rounded-t-md">
                  <h3 className="font-medium text-white">{model.name} Model</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs text-gray-200"
                    onClick={() => copyToClipboard(generateModelCode(model, models), `model-${index}`)}
                  >
                    {copiedIndex === `model-${index}` ? (
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
                <ScrollArea className="h-[300px] bg-[#0a1120] rounded-b-md">
                  <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {generateModelCode(model, models)}
                  </pre>
                </ScrollArea>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="pivots" className="border border-[#1e2a3b] rounded-md mt-4">
        {manyToManyRelationships.length === 0 ? (
          <div className="p-4 text-center text-gray-300">
            No many-to-many relationships found. Add belongsToMany relationships to generate pivot tables.
          </div>
        ) : (
          <div className="space-y-4">
            {manyToManyRelationships.map((rel, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center bg-[#131e2d] px-4 py-2 rounded-t-md">
                  <h3 className="font-medium text-white">{rel.pivotTable} Pivot Table</h3>
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
                </div>
                <ScrollArea className="h-[300px] bg-[#0a1120] rounded-b-md">
                  <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {generatePivotTableCode(rel)}
                  </pre>
                </ScrollArea>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
