import Link from "next/link"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">S3</div>
          <span className="text-xl font-semibold">S3Box</span>
        </Link>
      </div>
      <div className="relative hidden md:block max-w-md w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input type="search" placeholder="Search files and folders..." className="w-full pl-9" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex">
          Upgrade
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
