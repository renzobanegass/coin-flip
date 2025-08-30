import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Test endpoint working!",
    timestamp: new Date().toISOString(),
  })
}
