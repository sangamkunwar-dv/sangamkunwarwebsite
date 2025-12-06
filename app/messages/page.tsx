"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function MessagesPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Sending...")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const result = await res.json()
      if (result.success) {
        setStatus("Message sent successfully!")
        setForm({ name: "", email: "", subject: "", message: "" })
      } else {
        setStatus("Failed to send message.")
      }
    } catch (err) {
      console.error(err)
      setStatus("Error sending message.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Send Me a Message</h1>
          <p className="text-muted-foreground mt-2">Connect with Sangam Kunwar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>

        {status && <p className="text-sm text-muted-foreground mt-2">{status}</p>}

        <p className="text-muted-foreground mt-4">Or create an account / login to stay connected:</p>

        <div className="space-y-3 mt-2">
          <Link href="/auth/signup" className="block">
            <Button className="w-full gap-2">
              Create Account
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Already have an account? Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
