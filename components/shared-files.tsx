"use client"

import { useState } from "react"
import {
  Download,
  FileText,
  Grid,
  ImageIcon,
  List,
  MoreHorizontal,
  Music,
  Share2,
  Star,
  Trash2,
  Users,
  Video,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

// Mock data for demonstration
const sharedFiles = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "245 KB",
    modified: "2 hours ago",
    sharedBy: "Alex Johnson",
    avatar: "AJ",
  },
  {
    id: 2,
    name: "Marketing Budget.xlsx",
    type: "document",
    size: "132 KB",
    modified: "Yesterday",
    sharedBy: "Sarah Miller",
    avatar: "SM",
  },
  {
    id: 3,
    name: "Conference Photos.jpg",
    type: "image",
    size: "1.2 MB",
    modified: "3 days ago",
    sharedBy: "David Chen",
    avatar: "DC",
  },
  {
    id: 4,
    name: "Client Presentation.pptx",
    type: "document",
    size: "4.8 MB",
    modified: "2 weeks ago",
    sharedBy: "Emma Wilson",
    avatar: "EW",
  },
]

const sharedWithMe = [
  {
    id: 5,
    name: "Q4 Financial Report.pdf",
    type: "document",
    size: "3.2 MB",
    modified: "1 day ago",
    sharedBy: "Robert Taylor",
    avatar: "RT",
  },
  {
    id: 6,
    name: "Product Roadmap.xlsx",
    type: "document",
    size: "567 KB",
    modified: "5 days ago",
    sharedBy: "Jennifer Lee",
    avatar: "JL",
  },
]

export function SharedFiles() {
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
          <h1 className="text-2xl font-bold">Shared Files</h1>
          <p className="text-sm text-gray-500">Files shared with you and by you</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Select defaultValue="modified">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="modified">Last modified</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="sharedBy">Shared by</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="shared-with-me" className="w-full">
        <TabsList>
          <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
          <TabsTrigger value="shared-by-me">Shared by me</TabsTrigger>
        </TabsList>

        <TabsContent value="shared-with-me" className="mt-4">
          {sharedWithMe.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sharedWithMe.map((file) => (
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="font-medium truncate" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">{file.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{file.sharedBy}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
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
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Shared by</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-1">Modified</div>
                  <div className="col-span-1"></div>
                </div>
                {sharedWithMe.map((file) => (
                  <div key={file.id} className="grid grid-cols-12 gap-2 border-b p-3 text-sm hover:bg-gray-50">
                    <div className="col-span-5 flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">{file.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{file.sharedBy}</span>
                    </div>
                    <div className="col-span-2 flex items-center">{file.size}</div>
                    <div className="col-span-1 flex items-center">{file.modified}</div>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove</span>
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
              <Users className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No files shared with you</h3>
              <p className="mt-2 text-sm text-gray-500">Files shared with you will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared-by-me" className="mt-4">
          {sharedFiles.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sharedFiles.map((file) => (
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
                              <span>Manage sharing</span>
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
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <span>Shared with</span>
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">{file.avatar}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
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
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Shared with</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-1">Modified</div>
                  <div className="col-span-1"></div>
                </div>
                {sharedFiles.map((file) => (
                  <div key={file.id} className="grid grid-cols-12 gap-2 border-b p-3 text-sm hover:bg-gray-50">
                    <div className="col-span-5 flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">{file.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{file.sharedBy}</span>
                    </div>
                    <div className="col-span-2 flex items-center">{file.size}</div>
                    <div className="col-span-1 flex items-center">{file.modified}</div>
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
                            <span>Manage sharing</span>
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
              <Share2 className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No files shared by you</h3>
              <p className="mt-2 text-sm text-gray-500">Files you share will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
