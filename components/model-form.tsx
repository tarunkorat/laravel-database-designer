"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ModelForm({ onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      tableName: "",
      timestamps: true,
      softDeletes: false,
    },
  })

  const onFormSubmit = (data) => {
    setIsSubmitting(true)
    try {
      onSubmit(data)
      reset()
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="name" className="text-gray-200">
            Model Name
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>The name of your model in PascalCase (e.g., User, BlogPost)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="name"
          placeholder="User"
          className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
          {...register("name", { required: "Model name is required" })}
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="tableName" className="text-gray-200">
            Table Name (Optional)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Custom table name. If left empty, Laravel will use the plural form of the model name.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="tableName"
          placeholder="users"
          className="bg-[#131e2d] border-[#1e2a3b] text-gray-200"
          {...register("tableName")}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 space-y-0 rounded-md border border-[#1e2a3b] p-4">
          <Checkbox id="timestamps" {...register("timestamps")} />
          <div className="space-y-1 leading-none">
            <Label htmlFor="timestamps" className="text-gray-200">
              Timestamps
            </Label>
            <p className="text-sm text-gray-300">Add created_at and updated_at columns to the table</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 space-y-0 rounded-md border border-[#1e2a3b] p-4">
          <Checkbox id="softDeletes" {...register("softDeletes")} />
          <div className="space-y-1 leading-none">
            <Label htmlFor="softDeletes" className="text-gray-200">
              Soft Deletes
            </Label>
            <p className="text-sm text-gray-300">Add deleted_at column for soft deletes</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" className="border-[#1e2a3b] text-gray-200">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
        >
          {isSubmitting ? "Adding..." : "Add Model"}
        </Button>
      </div>
    </form>
  )
}
