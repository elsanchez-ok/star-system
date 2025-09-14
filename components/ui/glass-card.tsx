import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/**
 * GlassCard Component
 *
 * Propósito: Componente reutilizable que implementa el efecto glassmorphism
 * para crear tarjetas con transparencia y desenfoque de fondo.
 *
 * Características:
 * - Efecto glassmorphism con backdrop-filter
 * - Bordes suaves y sombras internas
 * - Adaptable al tema oscuro/claro
 * - Animaciones suaves al hacer hover
 */

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function GlassCard({ children, className, hover = true, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        // Glassmorphism base styles
        "backdrop-blur-md bg-white/10 dark:bg-slate-900/10",
        "border border-white/20 dark:border-slate-700/20",
        "rounded-xl shadow-xl",
        // Hover effects
        hover && "transition-all duration-300 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-105",
        // Glow effect
        glow && "shadow-lg shadow-lime-500/20 dark:shadow-lime-400/20",
        // Animation
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
        className,
      )}
    >
      {children}
    </div>
  )
}
