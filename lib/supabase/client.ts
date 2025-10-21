"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = "https://uhunxhnvvadynrfbsowp.supabase.co"
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodW54aG52dmFkeW5yZmJzb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjQ4MzksImV4cCI6MjA3NjQwMDgzOX0._-PUTbuGWF43nTZYOotl3zCem9S_vLVJe2lg0mRtx1E"

  return createBrowserClient(url, key)
}
