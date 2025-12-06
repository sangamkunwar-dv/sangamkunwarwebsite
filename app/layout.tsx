
"use client"

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { useEffect, useState } from "react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sangam Kunwar - Full Stack Developer",
  description: "It's me Sangam Kunwar - Full Stack Developer",
  generator: "sangamkunwar",
  icons: {
    icon: "/sangamkunwarphotos.png",
    shortcut: "/sangamkunwarphotos.png",
    apple: "/sangamkunwarphotos.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Block right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setShowModal(true)
    }

    // Block keys: F12, Ctrl+Shift+I/J/C, Ctrl+U, PrintScreen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault()
        setShowModal(true)
      }
    }

    // Disable copy, cut, paste
    const handleCopy = (e: ClipboardEvent) => e.preventDefault()
    const handleCut = (e: ClipboardEvent) => e.preventDefault()
    const handlePaste = (e: ClipboardEvent) => e.preventDefault()

    // Disable text selection
    const handleSelectStart = (e: Event) => e.preventDefault()

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("cut", handleCut)
    document.addEventListener("paste", handlePaste)
    document.addEventListener("selectstart", handleSelectStart)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("cut", handleCut)
      document.removeEventListener("paste", handlePaste)
      document.removeEventListener("selectstart", handleSelectStart)
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optional: For Apple touch icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/sangamkunwarphoto.jpeg" />
      </head>
      <body className="font-sans antialiased">
        {/* Modal for inspection warning */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm text-center">
              <h2 className="text-xl font-bold mb-2">Inspecting is blocked!</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You cannot inspect, copy, or take screenshots of this website.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
