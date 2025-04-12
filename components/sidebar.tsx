"use client"

import { Database, Code, FileCode, Settings, HelpCircle, Home, BookOpen, FolderKanban } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store"

export function Sidebar() {
  const pathname = usePathname()
  const activeProject = useStore((state) => state.activeProject)
  const projects = useStore((state) => state.projects)
  const currentProject = projects.find((p) => p.id === activeProject) || projects[0]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-16 md:w-64 bg-[#0a1120] border-r border-[#1e2a3b] flex flex-col">
      <div className="p-4 border-b border-[#1e2a3b]">
        <div className="flex items-center justify-center md:justify-start">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Database className="h-4 w-4 text-white" />
          </div>
          <span className="ml-2 font-bold text-lg hidden md:block">Migrator Pro</span>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center ${isActive("/dashboard") ? "text-white bg-[#131e2d]" : "text-gray-300 hover:text-white hover:bg-[#131e2d]"} px-4 py-2`}
            >
              <Home className="h-5 w-5 md:mr-3" />
              <span className="hidden md:block">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/designer"
              className={`flex items-center ${isActive("/designer") ? "text-white bg-[#131e2d]" : "text-gray-300 hover:text-white hover:bg-[#131e2d]"} px-4 py-2`}
            >
              <Database className="h-5 w-5 md:mr-3" />
              <span className="hidden md:block">Database Designer</span>
            </Link>
          </li>
          <li>
            <Link
              href="/migrations"
              className={`flex items-center ${isActive("/migrations") ? "text-white bg-[#131e2d]" : "text-gray-300 hover:text-white hover:bg-[#131e2d]"} px-4 py-2`}
            >
              <Code className="h-5 w-5 md:mr-3" />
              <span className="hidden md:block">Migrations</span>
            </Link>
          </li>
          <li>
            <Link
              href="/models"
              className={`flex items-center ${isActive("/models") ? "text-white bg-[#131e2d]" : "text-gray-300 hover:text-white hover:bg-[#131e2d]"} px-4 py-2`}
            >
              <FileCode className="h-5 w-5 md:mr-3" />
              <span className="hidden md:block">Models</span>
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`flex items-center ${isActive("/projects") ? "text-white bg-[#131e2d]" : "text-gray-300 hover:text-white hover:bg-[#131e2d]"} px-4 py-2`}
            >
              <FolderKanban className="h-5 w-5 md:mr-3" />
              <span className="hidden md:block">Projects</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-[#1e2a3b]">
        <div className="mb-4 hidden md:block">
          <div className="text-xs text-gray-400">CURRENT PROJECT</div>
          <div className="text-sm font-medium text-gray-200 truncate">{currentProject?.name}</div>
        </div>
      </div>
    </div>
  )
}
