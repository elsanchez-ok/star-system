"use client"

import { useRef, useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Camera, Zap, Target } from "lucide-react"

/**
 * Componente Detector Facial
 *
 * Propósito: Componente especializado para la detección y reconocimiento facial
 * en tiempo real con configuración avanzada y visualización de resultados.
 *
 * Características:
 * - Detección facial en tiempo real
 * - Configuración de sensibilidad
 * - Visualización de marcos de detección
 * - Métricas de confianza
 * - Integración con múltiples cámaras
 */

interface FaceDetectorProps {
  isActive: boolean
  onDetection: (faces: DetectedFace[]) => void
  sensitivity: number
  cameraStream?: MediaStream
}

interface DetectedFace {
  id: string
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  landmarks?: {
    leftEye: { x: number; y: number }
    rightEye: { x: number; y: number }
    nose: { x: number; y: number }
    mouth: { x: number; y: number }
  }
}

export function FaceDetector({ isActive, onDetection, sensitivity, cameraStream }: FaceDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [fps, setFps] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()
  const lastFrameTime = useRef<number>(0)

  // Configurar stream de video
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  // Iniciar/detener detección
  useEffect(() => {
    if (isActive && videoRef.current) {
      startDetection()
    } else {
      stopDetection()
    }

    return () => stopDetection()
  }, [isActive, sensitivity])

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      detectFaces()
    }, 100) // Detectar cada 100ms para fluidez
  }

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setDetectedFaces([])
    setIsProcessing(false)
  }

  // Simular detección facial
  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    setIsProcessing(true)

    try {
      // Calcular FPS
      const now = performance.now()
      if (lastFrameTime.current > 0) {
        const deltaTime = now - lastFrameTime.current
        setFps(Math.round(1000 / deltaTime))
      }
      lastFrameTime.current = now

      // Simular detección (en implementación real usaríamos face-api.js o similar)
      const simulatedFaces: DetectedFace[] = []

      if (Math.random() > 0.3) {
        // 70% probabilidad de detectar rostro
        const faceCount = Math.random() > 0.8 ? 2 : 1 // Ocasionalmente detectar 2 rostros

        for (let i = 0; i < faceCount; i++) {
          const face: DetectedFace = {
            id: `face_${Date.now()}_${i}`,
            confidence: Math.random() * (100 - sensitivity) + sensitivity,
            boundingBox: {
              x: Math.random() * 200 + 100,
              y: Math.random() * 150 + 100,
              width: 120 + Math.random() * 80,
              height: 140 + Math.random() * 100,
            },
            landmarks: {
              leftEye: { x: 150 + Math.random() * 20, y: 150 + Math.random() * 20 },
              rightEye: { x: 200 + Math.random() * 20, y: 150 + Math.random() * 20 },
              nose: { x: 175 + Math.random() * 10, y: 180 + Math.random() * 10 },
              mouth: { x: 175 + Math.random() * 10, y: 210 + Math.random() * 10 },
            },
          }

          if (face.confidence >= sensitivity) {
            simulatedFaces.push(face)
          }
        }
      }

      setDetectedFaces(simulatedFaces)
      onDetection(simulatedFaces)

      // Dibujar overlay de detección
      drawDetectionOverlay(simulatedFaces)
    } catch (error) {
      console.error("Error in face detection:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Dibujar overlay de detección
  const drawDetectionOverlay = (faces: DetectedFace[]) => {
    const canvas = overlayCanvasRef.current
    const video = videoRef.current

    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar tamaño del canvas al video
    canvas.width = video.videoWidth || video.clientWidth
    canvas.height = video.videoHeight || video.clientHeight

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar marcos de detección
    faces.forEach((face, index) => {
      const { x, y, width, height } = face.boundingBox
      const confidence = face.confidence

      // Color basado en confianza
      const color = confidence >= 90 ? "#84cc16" : confidence >= 75 ? "#f59e0b" : "#ef4444"

      // Marco principal
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)

      // Esquinas del marco
      const cornerLength = 20
      ctx.lineWidth = 4

      // Esquina superior izquierda
      ctx.beginPath()
      ctx.moveTo(x, y + cornerLength)
      ctx.lineTo(x, y)
      ctx.lineTo(x + cornerLength, y)
      ctx.stroke()

      // Esquina superior derecha
      ctx.beginPath()
      ctx.moveTo(x + width - cornerLength, y)
      ctx.lineTo(x + width, y)
      ctx.lineTo(x + width, y + cornerLength)
      ctx.stroke()

      // Esquina inferior izquierda
      ctx.beginPath()
      ctx.moveTo(x, y + height - cornerLength)
      ctx.lineTo(x, y + height)
      ctx.lineTo(x + cornerLength, y + height)
      ctx.stroke()

      // Esquina inferior derecha
      ctx.beginPath()
      ctx.moveTo(x + width - cornerLength, y + height)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x + width, y + height - cornerLength)
      ctx.stroke()

      // Etiqueta de confianza
      ctx.fillStyle = color
      ctx.fillRect(x, y - 30, 100, 25)
      ctx.fillStyle = "#000000"
      ctx.font = "14px Arial"
      ctx.fillText(`${Math.round(confidence)}%`, x + 5, y - 10)

      // Puntos de referencia facial
      if (face.landmarks) {
        ctx.fillStyle = color
        Object.values(face.landmarks).forEach((point) => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    })
  }

  return (
    <GlassCard
      className={`relative overflow-hidden ${isProcessing ? "ring-2 ring-amber-500 shadow-lg shadow-amber-500/20" : ""}`}
    >
      {/* Video container */}
      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

        {/* Overlay canvas para detección */}
        <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Canvas oculto para procesamiento */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Indicadores de estado */}
        <div className="absolute top-4 left-4 space-y-2">
          {isActive && (
            <Badge className="bg-lime-500/20 text-lime-700 dark:text-lime-300">
              <Camera className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          )}

          {isProcessing && (
            <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <Zap className="h-3 w-3 mr-1 animate-spin" />
              Procesando
            </Badge>
          )}

          {detectedFaces.length > 0 && (
            <Badge className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
              <Target className="h-3 w-3 mr-1" />
              {detectedFaces.length} rostro{detectedFaces.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Métricas en tiempo real */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-white text-sm space-y-1">
            <div>FPS: {fps}</div>
            <div>Sensibilidad: {sensitivity}%</div>
            <div>Rostros: {detectedFaces.length}</div>
          </div>
        </div>

        {/* Marco de detección general */}
        <div className="absolute inset-4 border-2 border-amber-500/30 rounded-lg pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500"></div>
        </div>
      </div>

      {/* Información de detección */}
      {detectedFaces.length > 0 && (
        <div className="p-4 border-t border-white/10 dark:border-slate-700/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rostros Detectados</span>
            <div className="flex gap-2">
              {detectedFaces.map((face, index) => (
                <Badge
                  key={face.id}
                  variant="secondary"
                  className={
                    face.confidence >= 90
                      ? "bg-lime-500/20 text-lime-700 dark:text-lime-300"
                      : face.confidence >= 75
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                        : "bg-red-500/20 text-red-700 dark:text-red-300"
                  }
                >
                  #{index + 1}: {Math.round(face.confidence)}%
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
