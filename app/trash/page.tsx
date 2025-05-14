import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TrashFiles } from "@/components/trash-files"

export default function TrashPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <TrashFiles />
        </main>
      </div>
    </div>
  )
}
