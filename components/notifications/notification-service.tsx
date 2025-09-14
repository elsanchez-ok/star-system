"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

/**
 * Servicio de Notificaciones
 *
 * Propósito: Servicio centralizado para manejar el envío de notificaciones
 * automáticas a través de WhatsApp y Telegram usando configuraciones dinámicas
 *
 * Características:
 * - Configuración dinámica desde localStorage
 * - Integración con APIs configurables
 * - Manejo de colas de mensajes
 * - Reintentos automáticos
 * - Logging y monitoreo
 * - Plantillas dinámicas
 */

interface NotificationConfig {
  whatsappApiUrl: string
  telegramApiUrl: string
  whatsappToken: string
  telegramToken: string
  whatsappEnabled: boolean
  telegramEnabled: boolean
  retryAttempts: number
  retryDelay: number
}

interface NotificationPayload {
  platform: "whatsapp" | "telegram"
  recipient: string
  message: string
  studentName: string
  type: "entry" | "exit" | "absence" | "late" | "custom"
  metadata?: Record<string, any>
}

interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
  timestamp: string
}

export class NotificationService {
  private config: NotificationConfig
  private messageQueue: NotificationPayload[] = []
  private isProcessing = false

  constructor(config: NotificationConfig) {
    this.config = config
    this.startQueueProcessor()
  }

