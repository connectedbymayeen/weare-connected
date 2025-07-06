import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request) {
  try {
    const body = await request.json()
    const { path, secret } = body

    // Check for secret to confirm this is a legitimate request
    if (secret && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    // Revalidate the specified path
    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    // Also revalidate common blog-related paths
    revalidatePath("/blog")
    revalidatePath("/api/content/blog")

    console.log("Blog paths revalidated successfully")

    return NextResponse.json({
      revalidated: true,
      message: "Revalidation successful",
      paths: [path, "/blog", "/api/content/blog"].filter(Boolean),
    })
  } catch (err) {
    console.error("Revalidation error:", err)
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err.message,
      },
      { status: 500 },
    )
  }
}
