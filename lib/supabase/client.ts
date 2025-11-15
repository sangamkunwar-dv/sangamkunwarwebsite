"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = "https://aydaylqulmokedvkemwo.supabase.co"
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZGF5bHF1bG1va2VkdmtlbXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTA3OTgsImV4cCI6MjA3ODc4Njc5OH0.45LTMHN4kBwqC6IVbWZgf7bzjDBsFru4hryZU0Y3jww"

  return createBrowserClient(url, key)
}
