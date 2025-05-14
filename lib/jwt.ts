import { jwtVerify } from "jose"

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    // In production, you should use the actual JWT secret or JWKS from Cognito
    // This is a placeholder for development
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    })

    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    throw error
  }
}
