"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
      } else {
        setUser(session.user)
        fetchMessages()
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Fetch messages from your route.tsx GET API
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact")
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Failed to load messages", error)
    }
  }

  // Send message using Resend API (route.tsx)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.email,
          email: user.email,
          subject,
          message,
        }),
      })

      const result = await res.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
        })

        setSubject("")
        setMessage("")
        fetchMessages()
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Send Message Form */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-bold mb-6">Send Message to Sangam Kunwar</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="What is this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full">
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          {/* Message History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Messages</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages sent yet</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{msg.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