  updateConfigFromStorage() {
    try {
      const savedConfig = localStorage.getItem("eduSystemConfig")
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)

        this.config = {
          ...this.config,
          whatsappApiUrl: parsedConfig.whatsapp?.apiUrl || this.config.whatsappApiUrl,
          telegramApiUrl: parsedConfig.telegram?.apiUrl || this.config.telegramApiUrl,
          whatsappToken: parsedConfig.whatsapp?.botToken || this.config.whatsappToken,
          telegramToken: parsedConfig.telegram?.botToken || this.config.telegramToken,
          whatsappEnabled: parsedConfig.whatsapp?.enabled || false,
          telegramEnabled: parsedConfig.telegram?.enabled || false,
        }

        console.log("🔄 Configuración de notificaciones actualizada desde localStorage")
      }
    } catch (error) {
      console.error("❌ Error actualizando configuración:", error)
    }
  }

  // Enviar notificación individual
  async sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
    const timestamp = new Date().toISOString()

    const isEnabled = payload.platform === "whatsapp" ? this.config.whatsappEnabled : this.config.telegramEnabled

    if (!isEnabled) {
      console.log(`⚠️ ${payload.platform.toUpperCase()} está deshabilitado en la configuración`)
      return {
        success: false,
        error: `${payload.platform.toUpperCase()} está deshabilitado`,
        timestamp,
      }
    }

    try {
      console.log(`📤 Enviando notificación via ${payload.platform.toUpperCase()}`)
      console.log(`   Destinatario: ${payload.recipient}`)
      console.log(`   Estudiante: ${payload.studentName}`)
      console.log(`   Tipo: ${payload.type}`)

      // Seleccionar API según plataforma
      const apiUrl = payload.platform === "whatsapp" ? this.config.whatsappApiUrl : this.config.telegramApiUrl
      const token = payload.platform === "whatsapp" ? this.config.whatsappToken : this.config.telegramToken

      if (!token || token.length < 10) {
        throw new Error(`Token de ${payload.platform.toUpperCase()} no configurado o inválido`)
      }

      // Simular llamada a API
      const response = await this.callNotificationAPI(apiUrl, token, payload)

      if (response.success) {
        console.log(`✅ Notificación enviada exitosamente`)
        console.log(`   ID del mensaje: ${response.messageId}`)

        return {
          success: true,
          messageId: response.messageId,
          timestamp,
        }
      } else {
        throw new Error(response.error || "Error desconocido")
      }
    } catch (error) {
      console.error(`❌ Error enviando notificación:`, error)

      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp,
      }
    }
  }

  private async callNotificationAPI(apiUrl: string, token: string, payload: NotificationPayload) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simular respuesta de API (85% éxito si está bien configurado)
    const success = Math.random() > 0.15

    if (success) {
      return {
        success: true,
        messageId: `${payload.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "sent",
        platform: payload.platform,
        recipient: payload.recipient,
      }
    } else {
      return {
        success: false,
        error: "Servicio temporalmente no disponible",
        code: "TEMP_UNAVAILABLE",
      }
    }
  }

  // Procesar cola de mensajes
  private async startQueueProcessor() {
    setInterval(async () => {
      if (this.messageQueue.length > 0 && !this.isProcessing) {
        this.isProcessing = true

        this.updateConfigFromStorage()

        const payload = this.messageQueue.shift()
        if (payload) {
          const result = await this.sendNotification(payload)

          // Si falla, reintentar
          if (!result.success && this.config.retryAttempts > 0) {
            console.log(`🔄 Reintentando envío en ${this.config.retryDelay}ms`)
            setTimeout(() => {
              this.queueNotification(payload)
            }, this.config.retryDelay)
          }
        }

        this.isProcessing = false
      }
    }, 2000) // Procesar cada 2 segundos
  }

  // Agregar notificación a la cola
  queueNotification(payload: NotificationPayload) {
    this.messageQueue.push(payload)
    console.log(`📋 Notificación agregada a la cola (${this.messageQueue.length} pendientes)`)
  }

  // Envío automático de asistencia
  async sendAttendanceNotification(
    studentName: string,
    parentPhone: string,
    type: "entry" | "exit" | "late",
    time: string,
    platforms: ("whatsapp" | "telegram")[] = ["whatsapp"],
  ) {
    this.updateConfigFromStorage()

    const templates = {
      entry: `✅ Su hijo/a ${studentName} ingresó al colegio a las ${time}. ¡Que tenga un excelente día!`,
      exit: `🚪 Su hijo/a ${studentName} salió del colegio a las ${time}. ¡Esperamos que haya tenido un buen día!`,
      late: `⏰ Su hijo/a ${studentName} llegó tarde al colegio a las ${time}. Hora de entrada: 8:00 AM.`,
    }

    const message = templates[type]

    const enabledPlatforms = platforms.filter((platform) => {
      return platform === "whatsapp" ? this.config.whatsappEnabled : this.config.telegramEnabled
    })

    if (enabledPlatforms.length === 0) {
      toast.error("No hay plataformas de notificación habilitadas")
      return
    }

    // Enviar a cada plataforma habilitada
    for (const platform of enabledPlatforms) {
      const payload: NotificationPayload = {
        platform,
        recipient: parentPhone,
        message,
        studentName,
        type,
        metadata: {
          time,
          automated: true,
          source: "attendance_system",
        },
      }

      this.queueNotification(payload)
    }

    toast.success(`Notificación de ${type} programada para ${studentName}`)
  }

  // Obtener estadísticas de la cola
  getQueueStats() {
    return {
      pending: this.messageQueue.length,
      processing: this.isProcessing,
      platforms: {
        whatsapp: this.messageQueue.filter((m) => m.platform === "whatsapp").length,
        telegram: this.messageQueue.filter((m) => m.platform === "telegram").length,
      },
    }
  }

  getConfigStatus() {
    return {
      whatsapp: {
        enabled: this.config.whatsappEnabled,
        configured: this.config.whatsappToken && this.config.whatsappToken.length > 10,
      },
      telegram: {
        enabled: this.config.telegramEnabled,
        configured: this.config.telegramToken && this.config.telegramToken.length > 10,
      },
    }
  }

  // Limpiar cola
  clearQueue() {
    this.messageQueue = []
    console.log("🗑️ Cola de notificaciones limpiada")
  }
}

// Hook para usar el servicio de notificaciones
export function useNotificationService() {
  const [service] = useState(() => {
    let initialConfig: NotificationConfig = {
      whatsappApiUrl: "https://api.whatsapp.com/send",
      telegramApiUrl: "https://api.telegram.org/bot",
      whatsappToken: "",
      telegramToken: "",
      whatsappEnabled: false,
      telegramEnabled: false,
      retryAttempts: 3,
      retryDelay: 5000,
    }

    // Cargar configuración guardada
    try {
      const savedConfig = localStorage.getItem("eduSystemConfig")
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        initialConfig = {
          ...initialConfig,
          whatsappApiUrl: parsedConfig.whatsapp?.apiUrl || initialConfig.whatsappApiUrl,
          telegramApiUrl: parsedConfig.telegram?.apiUrl || initialConfig.telegramApiUrl,
          whatsappToken: parsedConfig.whatsapp?.botToken || initialConfig.whatsappToken,
          telegramToken: parsedConfig.telegram?.botToken || initialConfig.telegramToken,
          whatsappEnabled: parsedConfig.whatsapp?.enabled || false,
          telegramEnabled: parsedConfig.telegram?.enabled || false,
        }
      }
    } catch (error) {
      console.error("Error cargando configuración inicial:", error)
    }

    return new NotificationService(initialConfig)
  })

  const [queueStats, setQueueStats] = useState(service.getQueueStats())
  const [configStatus, setConfigStatus] = useState(service.getConfigStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueStats(service.getQueueStats())
      setConfigStatus(service.getConfigStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [service])

  return {
    service,
    queueStats,
    configStatus,
    sendAttendanceNotification: service.sendAttendanceNotification.bind(service),
    sendNotification: service.sendNotification.bind(service),
    queueNotification: service.queueNotification.bind(service),
    clearQueue: service.clearQueue.bind(service),
  }
}
