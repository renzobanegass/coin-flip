import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const winner = searchParams.get("winner") === "true"
    const result = searchParams.get("result") || "heads"
    const choice = searchParams.get("choice") || "heads"
    const payout = Number.parseFloat(searchParams.get("payout") || "0")
    const pot = Number.parseFloat(searchParams.get("pot") || "0")
    const username = searchParams.get("username") || "Anonymous"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: winner ? "#f0fdf4" : "#fef2f2",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 16 }}>🪙</div>
          <div style={{ color: "#d97706" }}>Flip the Coin</div>
        </div>

        {/* Result */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>{winner ? "🏆" : "😔"}</div>
          <div style={{ fontSize: 48, marginBottom: 16, color: winner ? "#16a34a" : "#dc2626" }}>
            {winner ? "WINNER!" : "BETTER LUCK NEXT TIME"}
          </div>
          <div style={{ fontSize: 24, color: "#6b7280" }}>
            Coin: {result.toUpperCase()} • Pick: {choice.toUpperCase()}
          </div>
        </div>

        {/* Payout */}
        {winner && payout > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              marginBottom: 40,
              border: "2px solid #16a34a",
            }}
          >
            <div style={{ fontSize: 36, color: "#16a34a", marginBottom: 8 }}>+{payout.toFixed(2)} ETH</div>
            <div style={{ fontSize: 18, color: "#6b7280" }}>From ${pot} pot</div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            color: "#6b7280",
          }}
        >
          Join the next round at v0.app
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
