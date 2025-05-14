"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { confirmRegistration } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = searchParams.get("username") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await confirmRegistration(formData)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error?.toString() || "Confirmation failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white font-bold">
              S3
            </div>
            <span className="ml-2 text-2xl font-semibold">S3Box</span>
          </div>
          <CardTitle className="text-2xl text-center">Confirm your account</CardTitle>
          <CardDescription className="text-center">Enter the confirmation code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
          {success ? (
            <div className="rounded-md bg-green-50 p-4 text-center">
              <p className="text-green-800">Account confirmed successfully!</p>
              <p className="mt-2 text-sm text-green-600">Redirecting to login page...</p>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={username} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Confirmation Code</Label>
                <Input id="code" name="code" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Confirming..." : "Confirm Account"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Didn&apos;t receive a code?{" "}
            <Link href="/resend-code" className="text-blue-600 hover:text-blue-500">
              Resend code
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
