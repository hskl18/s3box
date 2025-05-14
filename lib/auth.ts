"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signIn, signUp, confirmSignUp, signOut } from "./cognito"
import { verifyToken } from "./jwt"

// Set cookies with authentication tokens
export async function setAuthCookies(tokens: {
  idToken?: string
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}) {
  const cookieStore = cookies()

  if (tokens.idToken) {
    cookieStore.set("id_token", tokens.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expiresIn || 3600,
      path: "/",
    })
  }

  if (tokens.accessToken) {
    cookieStore.set("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expiresIn || 3600,
      path: "/",
    })
  }

  if (tokens.refreshToken) {
    cookieStore.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })
  }
}

// Clear auth cookies
export async function clearAuthCookies() {
  const cookieStore = cookies()

  cookieStore.delete("id_token")
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")
}

// Login action
export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Username and password are required" }
  }

  const result = await signIn(username, password)

  if (result.success && result.idToken) {
    await setAuthCookies({
      idToken: result.idToken,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    })

    redirect("/")
  }

  return result
}

// Register action
export async function register(formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!username || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  return await signUp(username, password, email)
}

// Confirm registration action
export async function confirmRegistration(formData: FormData) {
  const username = formData.get("username") as string
  const code = formData.get("code") as string

  if (!username || !code) {
    return { success: false, error: "Username and confirmation code are required" }
  }

  return await confirmSignUp(username, code)
}

// Logout action
export async function logout() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("access_token")?.value

  if (accessToken) {
    await signOut(accessToken)
  }

  await clearAuthCookies()
  redirect("/login")
}

// Get current user from token
export async function getCurrentUser() {
  const cookieStore = cookies()
  const idToken = cookieStore.get("id_token")?.value

  if (!idToken) {
    return null
  }

  try {
    const payload = await verifyToken(idToken)
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Middleware to check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
