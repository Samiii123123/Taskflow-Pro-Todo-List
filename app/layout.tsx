import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaskFlow Pro - Advanced Todo List & Task Management App",
  description:
    "Boost productivity with TaskFlow Pro - a feature-rich todo list app with task prioritization, categories, due dates, time tracking, dark mode, and Excel export. Perfect for personal and professional task management.",
  keywords:
    "todo list, task management, productivity app, task organizer, project management, time tracking, task planner, todo app, task scheduler, productivity tool",
  authors: [{ name: "Lakshay Dhoundiyal" }],
  creator: "Lakshay Dhoundiyal",
  publisher: "TaskFlow Pro",
  robots: "index, follow",
  openGraph: {
    title: "TaskFlow Pro - Advanced Todo List & Task Management",
    description:
      "Professional task management with priorities, categories, time tracking, and export features. Stay organized and boost your productivity.",
    type: "website",
    locale: "en_US",
    siteName: "TaskFlow Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow Pro - Advanced Todo List & Task Management",
    description: "Professional task management with priorities, categories, time tracking, and export features.",
    creator: "@LakshayD02",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  category: "productivity",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
