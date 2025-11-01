// app/layout.tsx
import React from "react";
import Head from "next/head";
import "./globals.css";

export const metadata = {
  title: "My Website",
  description: "This is my awesome website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Favicon using external link (optional, must be .png or .ico) */}
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sangamkunwar-photo-GXq7pe8eUe2K2gZjVFHR0dsmMu91d4.jpg"
          type="image/png"
        />
      </Head>
      <body>
        {/* Header with external logo */}
        <header style={{ display: "flex", alignItems: "center", padding: "10px 20px" }}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sangamkunwar-photo-GXq7pe8eUe2K2gZjVFHR0dsmMu91d4.jpg"
            alt="Logo"
            style={{ height: 50, width: 50, borderRadius: "50%", marginRight: 10 }}
          />
          <h1 style={{ fontSize: "1.5rem" }}>{metadata.title}</h1>
        </header>

        {/* Main content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
