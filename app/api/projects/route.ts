import { MongoClient } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

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
    if (!MONGODB_URI) {
      console.log("[v0] MONGODB_URI not configured - returning empty array")
      return NextResponse.json([])
    }

    console.log("[v0] Fetching projects from MongoDB...")
    client = await connectToDatabase()
    const db = client.db("portfolio")

    const projects = await db
      .collection("projects")
      .find()
      .sort({ created_at: -1 })
      .toArray()

    const serialized = projects.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
    }))

    console.log(`[v0] Found ${serialized.length} projects`)
    return NextResponse.json(serialized)
  } catch (err) {
    console.error("[v0] Error fetching projects:", err)
    return NextResponse.json([], { status: 200 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()

    if (!MONGODB_URI) {
      console.error("[v0] MONGODB_URI not configured")
      return NextResponse.json(
        { error: "MongoDB not configured. Please set MONGODB_URI environment variable." },
        { status: 500 }
      )
    }

    console.log("[v0] Creating project in MongoDB...")
    client = await connectToDatabase()
    const db = client.db("portfolio")

    const result = await db.collection("projects").insertOne({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const project = await db.collection("projects").findOne({ _id: result.insertedId })

    console.log("[v0] Project created successfully:", result.insertedId)
    return NextResponse.json(
      {
        ...project,
        id: project?._id.toString(),
        _id: undefined,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("[v0] Error creating project:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
