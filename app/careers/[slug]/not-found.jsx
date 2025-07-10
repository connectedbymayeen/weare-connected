import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900">Job Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">The job position you're looking for doesn't exist or may have been removed.</p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-purple-700 hover:bg-purple-800">
                <Link href="/careers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse All Jobs
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
