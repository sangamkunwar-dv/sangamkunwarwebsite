import { MongoClient, ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const MONGODB_URI = process.env.MONGODB_URI || ""

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured")
  }
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client
}

export async function GET() {
  let client
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Decode session token
    const decoded = Buffer.from(sessionToken, "base64").toString()
    const [userId] = decoded.split(":")

    client = await connectToDatabase()
    const db = client.db("portfolio")
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("[v0] Session check error:", err)
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
