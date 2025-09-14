import { GlassCard } from "@/components/ui/glass-card"
import { Settings } from "lucide-react"

/**
 * Componente de Carga para Página de Integraciones
 *
 * Propósito: Muestra una pantalla de carga elegante mientras se cargan
 * las configuraciones de integraciones del sistema.
 */

export default function IntegrationsLoading() {
  return (
    <div className="min-h-screen page-transition p-4">
      <div className="max-w-6xl mx-auto">
        <GlassCard className="p-8 text-center">
          <div className="animate-spin mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-lime-500 to-cyan-500">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
            Cargando Configuraciones
          </h2>
          <p className="text-muted-foreground">Preparando el panel de integraciones...</p>
        </GlassCard>
      </div>
    </div>
  )
}
