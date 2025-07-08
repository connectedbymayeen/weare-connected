"use client"

import { useState, useEffect } from "react"
import AdminLoginModal from "./admin-login-modal"

export default function KeyboardShortcutListener() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState([])

  // Add debug info with timestamp
  const addDebugInfo = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    console.log(`[${timestamp}] ${message}`)
    setDebugInfo((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)])
  }

  useEffect(() => {
    addDebugInfo("KeyboardShortcutListener mounted")

    // Track key states
    const keyState = {
      Control: false,
      Shift: false,
      a: false,
      A: false,
    }

    const handleKeyDown = (e) => {
      // Update key state
      if (e.key in keyState) {
        keyState[e.key] = true
        addDebugInfo(`Key down: ${e.key}`)
      }

      // Check for Ctrl+Shift+A combination
      if (
        (keyState.Control || e.ctrlKey) &&
        (keyState.Shift || e.shiftKey) &&
        (keyState.a || keyState.A || e.key === "a" || e.key === "A")
      ) {
        addDebugInfo("🎯 ADMIN SHORTCUT DETECTED!")
        e.preventDefault()
        setIsModalOpen(true)
      }
    }

    const handleKeyUp = (e) => {
      // Reset key state
      if (e.key in keyState) {
        keyState[e.key] = false
        addDebugInfo(`Key up: ${e.key}`)
      }
    }

    // Custom event handler for button click
    const handleCustomEvent = () => {
      addDebugInfo("Custom event received")
      setIsModalOpen(true)
    }

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    document.addEventListener("openAdminLogin", handleCustomEvent)

    addDebugInfo("All event listeners added")

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("openAdminLogin", handleCustomEvent)
      addDebugInfo("Event listeners removed")
    }
  }, [])

  return (
    <>
      <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Debug button - always visible */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg z-50 flex items-center justify-center w-10 h-10"
        aria-label="Admin Login"
      >
        A
      </button>

      {/* Debug panel - only in development */}
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded text-xs max-w-xs max-h-60 overflow-auto z-50">
          <h4 className="font-bold mb-1">Debug Info:</h4>
          <ul>
            {debugInfo.map((info, i) => (
              <li key={i} className="opacity-90">
                {info}
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-white/20">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-2 py-1 rounded text-xs w-full"
            >
              Open Admin Modal
            </button>
          </div>
        </div>
      )}
    </>
  )
}
