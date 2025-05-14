import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { users, files } from "@/lib/db"
import { generateS3Key, uploadFile } from "@/lib/s3"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const dbUser = await users.getByCognitoId(user.sub)
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const parentFolderId = formData.get("parentFolderId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get file details
    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Generate S3 key and upload file
    const s3Key = generateS3Key(dbUser.id.toString(), fileName)
    const uploadResult = await uploadFile(fileBuffer, s3Key, fileType)

    if (!uploadResult.success) {
      return NextResponse.json({ error: "Failed to upload file to S3" }, { status: 500 })
    }

    // Save file metadata to database
    const newFile = await files.create(
      dbUser.id,
      fileName,
      fileType,
      fileSize,
      s3Key,
      parentFolderId ? Number.parseInt(parentFolderId) : undefined,
    )

    return NextResponse.json({ success: true, file: newFile })
  } catch (error) {
    console.error("Error handling file upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
