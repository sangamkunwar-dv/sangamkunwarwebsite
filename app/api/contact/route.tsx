import { type NextRequest, NextResponse } from "next/server"

// Message Type
interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  read: boolean
}

// In-memory storage (demo)
let messages: Message[] = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    }

    messages.push(newMessage)

    const adminEmail = process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com"
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@nexoratech.com"

    if (!resendApiKey) {
      console.error("RESEND_API_KEY missing")
      return NextResponse.json(
        { success: false, error: "Resend API key missing" },
        { status: 500 }
      )
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `New Contact: ${subject}`,
        html: `
          <div style="font-family: Arial; max-width: 600px;">
            <h2>New Message</h2>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Subject:</b> ${subject}</p>
            <hr/>
            <p>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            <hr/>
            <small>Sent on ${new Date().toLocaleString()}</small>
          </div>
        `,
      }),
    })

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    )
  } catch (err) {
    console.error("POST ERROR:", err)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ success: true, messages })
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message ID required" },
        { status: 400 }
      )
    }

    messages = messages.filter((m) => m.id !== id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE ERROR:", err)
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    )
  }
}
