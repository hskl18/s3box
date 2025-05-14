import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SharedFiles } from "@/components/shared-files"

export default function SharedPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <SharedFiles />
        </main>
      </div>
    </div>
  )
}
