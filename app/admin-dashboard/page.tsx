"use client"

import { useState } from "react"
import { MainNavigation } from "@/components/navigation/main-nav"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  Users,
  TrendingUp,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Camera,
} from "lucide-react"
import {
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

/**
 * Panel Administrativo y Reportes
 *
 * Propósito: Dashboard completo para administradores con estadísticas,
 * reportes, gráficos interactivos y gestión del sistema escolar.
 *
 * Características:
 * - Métricas en tiempo real del sistema
 * - Gráficos interactivos de asistencias
 * - Reportes exportables
 * - Alertas y notificaciones
 * - Gestión de usuarios y configuración
 * - Análisis de tendencias
 * - Interfaz glassmorphism profesional
 */

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [selectedGrade, setSelectedGrade] = useState("all")

  // Datos simulados para gráficos
  const attendanceData = [
    { date: "2024-01-15", present: 245, absent: 15, late: 8 },
    { date: "2024-01-16", present: 238, absent: 22, late: 12 },
    { date: "2024-01-17", present: 251, absent: 11, late: 6 },
    { date: "2024-01-18", present: 243, absent: 18, late: 9 },
    { date: "2024-01-19", present: 249, absent: 13, late: 7 },
    { date: "2024-01-22", present: 252, absent: 10, late: 5 },
    { date: "2024-01-23", present: 247, absent: 16, late: 8 },
  ]

  const gradeDistribution = [
    { grade: "Grado 1", students: 45, color: "#84cc16" },
    { grade: "Grado 2", students: 42, color: "#06b6d4" },
    { grade: "Grado 3", students: 38, color: "#8b5cf6" },
    { grade: "Grado 4", students: 41, color: "#f59e0b" },
    { grade: "Grado 5", students: 39, color: "#ef4444" },
    { grade: "Grado 6", students: 44, color: "#ec4899" },
  ]

  const systemUsage = [
    { system: "Registro QR", usage: 85, color: "#84cc16" },
    { system: "Reconocimiento Facial", usage: 72, color: "#06b6d4" },
    { system: "Notificaciones", usage: 94, color: "#8b5cf6" },
    { system: "Reportes", usage: 68, color: "#f59e0b" },
  ]

  // Estadísticas generales
  const stats = {
    totalStudents: 268,
    presentToday: 247,
    absentToday: 16,
    lateToday: 5,
    attendanceRate: 92.2,
    systemUptime: 99.8,
    notificationsSent: 1247,
    facialRecognitions: 892,
  }

  // Alertas del sistema
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Asistencia Baja - Grado 3B",
      message: "Solo 78% de asistencia en los últimos 3 días",
      time: "2 horas",
    },
    {
      id: 2,
      type: "info",
      title: "Mantenimiento Programado",
      message: "Sistema de cámaras se actualizará mañana a las 2:00 AM",
      time: "4 horas",
    },
    {
      id: 3,
      type: "success",
      title: "Backup Completado",
      message: "Respaldo de datos realizado exitosamente",
      time: "6 horas",
    },
  ]

  // Exportar reportes
  const exportReport = (type: string) => {
    console.log(`Exportando reporte: ${type}`)
    // Aquí iría la lógica de exportación real
  }

  return (
    <div className="min-h-screen page-transition">
      <MainNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="slide-in-left mb-8">
            <GlassCard className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                      Panel Administrativo
                    </h1>
                    <p className="text-muted-foreground">
                      Gestión completa del sistema escolar con reportes y análisis
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="glass w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hoy</SelectItem>
                      <SelectItem value="week">Esta Semana</SelectItem>
                      <SelectItem value="month">Este Mes</SelectItem>
                      <SelectItem value="year">Este Año</SelectItem>
                    </SelectContent>
                  </Select>

                  <NeonButton variant="secondary">
                    <Download className="h-5 w-5 mr-2" />
                    Exportar Todo
                  </NeonButton>

                  <NeonButton variant="accent">
                    <Settings className="h-5 w-5 mr-2" />
                    Configuración
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Métricas principales */}
          <div className="slide-in-right mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard className="p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Users className="h-6 w-6 text-blue-500" />
                  <span className="text-3xl font-bold">{stats.totalStudents}</span>
                </div>
                <p className="text-muted-foreground mb-2">Total Estudiantes</p>
                <Badge variant="secondary" className="text-xs">
                  +12 este mes
                </Badge>
              </GlassCard>

              <GlassCard className="p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle className="h-6 w-6 text-lime-500" />
                  <span className="text-3xl font-bold text-lime-500">{stats.attendanceRate}%</span>
                </div>
                <p className="text-muted-foreground mb-2">Asistencia Promedio</p>
                <Badge className="text-xs bg-lime-500/20 text-lime-700 dark:text-lime-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1%
                </Badge>
              </GlassCard>

              <GlassCard className="p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <MessageSquare className="h-6 w-6 text-violet-500" />
                  <span className="text-3xl font-bold text-violet-500">{stats.notificationsSent}</span>
                </div>
                <p className="text-muted-foreground mb-2">Notificaciones Enviadas</p>
                <Badge variant="secondary" className="text-xs">
                  Hoy: 47
                </Badge>
              </GlassCard>

              <GlassCard className="p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Camera className="h-6 w-6 text-amber-500" />
                  <span className="text-3xl font-bold text-amber-500">{stats.facialRecognitions}</span>
                </div>
                <p className="text-muted-foreground mb-2">Reconocimientos Faciales</p>
                <Badge variant="secondary" className="text-xs">
                  Precisión: 94.2%
                </Badge>
              </GlassCard>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gráficos principales */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gráfico de asistencias */}
              <div className="scale-in">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Tendencia de Asistencias</h2>
                    <div className="flex gap-2">
                      <NeonButton size="sm" variant="secondary" onClick={() => exportReport("attendance")}>
                        <Download className="h-4 w-4 mr-1" />
                        Exportar
                      </NeonButton>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceData}>
                        <defs>
                          <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#84cc16" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                          dataKey="date"
                          stroke="rgba(255,255,255,0.6)"
                          fontSize={12}
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
                          }
                        />
                        <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            backdropFilter: "blur(16px)",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="present"
                          stroke="#84cc16"
                          fillOpacity={1}
                          fill="url(#colorPresent)"
                          name="Presentes"
                        />
                        <Area
                          type="monotone"
                          dataKey="absent"
                          stroke="#ef4444"
                          fillOpacity={1}
                          fill="url(#colorAbsent)"
                          name="Ausentes"
                        />
                        <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={3} name="Tardanzas" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>

              {/* Uso del sistema */}
              <div className="scale-in">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Uso del Sistema</h2>
                    <Badge variant="secondary">Tiempo Real</Badge>
                  </div>

                  <div className="space-y-4">
                    {systemUsage.map((item) => (
                      <div key={item.system} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.system}</span>
                          <span className="text-sm text-muted-foreground">{item.usage}%</span>
                        </div>
                        <div className="w-full bg-white/10 dark:bg-slate-800/20 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.usage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Alertas del sistema */}
              <div className="slide-in-left">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Alertas del Sistema
                  </h3>

                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-3 rounded-lg bg-white/5 dark:bg-slate-800/20">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-1 rounded-full ${
                              alert.type === "warning"
                                ? "bg-amber-500/20"
                                : alert.type === "info"
                                  ? "bg-blue-500/20"
                                  : "bg-lime-500/20"
                            }`}
                          >
                            {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                            {alert.type === "info" && <Eye className="h-4 w-4 text-blue-500" />}
                            {alert.type === "success" && <CheckCircle className="h-4 w-4 text-lime-500" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">Hace {alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Distribución por grados */}
              <div className="scale-in">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4">Distribución por Grados</h3>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="students"
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            backdropFilter: "blur(16px)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 mt-4">
                    {gradeDistribution.map((item) => (
                      <div key={item.grade} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.grade}</span>
                        </div>
                        <span className="font-medium">{item.students}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Estado del sistema */}
              <div className="slide-in-right">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4">Estado del Sistema</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse" />
                        <span className="text-sm">Servidor Principal</span>
                      </div>
                      <Badge className="bg-lime-500/20 text-lime-700 dark:text-lime-300">Online</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse" />
                        <span className="text-sm">Base de Datos</span>
                      </div>
                      <Badge className="bg-lime-500/20 text-lime-700 dark:text-lime-300">Conectada</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-sm">Cámaras</span>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300">3/4 Activas</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse" />
                        <span className="text-sm">Notificaciones</span>
                      </div>
                      <Badge className="bg-lime-500/20 text-lime-700 dark:text-lime-300">Funcionando</Badge>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 dark:border-slate-700/20">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-lime-500">{stats.systemUptime}%</p>
                      <p className="text-sm text-muted-foreground">Tiempo de Actividad</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="slide-in-left mt-8">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6">Acciones Rápidas</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NeonButton variant="primary" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Gestionar Usuarios</span>
                </NeonButton>

                <NeonButton variant="secondary" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span className="text-sm">Exportar Reportes</span>
                </NeonButton>

                <NeonButton variant="accent" className="h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  <span className="text-sm">Configuración</span>
                </NeonButton>

                <NeonButton variant="danger" className="h-20 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <span className="text-sm">Ver Alertas</span>
                </NeonButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
