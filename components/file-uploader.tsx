"use client"

import type React from "react"

import { useState, useRef } from "react"
import { File, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface FileUploaderProps {
  onClose: () => void
  parentFolderId?: string
  onUploadComplete?: () => void
}

export function FileUploader({ onClose, parentFolderId, onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    let completed = 0
    const totalFiles = files.length
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData()
        formData.append("file", file)
        if (parentFolderId) {
          formData.append("parentFolderId", parentFolderId)
        }

        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        completed++
        setProgress(Math.round((completed / totalFiles) * 100))
        return await response.json()
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        throw error
      }
    })

    try {
      await Promise.all(uploadPromises)
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${totalFiles} file${totalFiles > 1 ? "s" : ""}`,
      })

      if (onUploadComplete) {
        onUploadComplete()
      }

      setTimeout(() => {
        setUploading(false)
        setFiles([])
        setProgress(0)
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Error during upload:", error)
      toast({
        title: "Upload failed",
        description: "Some files could not be uploaded. Please try again.",
        variant: "destructive",
      })
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Upload Files</h3>
        <Button variant="ghost" size="icon" onClick={onClose} disabled={uploading}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Upload className="h-6 w-6 text-blue-500" />
        </div>
        <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          disabled={uploading}
        />
        <Button
          variant="outline"
          className="mt-4"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          Select Files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          <div className="max-h-40 overflow-y-auto rounded-md border">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between border-b p-2 last:border-0">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                {!uploading && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={uploadFiles} disabled={files.length === 0 || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  )
}
