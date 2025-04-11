"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// All Laravel relationships from the docs
const relationshipTypes = [
  "hasOne",
  "hasMany",
  "belongsTo",
  "belongsToMany",
  "hasManyThrough",
  "hasOneThrough",
  "morphOne",
  "morphMany",
  "morphTo",
  "morphToMany",
  "morphedByMany",
]

// Descriptions for each relationship type
const relationshipDescriptions = {
  hasOne: "A one-to-one relationship. E.g., a User has one Profile.",
  hasMany: "A one-to-many relationship. E.g., a User has many Posts.",
  belongsTo: "The inverse of hasOne or hasMany. E.g., a Post belongs to a User.",
  belongsToMany: "A many-to-many relationship. E.g., a User belongs to many Roles.",
  hasManyThrough: "A relationship through an intermediate model. E.g., a Country has many Posts through Users.",
  hasOneThrough: "Similar to hasManyThrough, but for a single related model.",
  morphOne: "A polymorphic one-to-one relationship.",
  morphMany: "A polymorphic one-to-many relationship.",
  morphTo: "The inverse of morphOne or morphMany.",
  morphToMany: "A polymorphic many-to-many relationship.",
  morphedByMany: "The inverse of morphToMany.",
}

export function RelationshipForm({ onSubmit, models, currentModel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [relationshipType, setRelationshipType] = useState("")
  const [relatedModel, setRelatedModel] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      foreignKey: "",
      localKey: "",
      pivotTable: "",
      morphType: "",
      morphId: "",
      throughModel: "",
    },
  })

  const onFormSubmit = (data) => {
    setIsSubmitting(true)
    try {
      onSubmit({
        ...data,
        type: relationshipType,
        relatedModel: relatedModel,
      })
      reset()
      setRelationshipType("")
      setRelatedModel("")
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const showForeignKey = ["hasOne", "hasMany", "belongsTo", "belongsToMany"].includes(relationshipType)
  const showPivotTable =
    relationshipType === "belongsToMany" || relationshipType === "morphToMany" || relationshipType === "morphedByMany"
  const showMorphFields = ["morphOne", "morphMany", "morphTo", "morphToMany", "morphedByMany"].includes(
    relationshipType,
  )
  const showThroughModel = ["hasManyThrough", "hasOneThrough"].includes(relationshipType)

  // Filter out the current model from the list of available models
  const availableModels = models.filter((model) => model.id !== currentModel.id)

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="type" className="text-gray-200">
            Relationship Type
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Select the type of relationship between models.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select onValueChange={setRelationshipType} value={relationshipType}>
          <SelectTrigger id="type" className="bg-[#131e2d] border-[#1e2a3b] text-gray-200">
            <SelectValue placeholder="Select a relationship type" className="text-gray-400" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1120] border-[#1e2a3b] text-gray-200">
            {relationshipTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-gray-200">
                <div className="flex flex-col">
                  <span>{type}</span>
                  <span className="text-xs text-gray-300">{relationshipDescriptions[type]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!relationshipType && <p className="text-sm text-red-400">Relationship type is required</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="relatedModel" className="text-gray-200">
          Related Model
        </Label>
        <Select onValueChange={setRelatedModel} value={relatedModel}>
          <SelectTrigger id="relatedModel" className="bg-[#131e2d] border-[#1e2a3b] text-gray-200">
            <SelectValue placeholder="Select a related model" className="text-gray-400" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1120] border-[#1e2a3b] text-gray-200">
            {availableModels.map((model) => (
              <SelectItem key={model.id} value={model.name} className="text-gray-200">
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!relatedModel && <p className="text-sm text-red-400">Related model is required</p>}
        <p className="text-sm text-gray-300">The model this relationship connects to</p>
      </div>

      {showForeignKey && (
        <div className="space-y-2">
          <Label htmlFor="foreignKey" className="text-gray-200">
            Foreign Key (Optional)
          </Label>
          <Input
            id="foreignKey"
            placeholder={
              relationshipType === "belongsTo"
                ? `${relatedModel?.toLowerCase()}_id`
                : `${currentModel.name.toLowerCase()}_id`
            }
            className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
            {...register("foreignKey")}
          />
          <p className="text-sm text-gray-300">The foreign key column name. Leave empty for Laravel convention.</p>
        </div>
      )}

      {showPivotTable && (
        <div className="space-y-2">
          <Label htmlFor="pivotTable" className="text-gray-200">
            Pivot Table (Optional)
          </Label>
          <Input
            id="pivotTable"
            placeholder={
              relatedModel && currentModel
                ? [currentModel.name.toLowerCase(), relatedModel.toLowerCase()].sort().join("_")
                : "pivot_table_name"
            }
            className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
            {...register("pivotTable")}
          />
          <p className="text-sm text-gray-300">The name of the pivot table. Leave empty for Laravel convention.</p>
        </div>
      )}

      {showMorphFields && (
        <>
          <div className="space-y-2">
            <Label htmlFor="morphType" className="text-gray-200">
              Morph Type Column (Optional)
            </Label>
            <Input
              id="morphType"
              placeholder="modelable_type"
              className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
              {...register("morphType")}
            />
            <p className="text-sm text-gray-300">The column that stores the model type. Default is [name]able_type.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="morphId" className="text-gray-200">
              Morph ID Column (Optional)
            </Label>
            <Input
              id="morphId"
              placeholder="modelable_id"
              className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
              {...register("morphId")}
            />
            <p className="text-sm text-gray-300">The column that stores the model ID. Default is [name]able_id.</p>
          </div>
        </>
      )}

      {showThroughModel && (
        <div className="space-y-2">
          <Label htmlFor="throughModel" className="text-gray-200">
            Through Model
          </Label>
          <Select {...register("throughModel")}>
            <SelectTrigger id="throughModel" className="bg-[#131e2d] border-[#1e2a3b] text-gray-200">
              <SelectValue placeholder="Select a through model" className="text-gray-400" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a1120] border-[#1e2a3b] text-gray-200">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.name} className="text-gray-200">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-300">The intermediate model for the relationship.</p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" className="border-[#1e2a3b] text-gray-200">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !relationshipType || !relatedModel}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
        >
          {isSubmitting ? "Adding..." : "Add Relationship"}
        </Button>
      </div>
    </form>
  )
}
