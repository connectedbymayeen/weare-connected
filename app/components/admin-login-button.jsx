"use client"

import { useState } from "react"
import { LockKeyhole } from "lucide-react"

export default function AdminLoginButton() {
  const [showModal, setShowModal] = useState(false)

  const openAdminModal = () => {
    // Dispatch a custom event that the keyboard shortcut listener is watching for
    const event = new CustomEvent("openAdminLogin")
    document.dispatchEvent(event)

    // Also set local state to show a confirmation
    setShowModal(true)
    setTimeout(() => setShowModal(false), 2000)
  }

  return (
    <>
      <button
        onClick={openAdminModal}
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-30 hover:opacity-100 transition-opacity z-50"
        aria-label="Admin Login"
        title="Admin Login (Dev Helper)"
      >
        <LockKeyhole className="h-5 w-5" />
      </button>

      {showModal && (
        <div className="fixed bottom-16 right-4 bg-black text-white p-2 rounded text-sm">Opening admin login...</div>
      )}
    </>
  )
}
