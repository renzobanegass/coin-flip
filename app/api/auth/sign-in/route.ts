import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    const { fid } = await req.json()

    // Mock user data for simplified implementation
    const mockUser = {
      fid,
      username: `user${fid}`,
      display_name: `User ${fid}`,
      pfp_url: "/images/icon.png",
      custody_address: "0x1234567890123456789012345678901234567890",
      verifications: [],
    }

    return NextResponse.json({ success: true, user: mockUser })
  } catch (error) {
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 })
  }
}
