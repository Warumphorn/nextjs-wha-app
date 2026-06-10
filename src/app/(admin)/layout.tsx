import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter, JetBrains_Mono, Prompt } from "next/font/google"
import { cn } from "@/lib/utils"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/admin/sidebar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const interHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "700",
  display: "swap",
})

const prompt = Prompt({
  weight: ["400", "600", "700"],
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ผู้ดูแลระบบ",
  description: "หน้าจัดการระบบ",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={cn(
        inter.variable,
        interHeading.variable,
        prompt.variable,
        jetbrainsMono.variable,
        "font-sans",
        "dark"
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Suspense fallback={<div className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-card" />}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 pl-64">
              <div className="p-8">
                <Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
                  {children}
                </Suspense>
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
