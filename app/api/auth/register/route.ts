import { MongoClient } from "mongodb"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import * as bcrypt from "bcrypt"

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
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    client = await connectToDatabase()
    const db = client.db("portfolio")
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Set secure HTTP-only cookie with session token
    const sessionToken = Buffer.from(`${result.insertedId}:${Date.now()}`).toString("base64")
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: result.insertedId,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("[v0] Registration error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
