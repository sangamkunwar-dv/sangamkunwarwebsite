"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"

export default function ModernSignup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Signup Failed",
          description: data.error || "Unable to create account",
          variant: "destructive",
        })
        return
      }

      setSuccess(true)
      toast({
        title: "Account Created!",
        description: "Redirecting to login...",
      })

      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
        <Card className="p-8 text-center space-y-4 max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Account Created!</h2>
          <p className="text-muted-foreground">Your account has been successfully created. Redirecting to login...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground">Join and start collaborating</p>
        </div>

        {/* Signup Card */}
        <Card className="p-6 sm:p-8 border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="sangamkunwar"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="sangam@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 font-medium gap-2 mt-6 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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

          {/* Login Link */}
          <Link href="/auth/login">
            <Button variant="outline" className="w-full bg-transparent" disabled={loading}>
              Sign In Instead
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
