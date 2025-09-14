"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  GraduationCap,
  Users,
  QrCode,
  Camera,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Settings,
  Clock,
} from "lucide-react"

/**
 * Página Principal del Sistema Escolar Futurista
 *
 * Propósito: Pantalla de inicio que presenta el sistema de manera elegante
 * y profesional, diseñada para impresionar a personas de alto nivel económico
 * en ferias tecnológicas.
 *
 * Características:
 * - Hero section con efectos glassmorphism
 * - Navegación intuitiva a diferentes módulos
 * - Animaciones suaves y transiciones profesionales
 * - Diseño responsive y accesible
 * - Efectos visuales futuristas
 */

export default function HomePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const router = useRouter()

  const modules = [
    {
      id: "registration",
      title: "Registro de Estudiantes",
      description: "Sistema completo de registro con reconocimiento facial y códigos QR",
      icon: Users,
      color: "from-lime-500 to-cyan-500",
      href: "/registration",
    },
    {
      id: "attendance",
      title: "Control de Asistencias",
      description: "Seguimiento en tiempo real con escáner de códigos de barras",
      icon: QrCode,
      color: "from-violet-500 to-purple-500",
      href: "/attendance",
    },
    {
      id: "entry-exit",
      title: "Sistema de Entrada/Salida",
      description: "Control empresarial de acceso con múltiples cámaras y lectores",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
      href: "/entry-exit",
    },
    {
      id: "facial",
      title: "Reconocimiento Facial",
      description: "Identificación automática con selección de cámara",
      icon: Camera,
      color: "from-amber-500 to-orange-500",
      href: "/facial-recognition",
    },
    {
      id: "notifications",
      title: "Notificaciones Automáticas",
      description: "Integración con WhatsApp y Telegram para padres",
      icon: MessageSquare,
      color: "from-rose-500 to-pink-500",
      href: "/notifications",
    },
    {
      id: "dashboard",
      title: "Panel Administrativo",
      description: "Reportes, estadísticas y gestión completa del sistema",
      icon: BarChart3,
      color: "from-rose-500 to-pink-500",
      href: "/admin-dashboard",
    },
    {
      id: "integrations",
      title: "Configurar Integraciones",
      description: "Gestiona WhatsApp, Telegram, cámaras y escáneres",
      icon: Settings,
      color: "from-indigo-500 to-purple-500",
      href: "/integrations",
    },
  ]

  const features = [
    "Reconocimiento facial avanzado",
    "Códigos QR y barras integrados",
    "Notificaciones automáticas",
    "Interfaz glassmorphism",
    "Modo día/noche",
    "Datos modificables en tiempo real",
  ]

  const handleExploreSystem = () => {
    router.push("/registration")
  }

  const handleViewDemo = () => {
    router.push("/entry-exit")
  }

  const handleSecureAccess = () => {
    router.push("/admin-dashboard")
  }

  return (
    <div className="min-h-screen page-transition">
      {/* Header con navegación */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <GlassCard className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500 to-cyan-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
                Star System
              </h1>
              <p className="text-sm text-muted-foreground">Sistema de Registro Escolar</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NeonButton size="sm" variant="primary" onClick={handleSecureAccess}>
              <Shield className="h-4 w-4 mr-2" />
              Acceso Seguro
            </NeonButton>
          </div>
        </GlassCard>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="slide-in-left">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-lime-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent">
              Futuro de la
              <br />
              Gestión Educativa
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistema integral con reconocimiento facial, códigos QR, notificaciones automáticas y diseño futurista para
              instituciones educativas de vanguardia.
            </p>
          </div>

          <div className="slide-in-right flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <NeonButton size="lg" variant="primary" className="group" onClick={handleExploreSystem}>
              <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Explorar Sistema
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </NeonButton>
            <NeonButton size="lg" variant="secondary" glow={false} onClick={handleViewDemo}>
              Ver Demostración
            </NeonButton>
          </div>

          {/* Características destacadas */}
          <div className="scale-in">
            <GlassCard className="p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Características Avanzadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 dark:bg-slate-800/20 hover:bg-white/10 dark:hover:bg-slate-800/30 transition-all duration-300"
                  >
                    <CheckCircle className="h-5 w-5 text-lime-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Módulos del Sistema */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              Módulos del Sistema
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Accede a todas las funcionalidades desde una interfaz unificada y elegante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <div key={module.id}>
                  <GlassCard
                    className={`p-6 cursor-pointer transition-all duration-500 hover:scale-105 ${
                      selectedModule === module.id ? "ring-2 ring-lime-500" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setSelectedModule(module.id)}
                    onMouseLeave={() => setSelectedModule(null)}
                    onClick={() => router.push(module.href)}
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${module.color} p-4 mb-4 mx-auto`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h4 className="text-xl font-bold text-center mb-3">{module.title}</h4>
                    <p className="text-muted-foreground text-center mb-4 leading-relaxed">{module.description}</p>

                    <div className="flex justify-center">
                      <NeonButton
                        size="sm"
                        variant="primary"
                        className="group"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(module.href)
                        }}
                      >
                        Acceder
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </NeonButton>
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500 to-cyan-500">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
                EduSystem Pro
              </h4>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Sistema escolar futurista diseñado para instituciones educativas que buscan la excelencia tecnológica y la
              innovación en la gestión educativa.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>© 2025 Star System</span>
              <span>•</span>
              <span>Tecnología Educativa Avanzada</span>
              <span>•</span>
              <span>Diseñado para el Futuro</span>
            </div>
          </GlassCard>
        </div>
      </footer>
    </div>
  )
}
