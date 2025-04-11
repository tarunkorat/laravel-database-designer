import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"

interface LayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#0a1120] text-white overflow-hidden">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}
