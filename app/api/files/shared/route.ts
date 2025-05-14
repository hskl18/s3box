import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { users, sharedFiles } from "@/lib/db"

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
    const type = searchParams.get("type") || "with-me"

    let sharedFilesList

    if (type === "by-me") {
      sharedFilesList = await sharedFiles.getSharedByUser(dbUser.id)
    } else {
      sharedFilesList = await sharedFiles.getSharedWithUser(dbUser.id)
    }

    return NextResponse.json({ success: true, files: sharedFilesList })
  } catch (error) {
    console.error("Error listing shared files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
