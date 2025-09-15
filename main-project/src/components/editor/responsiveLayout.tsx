"use client"

import type * as React from "react"
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

// Assuming these are your existing components
interface LayoutProps {
  Left: React.ComponentType
  Right: React.ComponentType
}

export default function ResponsiveLayout({ Left, Right }: LayoutProps) {
    return (
    <div>

      <SidebarProvider>

        {/* Left Sidebar - will be hidden on mobile and shown as overlay when triggered */}
        <Sidebar side="left" variant="sidebar" className="hidden md:block md:col-span-1">
            <SidebarContent>
                <div className="h-full bg-gray-400/10 p-4">
                <Left />
                </div>
            </SidebarContent>
        </Sidebar>
  

        {/* Right Content - full width with sidebar trigger button */}
        <SidebarInset className="col-span-1 xl:col-span-4">
            <div className="relative">
                {/* Sidebar trigger button - only visible on mobile */}
                <div className="z-10 flex items-center border-b bg-background px-4">
                    <SidebarTrigger/>
                </div>
        
                <div className="p-4 h-screen">
                    <Right />
                </div>


            </div>
        </SidebarInset>

      </SidebarProvider>
      
    </div>
    )
  }