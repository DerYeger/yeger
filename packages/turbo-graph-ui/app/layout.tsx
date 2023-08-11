import { FilterInput, TaskInput } from '../components/GraphInputs'
import './globals.css'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full w-full">
      <body className="m-0 h-full w-full">
        <main className="relative flex h-full w-full flex-col">
          <div className="absolute left-0 top-0 z-10 flex w-96 max-w-full flex-col gap-2 p-2">
            <TaskInput defaultValue="build" />
            <FilterInput />
          </div>
          {children}
        </main>
      </body>
    </html>
  )
}
