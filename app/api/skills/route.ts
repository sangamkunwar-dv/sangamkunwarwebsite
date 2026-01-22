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
    console.log("[v0] Fetching skills from MongoDB...")
    client = await connectToDatabase()
    const db = client.db("portfolio")

    const skills = await db
      .collection("skills")
      .find()
      .sort({ updated_at: -1 })
      .toArray()

    const serialized = skills.map((s: any) => ({
      ...s,
      id: s._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json(serialized)
  } catch (err) {
    console.error("[v0] Error fetching skills:", err)
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
    console.log("[v0] Creating skill in MongoDB...")

    client = await connectToDatabase()
    const db = client.db("portfolio")

    const result = await db.collection("skills").insertOne({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const skill = await db.collection("skills").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        ...skill,
        id: skill?._id.toString(),
        _id: undefined,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("[v0] Error creating skill:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
