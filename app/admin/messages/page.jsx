"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, Trash2, Mail, MailOpen, Archive, Loader2, Filter } from "lucide-react"

export default function MessagesManagement() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [selectedMessages, setSelectedMessages] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch messages
  useEffect(() => {
    fetchMessages()
  }, [pagination.page, statusFilter, searchTerm])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : "",
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/messages?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data.messages)
      setPagination(data.pagination)
      setSelectedMessages([])
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMessages(messages.map((message) => message._id))
    } else {
      setSelectedMessages([])
    }
  }

  const handleSelectMessage = (id) => {
    setSelectedMessages((prev) => {
      if (prev.includes(id)) {
        return prev.filter((messageId) => messageId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleViewMessage = async (message) => {
    setCurrentMessage(message)
    setIsViewModalOpen(true)

    // If message is unread, mark it as read
    if (message.status === "unread") {
      try {
        const response = await fetch(`/api/admin/messages/${message._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        })

        if (response.ok) {
          // Update message status in the UI
          setMessages((prev) => prev.map((msg) => (msg._id === message._id ? { ...msg, status: "read" } : msg)))
        }
      } catch (err) {
        console.error("Error updating message status:", err)
      }
    }
  }

  const handleBatchAction = async (action) => {
    if (selectedMessages.length === 0) return

    try {
      setIsSubmitting(true)

      let status
      switch (action) {
        case "mark-read":
          status = "read"
          break
        case "mark-unread":
          status = "unread"
          break
        case "archive":
          status = "archived"
          break
        default:
          return
      }

      const response = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedMessages,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} messages`)
      }

      // Update messages in the UI
      setMessages((prev) =>
        prev.map((message) => (selectedMessages.includes(message._id) ? { ...message, status } : message)),
      )

      setSelectedMessages([])
    } catch (err) {
      console.error(`Error performing batch action ${action}:`, err)
      setError(`Failed to ${action} messages. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMessages = async () => {
    if (selectedMessages.length === 0) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/messages?ids=${selectedMessages.join(",")}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete messages")
      }

      // Remove deleted messages from the UI
      setMessages((prev) => prev.filter((message) => !selectedMessages.includes(message._id)))
      setSelectedMessages([])
      setIsDeleteModalOpen(false)
    } catch (err) {
      console.error("Error deleting messages:", err)
      setError("Failed to delete messages. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Manage contact form submissions</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-emperor focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {selectedMessages.length > 0 && (
              <div className="flex items-center space-x-2 pt-2">
                <span className="text-sm text-gray-500">{selectedMessages.length} selected</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchAction("mark-read")}
                  disabled={isSubmitting}
                >
                  <MailOpen className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchAction("mark-unread")}
                  disabled={isSubmitting}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Mark as Unread
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchAction("archive")}
                  disabled={isSubmitting}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-emperor" />
          <span className="ml-2 text-lg text-gray-600">Loading messages...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={fetchMessages}>
            Try Again
          </Button>
        </div>
      )}

      {/* Messages Table */}
      {!loading && !error && messages.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Checkbox checked={selectedMessages.length === messages.length} onCheckedChange={handleSelectAll} />
                  </th>
                  <th className="px-6 py-3 text-left">From</th>
                  <th className="px-6 py-3 text-left">Subject</th>
                  <th className="px-6 py-3 text-left">Message</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {messages.map((message) => (
                  <tr
                    key={message._id}
                    className={`hover:bg-gray-50 cursor-pointer ${message.status === "unread" ? "font-medium" : ""}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedMessages.includes(message._id)}
                        onCheckedChange={() => handleSelectMessage(message._id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-gray-500">{message.email}</div>
                    </td>
                    <td className="px-6 py-4">{message.subject || "No Subject"}</td>
                    <td className="px-6 py-4">
                      <div className="truncate max-w-xs">{message.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(message.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {!loading && !error && messages.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} messages
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && messages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't received any messages yet"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Message Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {currentMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{currentMessage.subject || "No Subject"}</DialogTitle>
                <DialogDescription>
                  From: {currentMessage.name} ({currentMessage.email})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>Received: {formatDate(currentMessage.createdAt)}</div>
                  <Badge className={getStatusColor(currentMessage.status)}>{currentMessage.status}</Badge>
                </div>

                {currentMessage.phone && (
                  <div className="text-sm">
                    <span className="font-medium">Phone:</span> {currentMessage.phone}
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="whitespace-pre-wrap">{currentMessage.message}</p>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleBatchAction(currentMessage.status === "read" ? "mark-unread" : "mark-read")
                      setIsViewModalOpen(false)
                    }}
                  >
                    {currentMessage.status === "read" ? (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Mark as Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4 mr-2" />
                        Mark as Read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleBatchAction("archive")
                      setIsViewModalOpen(false)
                    }}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedMessages([currentMessage._id])
                    setIsViewModalOpen(false)
                    setIsDeleteModalOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMessages.length} message
              {selectedMessages.length !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMessages} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
