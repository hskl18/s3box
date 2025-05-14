"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, FolderClosed, Home, Menu, Plus, Share2, Star, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(true)

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Files</h2>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button asChild variant="ghost" className="justify-start gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start gap-2">
        <Link href="/starred">
          <Star className="h-4 w-4" />
          <span>Starred</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start gap-2">
        <Link href="/shared">
          <Share2 className="h-4 w-4" />
          <span>Shared</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start gap-2">
        <Link href="/trash">
          <Trash2 className="h-4 w-4" />
          <span>Trash</span>
        </Link>
      </Button>

      <div className="mt-6">
        <div className="flex items-center gap-1 mb-2">
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="text-sm font-medium">My folders</span>
        </div>

        {isOpen && (
          <div className="ml-4 space-y-1">
            <Button asChild variant="ghost" className="h-8 justify-start gap-2 w-full">
              <Link href="/folders/documents">
                <FolderClosed className="h-4 w-4" />
                <span>Documents</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-8 justify-start gap-2 w-full">
              <Link href="/folders/images">
                <FolderClosed className="h-4 w-4" />
                <span>Images</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-8 justify-start gap-2 w-full">
              <Link href="/folders/projects">
                <FolderClosed className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-auto space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Storage</span>
            <span>2.4 GB / 15 GB</span>
          </div>
          <Progress value={16} className="h-2" />
        </div>
        <Button className="w-full gap-2">
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden w-64 border-r bg-white md:block">
      <ScrollArea className="h-full">
        <SidebarContent />
      </ScrollArea>
    </div>
  )
}
