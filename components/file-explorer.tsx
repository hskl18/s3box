"use client"

import { useState, useEffect } from "react"
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
import { toast } from "@/hooks/use-toast"

interface FileItem {
  id: number
  name: string
  type: string
  size: number
  is_folder: boolean
  is_starred: boolean
  created_at: string
  updated_at: string
  s3_key: string
}

export function FileExplorer() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploader, setShowUploader] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    fetchFiles()
  }, [currentFolder])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const url = new URL("/api/files/list", window.location.origin)
      if (currentFolder !== null) {
        url.searchParams.append("folderId", currentFolder.toString())
      }

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error("Failed to fetch files")
      }

      const data = await response.json()

      // Separate files and folders
      const folderItems = data.files.filter((item: FileItem) => item.is_folder)
      const fileItems = data.files.filter((item: FileItem) => !item.is_folder)

      setFolders(folderItems)
      setFiles(fileItems)
    } catch (error) {
      console.error("Error fetching files:", error)
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:")
    if (!folderName) return

    try {
      const response = await fetch("/api/files/folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          parentFolderId: currentFolder,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create folder")
      }

      toast({
        title: "Folder created",
        description: `Folder "${folderName}" created successfully`,
      })

      fetchFiles()
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleOpenFolder = (folderId: number) => {
    setCurrentFolder(folderId)
  }

  const handleNavigateUp = () => {
    // This would need to fetch the parent folder ID from the current folder
    // For simplicity, we're just setting it to null to go to the root
    setCurrentFolder(null)
  }

  const handleDownloadFile = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files/download/${file.id}`)
      if (!response.ok) {
        throw new Error("Failed to generate download link")
      }

      const data = await response.json()

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = data.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Download failed",
        description: "Could not download the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStar = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files/star/${file.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isStarred: !file.is_starred,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update star status")
      }

      toast({
        title: file.is_starred ? "Removed from starred" : "Added to starred",
        description: `"${file.name}" ${file.is_starred ? "removed from" : "added to"} starred files`,
      })

      fetchFiles()
    } catch (error) {
      console.error("Error toggling star:", error)
      toast({
        title: "Error",
        description: "Failed to update star status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFile = async (file: FileItem) => {
    if (!confirm(`Are you sure you want to move "${file.name}" to trash?`)) {
      return
    }

    try {
      const response = await fetch(`/api/files/delete/${file.id}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      toast({
        title: "Moved to trash",
        description: `"${file.name}" moved to trash`,
      })

      fetchFiles()
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to move file to trash. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    } else if (type.startsWith("video/")) {
      return <Video className="h-6 w-6 text-red-500" />
    } else if (type.startsWith("audio/")) {
      return <Music className="h-6 w-6 text-purple-500" />
    } else {
      return <FileText className="h-6 w-6 text-green-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{currentFolder ? "Folder Contents" : "My Files"}</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `${folders.length} folders, ${files.length} files`}
          </p>
        </div>
        <div className="flex gap-2">
          {currentFolder !== null && (
            <Button variant="outline" onClick={handleNavigateUp}>
              Up
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="updated_at">Last modified</SelectItem>
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
            <FileUploader
              onClose={() => setShowUploader(false)}
              parentFolderId={currentFolder?.toString()}
              onUploadComplete={fetchFiles}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <p>Loading files...</p>
            </div>
          ) : (
            <>
              {/* Folders Section */}
              {folders.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 text-lg font-semibold">Folders</h2>
                  <div
                    className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
                  >
                    {folders.map((folder) => (
                      <Card
                        key={folder.id}
                        className={`cursor-pointer hover:bg-gray-50 ${viewMode === "list" ? "flex items-center" : ""}`}
                        onClick={() => handleOpenFolder(folder.id)}
                      >
                        <CardContent className={`flex ${viewMode === "grid" ? "flex-col" : ""} items-center gap-3 p-4`}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50">
                            <FolderClosed className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className={`${viewMode === "grid" ? "text-center" : "flex-1"}`}>
                            <h3 className="font-medium">{folder.name}</h3>
                            <p className="text-xs text-gray-500">Updated {formatDate(folder.updated_at)}</p>
                          </div>
                          {viewMode === "list" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleStar(folder)
                                  }}
                                >
                                  <Star className={`mr-2 h-4 w-4 ${folder.is_starred ? "text-yellow-400" : ""}`} />
                                  <span>{folder.is_starred ? "Unstar" : "Star"}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteFile(folder)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
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
                      onClick={handleCreateFolder}
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
                                  <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Download</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleStar(file)}>
                                    <Star className={`mr-2 h-4 w-4 ${file.is_starred ? "text-yellow-400" : ""}`} />
                                    <span>{file.is_starred ? "Unstar" : "Star"}</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    <span>Share</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteFile(file)} className="text-red-600">
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
                                <span>{formatFileSize(file.size)}</span>
                                <span>{formatDate(file.updated_at)}</span>
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
                          <div className="col-span-2 flex items-center">{formatFileSize(file.size)}</div>
                          <div className="col-span-3 flex items-center">{formatDate(file.updated_at)}</div>
                          <div className="col-span-1 flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStar(file)}>
                                  <Star className={`mr-2 h-4 w-4 ${file.is_starred ? "text-yellow-400" : ""}`} />
                                  <span>{file.is_starred ? "Unstar" : "Star"}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteFile(file)} className="text-red-600">
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
            </>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="p-8 text-center text-gray-500">Recent files will appear here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
