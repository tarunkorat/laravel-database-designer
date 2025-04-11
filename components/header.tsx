"use client"

import type { ReactNode } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

interface HeaderProps {
  title?: string
  searchTerm?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
  showProjectBadge?: boolean
  actions?: ReactNode
}

export function Header({
  title,
  searchTerm = "",
  onSearchChange,
  showSearch = true,
  showProjectBadge = true,
  actions,
}: HeaderProps) {
  const activeProject = useStore((state) => state.activeProject)
  const projects = useStore((state) => state.projects)
  const currentProject = projects.find((p) => p.id === activeProject) || projects[0]

  return (
    <header className="border-b border-[#1e2a3b] bg-[#0a1120] backdrop-blur-lg z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {title && <h1 className="text-xl font-semibold text-white mr-4 hidden md:block">{title}</h1>}

        <div className="flex items-center gap-4 flex-1">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
              <Input
                placeholder="Search..."
                className="pl-8 w-64 bg-[#131e2d] border-[#1e2a3b] focus:border-[#2e3a4b] text-gray-200"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}

          {showProjectBadge && (
            <Badge variant="outline" className="bg-[#131e2d] border-[#1e2a3b] text-gray-200">
              Project: {currentProject?.name}
            </Badge>
          )}
        </div>

        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </header>
  )
}
