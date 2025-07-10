"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"

export default function ApplicationError({ error, reset }) {
  useEffect(() => {
    console.error("Application page error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              There was an error loading the job application page. Please try again or go back to browse other
              positions.
            </p>
            <div className="space-y-2">
              <Button onClick={reset} className="w-full bg-purple-700 hover:bg-purple-800">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/careers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse All Jobs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
