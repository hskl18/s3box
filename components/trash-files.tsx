"use client"

import { useState } from "react"
import { FileText, Grid, ImageIcon, List, MoreHorizontal, Music, RefreshCw, Trash2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const trashFiles = [
  { id: 1, name: "Old Report.docx", type: "document", size: "245 KB", deleted: "2 days ago" },
  { id: 2, name: "Outdated Budget.xlsx", type: "document", size: "132 KB", deleted: "1 week ago" },
  { id: 3, name: "Blurry Photo.jpg", type: "image", size: "1.2 MB", deleted: "2 weeks ago" },
  { id: 4, name: "Draft Presentation.pptx", type: "document", size: "4.8 MB", deleted: "3 weeks ago" },
]

export function TrashFiles() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case "document":
        return <FileText className="h-6 w-6 text-green-500" />
      case "video":
        return <Video className="h-6 w-6 text-red-500" />
      case "audio":
        return <Music className="h-6 w-6 text-purple-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trash</h1>
          <p className="text-sm text-gray-500">Files are permanently deleted after 30 days</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Select defaultValue="deleted">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="deleted">Date deleted</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive">Empty Trash</Button>
        </div>
      </div>

      {trashFiles.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trashFiles.map((file) => (
              <Card key={file.id} className="cursor-pointer hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                      {getFileIcon(file.type)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Restore</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete permanently</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <h3 className="font-medium truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{file.size}</span>
                      <span>Deleted {file.deleted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white">
            <div className="grid grid-cols-12 gap-2 border-b bg-gray-50 p-3 text-sm font-medium text-gray-500">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Deleted</div>
              <div className="col-span-1"></div>
            </div>
            {trashFiles.map((file) => (
              <div key={file.id} className="grid grid-cols-12 gap-2 border-b p-3 text-sm hover:bg-gray-50">
                <div className="col-span-6 flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="col-span-2 flex items-center">{file.size}</div>
                <div className="col-span-3 flex items-center">{file.deleted}</div>
                <div className="col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Restore</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete permanently</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Trash2 className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
          <p className="mt-2 text-sm text-gray-500">Deleted files will appear here</p>
        </div>
      )}
    </div>
  )
}
