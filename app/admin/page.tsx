"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AdminSidebar from "@/components/admin/sidebar"
import ProjectsManager from "@/components/admin/projects-manager"
import EventsManager from "@/components/admin/events-manager"
import CollaboratorsManager from "@/components/admin/collaborators-manager"
import DashboardOverview from "@/components/admin/dashboard-overview"
import MessagesManager from "@/components/admin/messages-manager"
import AdminSettings from "@/components/admin/admin-settings"
import HeroSettings from "@/components/admin/hero-settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type AdminTab = "overview" | "hero" | "projects" | "events" | "collaborators" | "messages" | "settings"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setUser(session.user)
        }
      } catch (err) {
        console.log("[v0] Auth check failed - using local auth")
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast({
          title: "Success",
          description: "Admin account created! Check your email to verify.",
        })
        setIsSignup(false)
        setEmail("")
        setPassword("")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast({ title: "Success", description: "Logged in successfully" })
      }
    } catch (err: any) {
      const errorMsg = err.message || "Authentication failed. Please check your Supabase credentials."
      setError(errorMsg)
      toast({ title: "Error", description: errorMsg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/admin` },
      })
      if (error) throw error
    } catch (err: any) {
      const errorMsg = err.message || `OAuth login with ${provider} failed.`
      setError(errorMsg)
      toast({ title: "Error", description: errorMsg, variant: "destructive" })
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setEmail("")
    setPassword("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md p-8 border border-border rounded-lg">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold mb-2">{isSignup ? "Create Admin Account" : "Admin Login"}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isSignup ? "Set up your admin account" : "Sign in to manage your portfolio"}
          </p>
          {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">{error}</div>}

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" onClick={() => handleOAuthLogin("google")}>Continue with Google</Button>
            <Button variant="outline" onClick={() => handleOAuthLogin("github")}>Continue with GitHub</Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => { setIsSignup(!isSignup); setEmail(""); setPassword(""); setError("") }}
              className="text-primary hover:underline"
            >
              {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "hero" && <HeroSettings />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "events" && <EventsManager />}
          {activeTab === "collaborators" && <CollaboratorsManager />}
          {activeTab === "messages" && <MessagesManager />}
          {activeTab === "settings" && <AdminSettings userEmail={user.email} />}
        </div>
      </main>
    </div>
  )
}
