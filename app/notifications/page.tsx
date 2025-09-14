"use client"

import { useState, useEffect } from "react"
import { MainNavigation } from "@/components/navigation/main-nav"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useNotificationService } from "@/components/notifications/notification-service"
import {
  MessageSquare,
  Send,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Bot,
  Smartphone,
  Zap,
  Bell,
  History,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

/**
 * Sistema de Notificaciones WhatsApp/Telegram
 *
 * Propósito: Módulo completo para gestionar notificaciones automáticas
 * a padres de familia mediante WhatsApp y Telegram usando configuraciones dinámicas
 *
 * Características:
 * - Configuración dinámica desde localStorage
 * - Plantillas de mensajes personalizables
 * - Envío automático de notificaciones de asistencia
 * - Historial de mensajes enviados
 * - Configuración de horarios y reglas
 * - Interfaz glassmorphism futurista
 * - Integración con servicio de notificaciones actualizado
 */

interface NotificationTemplate {
  id: string
  name: string
  type: "entry" | "exit" | "absence" | "late" | "custom"
  message: string
  platforms: ("whatsapp" | "telegram")[]
  active: boolean
}

interface NotificationHistory {
  id: string
  studentName: string
  parentPhone: string
  platform: "whatsapp" | "telegram"
  message: string
  status: "sent" | "delivered" | "failed" | "pending"
  timestamp: string
  type: string
}

export default function NotificationsPage() {
  const { service, queueStats, configStatus, sendAttendanceNotification, sendNotification, clearQueue } =
    useNotificationService()

  // Estados principales
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Entrada al Colegio",
      type: "entry",
      message: "✅ Su hijo/a {studentName} ingresó al colegio a las {time}. ¡Que tenga un excelente día!",
      platforms: ["whatsapp", "telegram"],
      active: true,
    },
    {
      id: "2",
      name: "Salida del Colegio",
      type: "exit",
      message: "🚪 Su hijo/a {studentName} salió del colegio a las {time}. ¡Esperamos que haya tenido un buen día!",
      platforms: ["whatsapp", "telegram"],
      active: true,
    },
    {
      id: "3",
      name: "Ausencia Detectada",
      type: "absence",
      message:
        "⚠️ Su hijo/a {studentName} no se ha presentado al colegio hoy {date}. Por favor contacte con la institución.",
      platforms: ["whatsapp"],
      active: true,
    },
    {
      id: "4",
      name: "Llegada Tardía",
      type: "late",
      message: "⏰ Su hijo/a {studentName} llegó tarde al colegio a las {time}. Hora de entrada: 8:00 AM.",
      platforms: ["whatsapp", "telegram"],
      active: true,
    },
  ])

  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([
    {
      id: "1",
      studentName: "Ana García",
      parentPhone: "+1234567890",
      platform: "whatsapp",
      message: "✅ Su hija Ana García ingresó al colegio a las 07:45. ¡Que tenga un excelente día!",
      status: "delivered",
      timestamp: new Date().toISOString(),
      type: "entry",
    },
    {
      id: "2",
      studentName: "Luis Rodríguez",
      parentPhone: "+1234567891",
      platform: "telegram",
      message: "⏰ Su hijo Luis Rodríguez llegó tarde al colegio a las 08:15. Hora de entrada: 8:00 AM.",
      status: "sent",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: "late",
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customMessage, setCustomMessage] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [isTestMode, setIsTestMode] = useState(true)

  const [systemConfig, setSystemConfig] = useState<any>(null)

  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem("eduSystemConfig")
        if (savedConfig) {
          setSystemConfig(JSON.parse(savedConfig))
        }
      } catch (error) {
        console.error("Error cargando configuración:", error)
      }
    }

    loadConfig()
    // Recargar configuración cada 5 segundos para mantener sincronizado
    const interval = setInterval(loadConfig, 5000)
    return () => clearInterval(interval)
  }, [])

  // Estadísticas actualizadas
  const stats = {
    totalSent: 1247,
    deliveredToday: 47,
    failedToday: 2,
    queuePending: queueStats.pending,
    whatsappActive: configStatus.whatsapp.enabled && configStatus.whatsapp.configured,
    telegramActive: configStatus.telegram.enabled && configStatus.telegram.configured,
  }

  const handleSendNotification = async (templateId: string, recipients: string[], customMsg?: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template && !customMsg) {
      toast.error("Seleccione una plantilla o escriba un mensaje personalizado")
      return
    }

    if (recipients.length === 0) {
      toast.error("Debe especificar al menos un destinatario")
      return
    }

    const message = customMsg || template?.message || ""
    const platforms = template?.platforms || ["whatsapp"]

    // Enviar a cada plataforma habilitada
    for (const platform of platforms) {
      const isEnabled = platform === "whatsapp" ? configStatus.whatsapp.enabled : configStatus.telegram.enabled
      const isConfigured = platform === "whatsapp" ? configStatus.whatsapp.configured : configStatus.telegram.configured

      if (isEnabled && isConfigured) {
        for (const phone of recipients) {
          const result = await sendNotification({
            platform: platform as "whatsapp" | "telegram",
            recipient: phone,
            message: message,
            studentName: "Estudiante Ejemplo",
            type: template?.type || "custom",
            metadata: {
              manual: true,
              testMode: isTestMode,
              timestamp: new Date().toISOString(),
            },
          })

          // Agregar al historial
          const newNotification: NotificationHistory = {
            id: Date.now().toString() + Math.random(),
            studentName: "Estudiante Ejemplo",
            parentPhone: phone,
            platform: platform as "whatsapp" | "telegram",
            message: message,
            status: result.success ? "sent" : "failed",
            timestamp: new Date().toISOString(),
            type: template?.type || "custom",
          }

          setNotificationHistory((prev) => [newNotification, ...prev.slice(0, 49)])
        }
      }
    }

    toast.success(`Notificación enviada a ${recipients.length} destinatarios`)
  }

  const simulateAutomaticNotification = async (type: "entry" | "exit" | "late", studentName: string) => {
    const template = templates.find((t) => t.type === type && t.active)
    if (!template) {
      toast.error(`No hay plantilla activa para ${type}`)
      return
    }

    const currentTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

    await sendAttendanceNotification(
      studentName,
      "+1234567890", // Número de ejemplo
      type,
      currentTime,
      template.platforms,
    )

    console.log(`🤖 Notificación automática activada: ${type}`)
    console.log(`   Estudiante: ${studentName}`)
    console.log(`   Hora: ${currentTime}`)
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
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      Notificaciones Automáticas
                    </h1>
                    <p className="text-muted-foreground">Sistema integrado con WhatsApp y Telegram</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={isTestMode} onCheckedChange={setIsTestMode} />
                    <Label className="text-sm">Modo Prueba</Label>
                  </div>

                  <Link href="/integrations">
                    <NeonButton variant="secondary" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </NeonButton>
                  </Link>

                  <NeonButton variant="accent" onClick={() => simulateAutomaticNotification("entry", "Ana García")}>
                    <Zap className="h-5 w-5 mr-2" />
                    Simular Envío
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {!configStatus.whatsapp.enabled && !configStatus.telegram.enabled && (
            <div className="mb-8">
              <GlassCard className="p-4 border-amber-500/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-600 dark:text-amber-400">No hay integraciones configuradas</p>
                    <p className="text-sm text-muted-foreground">
                      Configure WhatsApp o Telegram para enviar notificaciones automáticas
                    </p>
                  </div>
                  <Link href="/integrations">
                    <NeonButton size="sm" variant="secondary">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Configurar Ahora
                    </NeonButton>
                  </Link>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Estadísticas */}
          <div className="slide-in-right mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <GlassCard className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">{stats.totalSent}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Enviados</p>
              </GlassCard>

              <GlassCard className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-lime-500" />
                  <span className="text-2xl font-bold text-lime-500">{stats.deliveredToday}</span>
                </div>
                <p className="text-sm text-muted-foreground">Entregados Hoy</p>
              </GlassCard>

              <GlassCard className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-500">{stats.queuePending}</span>
                </div>
                <p className="text-sm text-muted-foreground">En Cola</p>
              </GlassCard>

              <GlassCard className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <span className={`text-2xl font-bold ${stats.whatsappActive ? "text-green-500" : "text-red-500"}`}>
                    {stats.whatsappActive ? "ON" : "OFF"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
              </GlassCard>

              <GlassCard className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <span className={`text-2xl font-bold ${stats.telegramActive ? "text-blue-500" : "text-red-500"}`}>
                    {stats.telegramActive ? "ON" : "OFF"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Telegram</p>
              </GlassCard>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel principal */}
            <div className="lg:col-span-2 space-y-8">
              <div className="scale-in">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-500" />
                    Estado de Configuración
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* WhatsApp Status */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-green-500" />
                          WhatsApp
                        </h3>
                        <Badge
                          variant={
                            configStatus.whatsapp.enabled && configStatus.whatsapp.configured
                              ? "default"
                              : "destructive"
                          }
                          className={
                            configStatus.whatsapp.enabled && configStatus.whatsapp.configured
                              ? "bg-lime-500/20 text-lime-700 dark:text-lime-300"
                              : ""
                          }
                        >
                          {configStatus.whatsapp.enabled && configStatus.whatsapp.configured
                            ? "Configurado"
                            : !configStatus.whatsapp.enabled
                              ? "Deshabilitado"
                              : "Sin Configurar"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Estado:</span>
                          <span className={configStatus.whatsapp.enabled ? "text-green-500" : "text-red-500"}>
                            {configStatus.whatsapp.enabled ? "Habilitado" : "Deshabilitado"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Token:</span>
                          <span className={configStatus.whatsapp.configured ? "text-green-500" : "text-red-500"}>
                            {configStatus.whatsapp.configured ? "Configurado" : "Faltante"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>En cola:</span>
                          <Badge variant="outline">{queueStats.platforms.whatsapp}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Telegram Status */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Bot className="h-5 w-5 text-blue-500" />
                          Telegram
                        </h3>
                        <Badge
                          variant={
                            configStatus.telegram.enabled && configStatus.telegram.configured
                              ? "default"
                              : "destructive"
                          }
                          className={
                            configStatus.telegram.enabled && configStatus.telegram.configured
                              ? "bg-lime-500/20 text-lime-700 dark:text-lime-300"
                              : ""
                          }
                        >
                          {configStatus.telegram.enabled && configStatus.telegram.configured
                            ? "Configurado"
                            : !configStatus.telegram.enabled
                              ? "Deshabilitado"
                              : "Sin Configurar"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Estado:</span>
                          <span className={configStatus.telegram.enabled ? "text-green-500" : "text-red-500"}>
                            {configStatus.telegram.enabled ? "Habilitado" : "Deshabilitado"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Token:</span>
                          <span className={configStatus.telegram.configured ? "text-green-500" : "text-red-500"}>
                            {configStatus.telegram.configured ? "Configurado" : "Faltante"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>En cola:</span>
                          <Badge variant="outline">{queueStats.platforms.telegram}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <Link href="/integrations">
                      <NeonButton variant="secondary">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar Integraciones
                      </NeonButton>
                    </Link>

                    {queueStats.pending > 0 && (
                      <NeonButton variant="destructive" size="sm" onClick={clearQueue}>
                        Limpiar Cola ({queueStats.pending})
                      </NeonButton>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Envío manual */}
              <div className="slide-in-left">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Send className="h-5 w-5 text-violet-500" />
                    Envío Manual de Notificaciones
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="template-select">Plantilla de Mensaje</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                          <SelectTrigger className="glass">
                            <SelectValue placeholder="Seleccionar plantilla" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="recipients">Destinatarios</Label>
                        <Input
                          id="recipients"
                          placeholder="+1234567890, +0987654321"
                          className="glass"
                          onChange={(e) => setSelectedRecipients(e.target.value.split(",").map((s) => s.trim()))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="custom-message">Mensaje Personalizado (Opcional)</Label>
                      <Textarea
                        id="custom-message"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Escriba un mensaje personalizado o use una plantilla..."
                        className="glass"
                        rows={4}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Variables disponibles: {"{studentName}"}, {"{time}"}, {"{date}"}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <NeonButton
                        onClick={() => handleSendNotification(selectedTemplate, selectedRecipients, customMessage)}
                        disabled={(!selectedTemplate && !customMessage) || selectedRecipients.length === 0}
                        className="group"
                      >
                        <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Enviar Notificación
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Plantillas de mensajes */}
              <div className="slide-in-right">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-amber-500" />
                    Plantillas Activas
                  </h3>

                  <div className="space-y-3">
                    {templates
                      .filter((t) => t.active)
                      .map((template) => (
                        <div key={template.id} className="p-3 rounded-lg bg-white/5 dark:bg-slate-800/20">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {template.type}
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{template.message}</p>

                          <div className="flex items-center gap-2">
                            {template.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform === "whatsapp" ? "📱 WhatsApp" : "🤖 Telegram"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </GlassCard>
              </div>

              {/* Historial reciente */}
              <div className="scale-in">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-cyan-500" />
                    Historial Reciente
                  </h3>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notificationHistory.slice(0, 10).map((notification) => (
                      <div key={notification.id} className="p-3 rounded-lg bg-white/5 dark:bg-slate-800/20">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs">
                              {notification.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{notification.studentName}</p>
                              <Badge variant="outline" className="text-xs">
                                {notification.platform === "whatsapp" ? "📱" : "🤖"}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </span>

                              <Badge
                                variant={
                                  notification.status === "delivered"
                                    ? "default"
                                    : notification.status === "sent"
                                      ? "secondary"
                                      : notification.status === "failed"
                                        ? "destructive"
                                        : "secondary"
                                }
                                className={
                                  notification.status === "delivered"
                                    ? "bg-lime-500/20 text-lime-700 dark:text-lime-300 text-xs"
                                    : "text-xs"
                                }
                              >
                                {notification.status === "delivered" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {notification.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                                {notification.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                {notification.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
