import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, XCircle, Clock, TrendingUp, Calendar } from "lucide-react"

/**
 * Componente de Estadísticas de Asistencia
 *
 * Propósito: Mostrar métricas y estadísticas de asistencia en tiempo real
 * con visualización clara y efectos glassmorphism.
 *
 * Características:
 * - Estadísticas en tiempo real
 * - Indicadores visuales coloridos
 * - Comparación con días anteriores
 * - Porcentajes de asistencia
 * - Tendencias y alertas
 */

interface AttendanceStatsProps {
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  date: string
  previousDayComparison?: {
    present: number
    absent: number
    late: number
  }
}

export function AttendanceStats({
  totalStudents,
  presentCount,
  absentCount,
  lateCount,
  date,
  previousDayComparison,
}: AttendanceStatsProps) {
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
  const lateRate = totalStudents > 0 ? Math.round((lateCount / totalStudents) * 100) : 0

  // Calcular tendencias
  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null
    const diff = current - previous
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "same",
      percentage: previous > 0 ? Math.round(Math.abs(diff / previous) * 100) : 0,
    }
  }

  const presentTrend = getTrend(presentCount, previousDayComparison?.present)
  const absentTrend = getTrend(absentCount, previousDayComparison?.absent)
  const lateTrend = getTrend(lateCount, previousDayComparison?.late)

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">{totalStudents}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Estudiantes</p>
          <Badge variant="secondary" className="mt-2 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
          </Badge>
        </GlassCard>

        <GlassCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-lime-500" />
            <span className="text-2xl font-bold text-lime-500">{presentCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Presentes</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-lime-500/10 text-lime-600 dark:text-lime-400">
              {attendanceRate}%
            </Badge>
            {presentTrend && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  presentTrend.direction === "up"
                    ? "bg-lime-500/10 text-lime-600 dark:text-lime-400"
                    : presentTrend.direction === "down"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-slate-500/10"
                }`}
              >
                <TrendingUp className={`h-3 w-3 mr-1 ${presentTrend.direction === "down" ? "rotate-180" : ""}`} />
                {presentTrend.value}
              </Badge>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold text-red-500">{absentCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Ausentes</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 dark:text-red-400">
              {Math.round((absentCount / totalStudents) * 100)}%
            </Badge>
            {absentTrend && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  absentTrend.direction === "up"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : absentTrend.direction === "down"
                      ? "bg-lime-500/10 text-lime-600 dark:text-lime-400"
                      : "bg-slate-500/10"
                }`}
              >
                <TrendingUp className={`h-3 w-3 mr-1 ${absentTrend.direction === "down" ? "rotate-180" : ""}`} />
                {absentTrend.value}
              </Badge>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-amber-500">{lateCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Tardanzas</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {lateRate}%
            </Badge>
            {lateTrend && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  lateTrend.direction === "up"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : lateTrend.direction === "down"
                      ? "bg-lime-500/10 text-lime-600 dark:text-lime-400"
                      : "bg-slate-500/10"
                }`}
              >
                <TrendingUp className={`h-3 w-3 mr-1 ${lateTrend.direction === "down" ? "rotate-180" : ""}`} />
                {lateTrend.value}
              </Badge>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Resumen del día */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Resumen del Día</h3>
            <p className="text-muted-foreground">
              {new Date(date).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-lime-500">{attendanceRate}%</p>
              <p className="text-sm text-muted-foreground">Asistencia</p>
            </div>

            {attendanceRate >= 90 && (
              <Badge className="bg-lime-500/20 text-lime-700 dark:text-lime-300">✅ Excelente</Badge>
            )}
            {attendanceRate >= 75 && attendanceRate < 90 && (
              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300">⚠️ Buena</Badge>
            )}
            {attendanceRate < 75 && <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">🚨 Baja</Badge>}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
