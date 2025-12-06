import { type NextRequest, NextResponse } from "next/server"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  read: boolean
}

// In-memory messages storage (demo only)
let messages: Message[] = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
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

    const adminEmail = process.env.ADMIN_EMAIL || "sangamkunwae48@gmail.com"
    const resendApiKey = process.env.RESEND_API_KEY || "re_fvxZHiHt_7EzQJkkKCaiFj3txkDBMydb8"
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sangamkunwar.com"

    // Send email via Resend
    try {
      const response = await fetch("https://api.resend.com/emails", {
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <h3 style="color: #333;">Message:</h3>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">
                Submitted at: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Resend API error:", errorText)
      } else {
        console.log("Email sent successfully to", adminEmail)
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    return NextResponse.json({ success: true, message: "Message sent successfully", id: newMessage.id }, { status: 200 })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ success: false, error: "Failed to process message" }, { status: 500 })
  }
}

// GET all messages (for admin)
export async function GET() {
  return NextResponse.json({ success: true, messages })
}

// DELETE message by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID required" }, { status: 400 })
    }

    messages = messages.filter((msg) => msg.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete message" }, { status: 500 })
  }
}
