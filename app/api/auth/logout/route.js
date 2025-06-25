import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear both user and admin tokens
    cookieStore.delete("auth-token")
    cookieStore.delete("admin-token")

    // Also set expired cookies to ensure they're cleared
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    })

    // Set expired cookies to ensure cleanup
    response.cookies.set("auth-token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    response.cookies.set("admin-token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        message: "Error logging out",
        success: false,
      },
      { status: 500 },
    )
  }
}
