"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { useEffect, useState } from "react"
import Head from "next/head"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setShowModal(true)
    }

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

    const prevent = (e: Event) => e.preventDefault()

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", prevent)
    document.addEventListener("cut", prevent)
    document.addEventListener("paste", prevent)
    document.addEventListener("selectstart", prevent)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", prevent)
      document.removeEventListener("cut", prevent)
      document.removeEventListener("paste", prevent)
      document.removeEventListener("selectstart", prevent)
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Sangam Kunwar - Full Stack Developer</title>
        <meta
          name="description"
          content="It's me Sangam Kunwar - Full Stack Developer"
        />
        <link rel="icon" href="/sangamkunwarphotos.png" />
        <link rel="apple-touch-icon" href="/sangamkunwarphotos.png" />
      </Head>

      <body className={`${geist.className} ${geistMono.className}`}>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm text-center">
              <h2 className="text-xl font-bold mb-2">
                Inspecting is blocked!
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                You cannot inspect, copy, or take screenshots of this website.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}
