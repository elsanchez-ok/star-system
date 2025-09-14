import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"

/**
 * NeonButton Component
 *
 * Propósito: Botón con efectos 3D y neon para crear una experiencia
 * visual impactante y futurista en el sistema escolar.
 *
 * Características:
 * - Efectos 3D con transformaciones CSS
 * - Glow neon animado
 * - Múltiples variantes de color
 * - Transiciones suaves
 * - Feedback táctil visual
 */

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "accent" | "danger"
  size?: "sm" | "md" | "lg"
  glow?: boolean
  className?: string
}

export function NeonButton({
  children,
  variant = "primary",
  size = "md",
  glow = true,
  className,
  ...props
}: NeonButtonProps) {
  const baseStyles = "btn-3d relative overflow-hidden font-semibold transition-all duration-300 rounded-lg"

  const variants = {
    primary: "bg-gradient-to-r from-lime-500 to-cyan-500 text-white hover:from-lime-400 hover:to-cyan-400",
    secondary: "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600",
    accent: "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-400 hover:to-purple-400",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const glowStyles = glow
    ? {
        primary: "shadow-lg shadow-lime-500/50 hover:shadow-lime-500/70",
        secondary: "shadow-lg shadow-slate-500/50 hover:shadow-slate-500/70",
        accent: "shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70",
        danger: "shadow-lg shadow-red-500/50 hover:shadow-red-500/70",
      }
    : {}

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glow && glowStyles[variant],
        "before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
