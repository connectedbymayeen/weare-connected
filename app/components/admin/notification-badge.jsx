"use client"

import { useState, useEffect } from "react"

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/admin/messages/unread-count")
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Don't show badge if no unread messages or still loading
  if (loading || unreadCount === 0) {
    return null
  }

  return (
    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px] h-5">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )
}
