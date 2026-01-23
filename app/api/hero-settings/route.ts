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
      console.log("[v0] MONGODB_URI not configured - returning empty object")
      return NextResponse.json({})
    }

    console.log("[v0] Fetching hero settings from MongoDB...")
    client = await connectToDatabase()
    const db = client.db("portfolio")

    const settings = await db.collection("hero_settings").findOne()

    console.log("[v0] Hero settings fetched successfully")
    return NextResponse.json(settings || {})
  } catch (err) {
    console.error("[v0] Error fetching hero settings:", err)
    return NextResponse.json({}, { status: 200 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}

export async function PUT(request: NextRequest) {
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

    console.log("[v0] Updating hero settings in MongoDB...")
    client = await connectToDatabase()
    const db = client.db("portfolio")

    const existing = await db.collection("hero_settings").findOne()

    if (existing) {
      await db.collection("hero_settings").updateOne(
        { _id: existing._id },
        { $set: { ...body, updated_at: new Date() } }
      )

      const updated = await db.collection("hero_settings").findOne({ _id: existing._id })
      console.log("[v0] Hero settings updated successfully")
      return NextResponse.json(updated)
    } else {
      const result = await db.collection("hero_settings").insertOne({
        ...body,
        created_at: new Date(),
        updated_at: new Date(),
      })

      const inserted = await db.collection("hero_settings").findOne({ _id: result.insertedId })
      console.log("[v0] Hero settings created successfully")
      return NextResponse.json(inserted, { status: 201 })
    }
  } catch (err) {
    console.error("[v0] Error updating hero settings:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
