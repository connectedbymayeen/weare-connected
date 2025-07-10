"use client"

import { useState } from "react"
import { X, LogIn, Lock } from "lucide-react"

export default function AdminAccess() {
  const [showModal, setShowModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting admin login with:", { username })

      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("Login response:", { status: response.status, ok: response.ok })

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed")
      }

      // Successful login
      console.log("Login successful, redirecting to admin panel")
      window.location.href = "/admin"
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Simple, always visible admin login button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-800 p-3 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        aria-label="Admin Login"
      >
        <Lock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Admin Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Secure access for administrators only</p>
            </div>

            {error && (
              <div
                className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Access Admin Panel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
