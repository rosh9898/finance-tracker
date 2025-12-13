import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/sonner"
import { SmartAddFab } from "@/components/smart-add-fab"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "NexaFlow",
  description: "Advanced Finance Tracking & Analytics",
  keywords: ["finance", "budget", "tracking", "money", "expenses", "income"],
  authors: [{ name: "NexaFlow" }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/20`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col md:flex-row">
            <Navigation />
            <main className="flex-1 w-full pb-20 md:pb-0">
              <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in duration-500">
                {children}
              </div>
            </main>
          </div>
          <SmartAddFab />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
