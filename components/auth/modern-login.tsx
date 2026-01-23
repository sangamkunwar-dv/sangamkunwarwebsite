"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function ModernLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Welcome back! Redirecting...",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 800)
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username or Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="sangamkunwar or email@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 font-medium gap-2 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Sign Up Link */}
          <Link href="/auth/signup">
            <Button variant="outline" className="w-full bg-transparent" disabled={loading}>
              Create Account
            </Button>
          </Link>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Protected by secure HTTP-only cookies
        </p>
      </div>
    </div>
  )
}
