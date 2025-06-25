"use client"

import { useState, useEffect } from "react"
import { UserX, UserCheck, Trash2, Search, RefreshCw } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - Admin access required")
        }
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const userData = await response.json()
      setUsers(userData)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleToggleStatus = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: "toggle" }))

      const user = users.find((u) => u.id === userId)
      const newStatus = !user.isActive

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "toggle-status",
          isActive: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: newStatus } : user)))
    } catch (error) {
      console.error("Error toggling user status:", error)
      alert("Failed to update user status. Please try again.")
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }))
    }
  }

  const handleDeleteUser = async (userId) => {
    const user = users.find((u) => u.id === userId)

    if (!confirm(`Are you sure you want to permanently delete user "${user?.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setActionLoading((prev) => ({ ...prev, [userId]: "delete" }))

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      // Remove user from local state
      setUsers(users.filter((user) => user.id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }))
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Users</h3>
              <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage registered users and their account status</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RefreshCw size={20} className="animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-muted-foreground">
                      {searchTerm ? (
                        <>
                          <p>No users found matching "{searchTerm}"</p>
                          <button onClick={() => setSearchTerm("")} className="text-primary hover:underline mt-2">
                            Clear search
                          </button>
                        </>
                      ) : (
                        <p>No users registered yet</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover bg-muted"
                            src={user.profileImage || "/placeholder.svg?height=40&width=40"}
                            alt={user.name || "User"}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{user.name || "Unknown User"}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={actionLoading[user.id] === "toggle"}
                          className={`p-1 rounded-full transition-colors disabled:opacity-50 ${
                            user.isActive
                              ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          }`}
                          title={user.isActive ? "Deactivate user" : "Activate user"}
                        >
                          {actionLoading[user.id] === "toggle" ? (
                            <RefreshCw size={18} className="animate-spin" />
                          ) : user.isActive ? (
                            <UserX size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading[user.id] === "delete"}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {actionLoading[user.id] === "delete" ? (
                            <RefreshCw size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      {!loading && users.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-red-600">{users.filter((u) => !u.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Inactive Users</div>
          </div>
        </div>
      )}
    </div>
  )
}
