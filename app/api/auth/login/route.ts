import { MongoClient } from "mongodb"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || ""

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured")
  }
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client
}

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 })
    }

    client = await connectToDatabase()
    const db = client.db("portfolio")
    const usersCollection = db.collection("users")

    // Find user by username or email
    const user = await usersCollection.findOne({
      $or: [{ username }, { email: username }],
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create session token
    const sessionToken = Buffer.from(`${user._id}:${Date.now()}`).toString("base64")

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("[v0] Login error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
