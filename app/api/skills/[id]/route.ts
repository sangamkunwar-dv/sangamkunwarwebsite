import { MongoClient, ObjectId } from "mongodb"
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let client
  try {
    const { id } = await params
    const body = await request.json()
    console.log("[v0] Updating skill in MongoDB...")

    client = await connectToDatabase()
    const db = client.db("portfolio")

    const result = await db.collection("skills").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updated_at: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const skill = await db.collection("skills").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      ...skill,
      id: skill?._id.toString(),
      _id: undefined,
    })
  } catch (err) {
    console.error("[v0] Error updating skill:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let client
  try {
    const { id } = await params
    console.log("[v0] Deleting skill from MongoDB...")

    client = await connectToDatabase()
    const db = client.db("portfolio")

    const result = await db.collection("skills").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] Error deleting skill:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
