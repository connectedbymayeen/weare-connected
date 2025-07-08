"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("user")
  const [noAdminsFound, setNoAdminsFound] = useState(false)
  const router = useRouter()
  const { login, adminLogin } = useAuth()

  // User login form state
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  })

  // Admin login form state
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  })

  const handleUserChange = (e) => {
    const { name, value } = e.target
    setUserCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdminChange = (e) => {
    const { name, value } = e.target
    setAdminCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    setNoAdminsFound(false)

    try {
      const { email, password } = userCredentials
      console.log("Submitting user login for:", email)
      const result = await login(email, password)

      if (!result.success) {
        setError(result.error || "Login failed. Please check your credentials.")
      } else {
        setSuccess("Login successful! Redirecting...")
        router.push("/")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    setNoAdminsFound(false)

    try {
      const { username, password } = adminCredentials
      console.log("Submitting admin login for:", username)
      const result = await adminLogin(username, password)

      if (!result.success) {
        // Check if the error is about no admin users
        if (result.error?.includes("No admin users found")) {
          setNoAdminsFound(true)
          setError("No admin users found in the database.")
        } else {
          setError(result.error || "Admin login failed. Please check your credentials.")
        }
      } else {
        setSuccess("Login successful! Redirecting to admin panel...")
        router.push("/admin")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="relative h-12 w-48 mx-auto">
              <h1 className="text-2xl font-bold">Connected</h1>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {noAdminsFound && (
          <Alert className="bg-blue-50 text-blue-800 border-blue-200 animate-in fade-in-50">
            <Settings className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p>No admin users found in the database.</p>
                <Link
                  href="/admin/setup"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  <Settings className="h-3 w-3" />
                  Go to Admin Setup
                </Link>
                <p className="text-sm">Create your first admin user to get started.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200 animate-in fade-in-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="user" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">User Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Login</CardTitle>
                <CardDescription>Enter your email and password to access your account.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUserSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={userCredentials.email}
                      onChange={handleUserChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={userCredentials.password}
                      onChange={handleUserChange}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && activeTab === "user" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter your admin credentials to access the admin panel.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAdminSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      name="username"
                      type="text"
                      placeholder="admin"
                      required
                      value={adminCredentials.username}
                      onChange={handleAdminChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      required
                      value={adminCredentials.password}
                      onChange={handleAdminChange}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && activeTab === "admin" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Admin Sign in"
                    )}
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/admin/setup"
                      className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      <Settings className="h-3 w-3" />
                      Need to create an admin user?
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}