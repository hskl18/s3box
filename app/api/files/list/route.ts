import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { users, files } from "@/lib/db"

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const folderId = searchParams.get("folderId")
    const type = searchParams.get("type") || "all"

    let filesList

    switch (type) {
      case "starred":
        filesList = await files.getStarredByUser(dbUser.id)
        break
      case "trash":
        filesList = await files.getDeletedByUser(dbUser.id)
        break
      case "all":
      default:
        filesList = await files.getByUserAndFolder(dbUser.id, folderId ? Number.parseInt(folderId) : undefined)
        break
    }

    return NextResponse.json({ success: true, files: filesList })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
