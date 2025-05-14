import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { FolderFiles } from "@/components/folder-files"

export default function ProjectsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <FolderFiles folderName="Projects" />
        </main>
      </div>
    </div>
  )
}
