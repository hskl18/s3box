"use client"

import { useState } from "react"
import {
  Download,
  FileText,
  FolderClosed,
  Grid,
  ImageIcon,
  List,
  MoreHorizontal,
  Music,
  Plus,
  Share2,
  Star,
  Trash2,
  Upload,
  Video,
} from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "./file-uploader"

// Mock data for demonstration
const folderData = {
  Documents: {
    files: [
      { id: 1, name: "Project Proposal.docx", type: "document", size: "245 KB", modified: "2 hours ago" },
      { id: 2, name: "Budget.xlsx", type: "document", size: "132 KB", modified: "Yesterday" },
      { id: 3, name: "Meeting Notes.pdf", type: "document", size: "567 KB", modified: "1 month ago" },
      { id: 4, name: "Contract.pdf", type: "document", size: "1.2 MB", modified: "2 months ago" },
    ],
    subfolders: [
      { id: 1, name: "Reports", files: 5 },
      { id: 2, name: "Contracts", files: 8 },
    ],
  },
  Images: {
    files: [
      { id: 1, name: "Team Photo.jpg", type: "image", size: "1.2 MB", modified: "3 days ago" },
      { id: 2, name: "Company Logo.png", type: "image", size: "345 KB", modified: "1 month ago" },
      { id: 3, name: "Product Banner.jpg", type: "image", size: "2.4 MB", modified: "2 weeks ago" },
      { id: 4, name: "Office Layout.png", type: "image", size: "567 KB", modified: "1 month ago" },
    ],
    subfolders: [
      { id: 1, name: "Marketing", files: 12 },
      { id: 2, name: "Product Photos", files: 24 },
    ],
  },
  Projects: {
    files: [
      { id: 1, name: "Project Plan.xlsx", type: "document", size: "245 KB", modified: "2 days ago" },
      { id: 2, name: "Presentation.pptx", type: "document", size: "4.8 MB", modified: "2 weeks ago" },
      { id: 3, name: "Demo Video.mp4", type: "video", size: "24.5 MB", modified: "Last week" },
      { id: 4, name: "Project Notes.docx", type: "document", size: "345 KB", modified: "Yesterday" },
    ],
    subfolders: [
      { id: 1, name: "Project Alpha", files: 8 },
      { id: 2, name: "Project Beta", files: 15 },
      { id: 3, name: "Project Gamma", files: 6 },
    ],
  },
}

interface FolderFilesProps {
  folderName: "Documents" | "Images" | "Projects"
}

export function FolderFiles({ folderName }: FolderFilesProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploader, setShowUploader] = useState(false)

  const folder = folderData[folderName]
  const files = folder.files
  const subfolders = folder.subfolders

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
          <h1 className="text-2xl font-bold">{folderName}</h1>
          <p className="text-sm text-gray-500">
            {files.length} files, {subfolders.length} folders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Select defaultValue="name">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="modified">Last modified</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowUploader(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {showUploader && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <FileUploader onClose={() => setShowUploader(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {/* Subfolders Section */}
          {subfolders.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">Folders</h2>
              <div
                className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
              >
                {subfolders.map((subfolder) => (
                  <Card
                    key={subfolder.id}
                    className={`cursor-pointer hover:bg-gray-50 ${viewMode === "list" ? "flex items-center" : ""}`}
                  >
                    <CardContent className={`flex ${viewMode === "grid" ? "flex-col" : ""} items-center gap-3 p-4`}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50">
                        <FolderClosed className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className={`${viewMode === "grid" ? "text-center" : "flex-1"}`}>
                        <h3 className="font-medium">{subfolder.name}</h3>
                        <p className="text-xs text-gray-500">{subfolder.files} files</p>
                      </div>
                      {viewMode === "list" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              <span>Star</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Card
                  className={`cursor-pointer border-dashed hover:bg-gray-50 ${viewMode === "list" ? "flex items-center" : ""}`}
                >
                  <CardContent
                    className={`flex ${viewMode === "grid" ? "flex-col" : ""} items-center justify-center gap-3 p-4`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                      <Plus className="h-6 w-6 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">New Folder</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Files Section */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">Files</h2>
            {files.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {files.map((file) => (
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
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                <span>Star</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
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
                            <span>{file.modified}</span>
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
                    <div className="col-span-3">Modified</div>
                    <div className="col-span-1"></div>
                  </div>
                  {files.map((file) => (
                    <div key={file.id} className="grid grid-cols-12 gap-2 border-b p-3 text-sm hover:bg-gray-50">
                      <div className="col-span-6 flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="col-span-2 flex items-center">{file.size}</div>
                      <div className="col-span-3 flex items-center">{file.modified}</div>
                      <div className="col-span-1 flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              <span>Star</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
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
                <FileText className="h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No files yet</h3>
                <p className="mt-2 text-sm text-gray-500">Upload files to get started</p>
                <Button className="mt-4" onClick={() => setShowUploader(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="p-8 text-center text-gray-500">Recent files will appear here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
