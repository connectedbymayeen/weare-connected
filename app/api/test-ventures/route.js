import { NextResponse } from "next/server"
import { getVentures } from "@/app/lib/data"

export async function GET() {
  try {
    console.log("=== TEST VENTURES API ===")

    const ventures = await getVentures()

    console.log(`API returned ${ventures.length} ventures`)

    return NextResponse.json({
      success: true,
      count: ventures.length,
      ventures: ventures,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test ventures API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
