"use client"

import { useEffect, useState } from "react"

export default function DisableInspect() {
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

    const handleCopy = (e: ClipboardEvent) => e.preventDefault()
    const handleCut = (e: ClipboardEvent) => e.preventDefault()
    const handlePaste = (e: ClipboardEvent) => e.preventDefault()
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
    <>
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
    </>
  )
}
