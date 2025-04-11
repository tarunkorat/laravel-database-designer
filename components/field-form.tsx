"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const fieldTypes = [
  "string",
  "text",
  "integer",
  "bigInteger",
  "float",
  "double",
  "decimal",
  "boolean",
  "date",
  "dateTime",
  "time",
  "timestamp",
  "json",
  "uuid",
  "binary",
  "enum",
  "foreignId",
  "morphs",
  "nullableMorphs",
  "rememberToken",
  "ipAddress",
  "macAddress",
  "year",
]

export function FieldForm({ onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldType, setFieldType] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      length: "",
      nullable: false,
      unique: false,
      index: false,
      default: "",
    },
  })

  const onFormSubmit = (data) => {
    setIsSubmitting(true)
    try {
      onSubmit({
        ...data,
        type: fieldType,
      })
      reset()
      setFieldType("")
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const showLength = ["string", "char", "decimal"].includes(fieldType)

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="name" className="text-gray-200">
            Field Name
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>The name of your database column (e.g., first_name, email)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="name"
          placeholder="name"
          className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
          {...register("name", { required: "Field name is required" })}
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="type" className="text-gray-200">
            Field Type
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>The data type for this field</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select onValueChange={setFieldType} value={fieldType}>
          <SelectTrigger id="type" className="bg-[#131e2d] border-[#1e2a3b] text-gray-200">
            <SelectValue placeholder="Select a field type" className="text-gray-400" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1120] border-[#1e2a3b] max-h-[300px] text-gray-200">
            {fieldTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-gray-200">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!fieldType && <p className="text-sm text-red-400">Field type is required</p>}
      </div>

      {showLength && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="length" className="text-gray-200">
              Length/Precision
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>{fieldType === "decimal" ? "Precision and scale (e.g., 8,2)" : "Maximum length for this field"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="length"
            placeholder="255"
            className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
            {...register("length")}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="default" className="text-gray-200">
          Default Value (Optional)
        </Label>
        <Input
          id="default"
          placeholder=""
          className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
          {...register("default")}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 space-y-0 rounded-md border border-[#1e2a3b] p-4">
          <Checkbox id="nullable" {...register("nullable")} />
          <div className="space-y-1 leading-none">
            <Label htmlFor="nullable" className="text-gray-200">
              Nullable
            </Label>
            <p className="text-sm text-gray-300">Allow NULL values for this field</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 space-y-0 rounded-md border border-[#1e2a3b] p-4">
          <Checkbox id="unique" {...register("unique")} />
          <div className="space-y-1 leading-none">
            <Label htmlFor="unique" className="text-gray-200">
              Unique
            </Label>
            <p className="text-sm text-gray-300">Add a unique constraint to this field</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 space-y-0 rounded-md border border-[#1e2a3b] p-4">
          <Checkbox id="index" {...register("index")} />
          <div className="space-y-1 leading-none">
            <Label htmlFor="index" className="text-gray-200">
              Index
            </Label>
            <p className="text-sm text-gray-300">Add an index to this field for faster queries</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" className="border-[#1e2a3b] text-gray-200">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !fieldType}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
        >
          {isSubmitting ? "Adding..." : "Add Field"}
        </Button>
      </div>
    </form>
  )
}
