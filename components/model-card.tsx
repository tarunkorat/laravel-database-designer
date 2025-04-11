"use client"

import { useState } from "react"
import { Trash2, PlusCircle, GripVertical, ChevronDown, ChevronUp, Link2 } from "lucide-react"
import { Droppable, Draggable } from "@hello-pangea/dnd"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { FieldForm } from "@/components/field-form"
import { RelationshipForm } from "@/components/relationship-form"

export function ModelCard({
  model,
  models,
  onAddField,
  onAddRelationship,
  onDeleteModel,
  onDeleteField,
  onDeleteRelationship,
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("fields")
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [isAddRelationshipOpen, setIsAddRelationshipOpen] = useState(false)

  const handleAddField = (field) => {
    onAddField(field)
    setIsAddFieldOpen(false)
  }

  const handleAddRelationship = (relationship) => {
    onAddRelationship(relationship)
    setIsAddRelationshipOpen(false)
  }

  return (
    <Card className="bg-[#131e2d] border-[#1e2a3b] overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
                {model.name}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {model.tableName || `${model.name.toLowerCase()}s`}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-red-400"
                onClick={onDeleteModel}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <div className="px-6 py-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 bg-[#0a1120]">
                <TabsTrigger value="fields" className="text-gray-200">
                  Fields
                </TabsTrigger>
                <TabsTrigger value="relationships" className="text-gray-200">
                  Relationships
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fields" className="pt-4">
                <Droppable droppableId={`fields-${model.id}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[50px]">
                      {model.fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between bg-[#0a1120] p-2 rounded-md group"
                            >
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-200">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium text-white">{field.name}</div>
                                  <div className="text-xs text-gray-300 flex gap-1 items-center">
                                    <span>{field.type}</span>
                                    {field.nullable && (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] py-0 h-4 border-pink-800 bg-transparent text-pink-300"
                                      >
                                        Nullable
                                      </Badge>
                                    )}
                                    {field.unique && (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] py-0 h-4 border-cyan-800 bg-transparent text-cyan-300"
                                      >
                                        Unique
                                      </Badge>
                                    )}
                                    {field.index && (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] py-0 h-4 border-purple-800 bg-transparent text-purple-300"
                                      >
                                        Index
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400"
                                onClick={() => onDeleteField(field.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Button
                  variant="ghost"
                  className="w-full mt-4 border border-dashed border-[#1e2a3b] hover:border-[#2e3a4b] text-gray-200"
                  onClick={() => setIsAddFieldOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Field
                </Button>

                <Sheet open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                  <SheetContent className="bg-[#0a1120] border-[#1e2a3b]">
                    <SheetHeader>
                      <SheetTitle className="text-white">Add Field to {model.name}</SheetTitle>
                      <SheetDescription className="text-gray-300">
                        Define a new database column for this model.
                      </SheetDescription>
                    </SheetHeader>
                    <FieldForm onSubmit={handleAddField} />
                  </SheetContent>
                </Sheet>
              </TabsContent>

              <TabsContent value="relationships" className="pt-4">
                <Droppable droppableId={`relationships-${model.id}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[50px]">
                      {model.relationships.map((relationship, index) => (
                        <Draggable key={relationship.id} draggableId={relationship.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between bg-[#0a1120] p-2 rounded-md group"
                            >
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-200">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium flex items-center gap-1 text-white">
                                    <span>{relationship.type}</span>
                                    <Link2 className="h-3 w-3 text-pink-400" />
                                    <span>{relationship.relatedModel}</span>
                                  </div>
                                  <div className="text-xs text-gray-300">
                                    {relationship.foreignKey && `Foreign Key: ${relationship.foreignKey}`}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400"
                                onClick={() => onDeleteRelationship(relationship.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Button
                  variant="ghost"
                  className="w-full mt-4 border border-dashed border-[#1e2a3b] hover:border-[#2e3a4b] text-gray-200"
                  onClick={() => setIsAddRelationshipOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Relationship
                </Button>

                <Sheet open={isAddRelationshipOpen} onOpenChange={setIsAddRelationshipOpen}>
                  <SheetContent className="bg-[#0a1120] border-[#1e2a3b]">
                    <SheetHeader>
                      <SheetTitle className="text-white">Add Relationship to {model.name}</SheetTitle>
                      <SheetDescription className="text-gray-300">
                        Define a relationship with another model.
                      </SheetDescription>
                    </SheetHeader>
                    <RelationshipForm onSubmit={handleAddRelationship} models={models} currentModel={model} />
                  </SheetContent>
                </Sheet>
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <CardFooter className="flex justify-between py-2 px-6 border-t border-[#1e2a3b] bg-[#0a1120]/50">
        <div className="text-xs text-gray-300">
          {model.timestamps ? "With timestamps" : "No timestamps"}
          {model.softDeletes && " • Soft deletes"}
        </div>
        <div className="flex gap-1">
          <Badge variant="outline" className="bg-[#0a1120] text-cyan-300 border-cyan-800">
            {model.fields.length} Fields
          </Badge>
          <Badge variant="outline" className="bg-[#0a1120] text-pink-300 border-pink-800">
            {model.relationships.length} Relations
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
