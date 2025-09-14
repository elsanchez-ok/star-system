import type React from "react"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { AnimatedBackground } from "@/components/ui/animated-background"
import "./globals.css"

// ✅ Usa Inter (fuente gratuita de Google Fonts) — 100% compatible
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: "Sistema Escolar Futurista | Gestión Educativa Avanzada",
  description:
    "Sistema integral de gestión escolar con reconocimiento facial, códigos QR, y notificaciones automáticas. Diseñado para instituciones educativas modernas.",
  keywords:
    "sistema escolar, gestión educativa, reconocimiento facial, códigos QR, asistencias, notificaciones automáticas",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen relative`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {/* Fondo animado con partículas para efecto futurista */}
          <AnimatedBackground />

          {/* Contenido principal con z-index superior al fondo */}
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}