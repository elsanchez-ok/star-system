"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/glass-card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { GraduationCap, Menu, X, Home, Users, QrCode, Camera, MessageSquare, BarChart3, Settings } from "lucide-react"

/**
 * Navegación Principal del Sistema
 *
 * Propósito: Componente de navegación reutilizable con efectos glassmorphism
 * y transiciones suaves para navegar entre los diferentes módulos del sistema.
 *
 * Características:
 * - Navegación responsive con menú móvil
 * - Indicadores visuales de página activa
 * - Efectos hover y transiciones suaves
 * - Integración con el sistema de temas
 */

const navigationItems = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Registro", href: "/registration", icon: Users },
  { name: "Asistencias", href: "/attendance", icon: QrCode },
  { name: "Reconocimiento", href: "/facial-recognition", icon: Camera },
  { name: "Notificaciones", href: "/notifications", icon: MessageSquare },
  { name: "Dashboard", href: "/admin-dashboard", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <GlassCard className="flex items-center justify-between p-4">
        {/* Logo y título */}
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500 to-cyan-500">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              EduSystem Pro
            </h1>
            <p className="text-sm text-muted-foreground">Sistema Escolar Futurista</p>
          </div>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden lg:flex items-center gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  "hover:bg-white/10 dark:hover:bg-slate-800/20",
                  isActive
                    ? "bg-gradient-to-r from-lime-500/20 to-cyan-500/20 text-lime-500 dark:text-lime-400"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Controles de la derecha */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/20 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </GlassCard>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4">
          <GlassCard className="p-4">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                      "hover:bg-white/10 dark:hover:bg-slate-800/20",
                      isActive
                        ? "bg-gradient-to-r from-lime-500/20 to-cyan-500/20 text-lime-500 dark:text-lime-400"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </GlassCard>
        </div>
      )}
    </header>
  )
}
