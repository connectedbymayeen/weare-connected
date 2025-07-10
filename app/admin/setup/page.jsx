"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Database, User, Loader2 } from "lucide-react"

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [setupStatus, setSetupStatus] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/check-setup")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      setDbStatus({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const createDefaultAdmin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/create-default", {
        method: "POST",
      })
      const data = await response.json()
      setSetupStatus(data)

      // Refresh database status
      if (data.success) {
        await checkDatabaseStatus()
      }
    } catch (error) {
      setSetupStatus({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Setup</h1>
          <p className="mt-2 text-gray-600">Set up your admin account and check database connection</p>
        </div>

        <div className="space-y-6">
          {/* Database Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
              <CardDescription>Check your MongoDB connection and admin users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={checkDatabaseStatus} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Database Status"
                )}
              </Button>

              {dbStatus && (
                <div className="space-y-2">
                  {dbStatus.success ? (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p>Database connected successfully!</p>
                          <p>Admin users: {dbStatus.adminCount}</p>
                          <p>Collections: {dbStatus.collections?.join(", ")}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Database connection failed: {dbStatus.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Creation Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Create Default Admin
              </CardTitle>
              <CardDescription>Create a default admin user if none exists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={createDefaultAdmin} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Default Admin"
                )}
              </Button>

              {setupStatus && (
                <div className="space-y-2">
                  {setupStatus.success ? (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p>{setupStatus.message}</p>
                          {setupStatus.credentials && (
                            <div className="bg-white p-3 rounded border">
                              <p className="font-semibold">Default Credentials:</p>
                              <p>
                                Username:{" "}
                                <code className="bg-gray-100 px-1 rounded">{setupStatus.credentials.username}</code>
                              </p>
                              <p>
                                Password:{" "}
                                <code className="bg-gray-100 px-1 rounded">{setupStatus.credentials.password}</code>
                              </p>
                              <p className="text-sm text-red-600 mt-2">
                                ⚠️ Please change these credentials after first login!
                              </p>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{setupStatus.message || setupStatus.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Check database status to ensure MongoDB is connected</li>
                <li>Create a default admin user if none exists</li>
                <li>
                  Go to the{" "}
                  <a href="/auth/login" className="text-blue-600 hover:underline">
                    login page
                  </a>{" "}
                  and use the admin tab
                </li>
                <li>Log in with the provided credentials</li>
                <li>Change your admin password in the admin panel</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
