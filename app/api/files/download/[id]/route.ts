import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { users, files, sharedFiles } from "@/lib/db"
import { getPresignedUrl } from "@/lib/s3"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = Number.parseInt(params.id)

    // Get file from database
    const result = await files.getById(fileId)
    if (!result) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if user owns the file or has access to it
    if (result.user_id !== dbUser.id) {
      // Check if file is shared with the user
      const sharedWithUser = await sharedFiles.getByFileAndUser(fileId, dbUser.id)
      if (!sharedWithUser) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    // Generate presigned URL for download
    const presignedUrl = await getPresignedUrl(result.s3_key)
    if (!presignedUrl.success) {
      return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: presignedUrl.url })
  } catch (error) {
    console.error("Error handling file download:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
