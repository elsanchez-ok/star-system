import { GlassCard } from "@/components/ui/glass-card"
import { Clock } from "lucide-react"

/**
 * Componente de Carga para Sistema de Entrada/Salida
 *
 * Propósito: Pantalla de carga elegante mientras se inicializa
 * el sistema de control de acceso empresarial.
 */

export default function EntryExitLoading() {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <GlassCard className="p-8 text-center max-w-md mx-auto">
        <div className="animate-spin w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-lime-500" />
          <h2 className="text-xl font-bold">Iniciando Sistema</h2>
        </div>
        <p className="text-muted-foreground">Detectando cámaras y escáneres...</p>
      </GlassCard>
    </div>
  )
}
