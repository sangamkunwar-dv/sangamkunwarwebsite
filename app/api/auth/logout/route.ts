import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (err) {
    console.error("[v0] Logout error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
