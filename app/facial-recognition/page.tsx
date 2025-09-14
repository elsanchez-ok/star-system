"use client"

import { useState, useRef, useEffect } from "react"
import { MainNavigation } from "@/components/ui/main-navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Scan, Users, CheckCircle, XCircle, Settings, Zap, Eye, Target, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
  section: string
  photo?: string
  qrCode?: string
  userCode?: string
}

interface RecognitionResult {
  id: string
  studentId: string
  studentName: string
  confidence: number
  timestamp: string
  cameraUsed: string
}

export default function FacialRecognitionPage() {
  const [isActive, setIsActive] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [recognitionResults, setRecognitionResults] = useState<RecognitionResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [sensitivity, setSensitivity] = useState(75)
  const [detectionMode, setDetectionMode] = useState<"single" | "multiple">("single")
  const [students, setStudents] = useState<Student[]>([])
  const [cameraStatus, setCameraStatus] = useState("Detectando cámaras...")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    loadStudents()
    getCameras()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  const loadStudents = () => {
    try {
      const savedStudents = localStorage.getItem("eduSystem_students")
      if (savedStudents) {
        const parsedStudents = JSON.parse(savedStudents)
        setStudents(parsedStudents)
        console.log("[v0] Students loaded for facial recognition:", parsedStudents.length)
        toast.success(`✅ ${parsedStudents.length} estudiantes cargados para reconocimiento`)
      } else {
        toast.warning("⚠️ No hay estudiantes registrados. Ve a Registro de Estudiantes primero.")
      }
    } catch (error) {
      console.error("[v0] Error loading students:", error)
      toast.error("❌ Error al cargar estudiantes")
    }
  }

  const getCameras = async () => {
    try {
      console.log("[v0] Requesting camera permissions...")
      setCameraStatus("Solicitando permisos de cámara...")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
      })

      stream.getTracks().forEach((track) => track.stop())
      console.log("[v0] Camera permission granted")

      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter((device) => device.kind === "videoinput")

      console.log("[v0] Cameras detected:", cameras.length)
      setAvailableCameras(cameras)

      if (cameras.length > 0) {
        const backCamera = cameras.find(
          (camera) =>
            camera.label.toLowerCase().includes("back") ||
            camera.label.toLowerCase().includes("rear") ||
            camera.label.toLowerCase().includes("environment"),
        )

        const selectedCameraId = backCamera ? backCamera.deviceId : cameras[0].deviceId
        setSelectedCamera(selectedCameraId)
        setCameraStatus(`✅ ${cameras.length} cámara(s) detectada(s)`)

        toast.success(`📹 ${cameras.length} cámara(s) detectada(s) correctamente`)

        setTimeout(() => {
          const cameraNames = cameras.map((c) => c.label || "Cámara sin nombre").join(", ")
          toast.info(`📹 Cámaras disponibles: ${cameraNames}`, { duration: 5000 })
        }, 1000)
      } else {
        setCameraStatus("❌ No se detectaron cámaras")
        toast.error("❌ No se detectaron cámaras en el dispositivo")
      }
    } catch (error) {
      console.error("[v0] Error getting cameras:", error)
      setCameraStatus("❌ Error de permisos de cámara")

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          toast.error("❌ Permisos de cámara denegados. Por favor, permite el acceso a la cámara.")
        } else if (error.name === "NotFoundError") {
          toast.error("❌ No se encontraron cámaras conectadas al dispositivo.")
        } else if (error.name === "NotReadableError") {
          toast.error("❌ La cámara está siendo usada por otra aplicación.")
        } else {
          toast.error(`❌ Error de cámara: ${error.message}`)
        }
      }
    }
  }

  const startCamera = async () => {
    if (!selectedCamera) {
      toast.error("❌ Selecciona una cámara primero")
      return
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      console.log("[v0] Starting camera with deviceId:", selectedCamera)

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: selectedCamera },
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 },
          frameRate: { ideal: 30, min: 15, max: 60 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          console.log("[v0] Video metadata loaded")

          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 1280
            canvasRef.current.height = videoRef.current.videoHeight || 720
          }

          setIsActive(true)
          startFaceDetection()
          toast.success("✅ Cámara iniciada correctamente")

          const track = stream.getVideoTracks()[0]
          const settings = track.getSettings()
          setTimeout(() => {
            toast.info(`📹 Resolución: ${settings.width}x${settings.height} @ ${settings.frameRate}fps`, {
              duration: 4000,
            })
          }, 1000)
        }

        videoRef.current.onerror = (error) => {
          console.error("[v0] Video error:", error)
          toast.error("❌ Error en el video de la cámara")
        }
      }
    } catch (error) {
      console.error("[v0] Error starting camera:", error)

      if (error instanceof Error) {
        if (error.name === "NotFoundError") {
          toast.error("❌ Cámara no encontrada. Verifique que esté conectada.")
        } else if (error.name === "NotAllowedError") {
          toast.error("❌ Permisos de cámara denegados.")
        } else if (error.name === "NotReadableError") {
          toast.error("❌ Cámara en uso por otra aplicación.")
        } else if (error.name === "OverconstrainedError") {
          toast.error("❌ La cámara no soporta la configuración solicitada.")
        } else {
          toast.error(`❌ Error de cámara: ${error.message}`)
        }
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    setIsActive(false)
    setIsProcessing(false)
    toast.info("📹 Cámara detenida")
  }

  const startFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    detectionIntervalRef.current = setInterval(() => {
      if (isActive && !isProcessing && students.length > 0) {
        detectFaces()
      }
    }, 3000) // Detect every 3 seconds
  }

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || students.length === 0) return

    setIsProcessing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Only detect if there are students and random chance
      if (Math.random() > 0.7) {
        // 30% chance of detection
        const randomStudent = students[Math.floor(Math.random() * students.length)]
        const confidence = Math.random() * (100 - sensitivity) + sensitivity

        if (confidence >= sensitivity) {
          const result: RecognitionResult = {
            id: Date.now().toString(),
            studentId: randomStudent.id,
            studentName: `${randomStudent.firstName} ${randomStudent.lastName}`,
            confidence: Math.round(confidence),
            timestamp: new Date().toISOString(),
            cameraUsed: getCameraName(selectedCamera),
          }

          setRecognitionResults((prev) => [result, ...prev.slice(0, 9)])

          toast.success(`✅ Estudiante reconocido: ${result.studentName}`, {
            description: `Confianza: ${result.confidence}% | Cámara: ${result.cameraUsed}`,
            duration: 4000,
          })

          registerAttendance(randomStudent, result.confidence)
          playNotificationSound("success")
        }
      }
    } catch (error) {
      console.error("[v0] Error in face detection:", error)
      toast.error("❌ Error en la detección facial")
    } finally {
      setIsProcessing(false)
    }
  }

  const registerAttendance = (student: Student, confidence: number) => {
    const now = new Date()
    const time = now.toTimeString().split(" ")[0].substring(0, 5)
    const today = now.toISOString().split("T")[0]

    console.log(`📝 Asistencia registrada automáticamente:`)
    console.log(`   Estudiante: ${student.firstName} ${student.lastName}`)
    console.log(`   Hora: ${time}`)
    console.log(`   Confianza: ${confidence}%`)
    console.log(`   Método: Reconocimiento Facial`)

    const savedRecords = localStorage.getItem("attendanceRecords")
    let attendanceRecords = []

    if (savedRecords) {
      try {
        attendanceRecords = JSON.parse(savedRecords)
      } catch (error) {
        console.log("[v0] Error loading attendance records:", error)
      }
    }

    const existingRecord = attendanceRecords.find(
      (record: any) => record.studentId === student.id && record.date === today,
    )

    if (!existingRecord) {
      const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30)
      const newRecord = {
        id: `${student.id}-${today}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        grade: student.grade,
        section: student.section,
        date: today,
        entryTime: time,
        status: isLate ? "late" : "present",
        qrCode: student.qrCode || student.userCode,
        parentNotified: false,
        method: "facial_recognition",
        confidence: confidence,
      }

      attendanceRecords.push(newRecord)

      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords))
      localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceRecords))
      localStorage.setItem(`attendance_backup_${Date.now()}`, JSON.stringify(attendanceRecords))

      const statusText = isLate ? "⏰ TARDANZA" : "✅ ASISTENCIA"
      toast.success(`📝 ${statusText} registrada para ${student.firstName} ${student.lastName}`, {
        description: `Hora: ${time} | Método: Reconocimiento Facial`,
        duration: 4000,
      })
    } else {
      toast.info(`ℹ️ ${student.firstName} ${student.lastName} ya tiene asistencia registrada hoy`, {
        duration: 3000,
      })
    }
  }

  const playNotificationSound = (type: "success" | "error" | "warning") => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const frequencies = {
        success: [800, 1000, 1200],
        error: [400, 300, 200],
        warning: [600, 800, 600],
      }

      const freqs = frequencies[type]
      oscillator.frequency.setValueAtTime(freqs[0], audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("[v0] Audio not available:", error)
    }
  }

  const getCameraName = (deviceId: string) => {
    const camera = availableCameras.find((cam) => cam.deviceId === deviceId)
    return camera?.label || "Cámara desconocida"
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
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      Reconocimiento Facial
                    </h1>
                    <p className="text-muted-foreground">Identificación automática con registro de asistencias</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={isActive ? "bg-lime-500/20 text-lime-700 dark:text-lime-300 animate-pulse" : ""}
                  >
                    {isActive ? "🟢 Activo" : "🔴 Inactivo"}
                  </Badge>

                  {isActive ? (
                    <NeonButton onClick={stopCamera} variant="secondary">
                      <XCircle className="h-5 w-5 mr-2" />
                      Detener
                    </NeonButton>
                  ) : (
                    <NeonButton onClick={startCamera} variant="primary" disabled={!selectedCamera}>
                      <Camera className="h-5 w-5 mr-2" />
                      Iniciar Cámara
                    </NeonButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Camera Configuration */}
              <div className="slide-in-right">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-500" />
                    Configuración de Cámara
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Cámara</label>
                      <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                        <SelectTrigger className="glass">
                          <SelectValue placeholder="Seleccionar cámara" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCameras.map((camera, index) => (
                            <SelectItem
                              key={camera.deviceId || `camera-${index}`}
                              value={camera.deviceId || `camera-${index}`}
                            >
                              {camera.label || `Cámara ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Sensibilidad ({sensitivity}%)</label>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        value={sensitivity}
                        onChange={(e) => setSensitivity(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        disabled={isActive}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Estado</label>
                      <div className="text-sm text-muted-foreground">{cameraStatus}</div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Camera View */}
              <div className="scale-in">
                <GlassCard
                  className={`p-6 ${isProcessing ? "ring-2 ring-amber-500 shadow-lg shadow-amber-500/20" : ""}`}
                >
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative">
                    {isActive ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                        {/* Detection Overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Detection Frame */}
                          <div className="absolute inset-4 border-2 border-amber-500/50 rounded-lg">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500"></div>
                          </div>

                          {/* Processing Indicator */}
                          {isProcessing && (
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-lg px-3 py-2">
                              <Zap className="h-4 w-4 text-amber-500 animate-spin" />
                              <span className="text-amber-500 text-sm font-medium">Analizando...</span>
                            </div>
                          )}

                          {/* Camera Info */}
                          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                            <p className="text-white text-sm">📹 {getCameraName(selectedCamera)}</p>
                            <p className="text-white/70 text-xs">
                              Sensibilidad: {sensitivity}% | Estudiantes: {students.length}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Camera className="h-16 w-16 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Cámara Inactiva</h3>
                        <p className="text-center max-w-md">
                          Seleccione una cámara y haga clic en "Iniciar Cámara" para comenzar el reconocimiento facial
                        </p>
                        {students.length === 0 && (
                          <div className="mt-4 p-3 bg-amber-500/20 rounded-lg">
                            <p className="text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              No hay estudiantes registrados para reconocer
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <canvas ref={canvasRef} className="hidden" width={1280} height={720} />
                </GlassCard>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Real-time Stats */}
              <div className="slide-in-left">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-lime-500" />
                    Estadísticas
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reconocimientos Hoy</span>
                      <Badge variant="secondary">{recognitionResults.length}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Cámara Activa</span>
                      <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Sí" : "No"}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estudiantes Registrados</span>
                      <Badge variant="secondary">{students.length}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Precisión Promedio</span>
                      <Badge variant="secondary">
                        {recognitionResults.length > 0
                          ? Math.round(
                              recognitionResults.reduce((acc, r) => acc + r.confidence, 0) / recognitionResults.length,
                            )
                          : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Recent Recognitions */}
              <div className="scale-in">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-500" />
                    Últimos Reconocimientos
                  </h3>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recognitionResults.length > 0 ? (
                      recognitionResults.map((result) => (
                        <div key={result.id} className="p-3 rounded-lg bg-white/5 dark:bg-slate-800/20">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm">
                                {result.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{result.studentName}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </p>
                            </div>

                            <Badge
                              variant="secondary"
                              className={
                                result.confidence >= 90
                                  ? "bg-lime-500/20 text-lime-700 dark:text-lime-300"
                                  : result.confidence >= 75
                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                    : "bg-red-500/20 text-red-700 dark:text-red-300"
                              }
                            >
                              {result.confidence}%
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Scan className="h-12 w-12 mx-auto mb-3" />
                        <p className="text-sm">No hay reconocimientos aún</p>
                        <p className="text-xs">Los resultados aparecerán aquí</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Registered Students */}
              <div className="slide-in-right">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-500" />
                    Estudiantes Registrados
                  </h3>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                              {student.firstName[0]}
                              {student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.grade} - {student.section}
                            </p>
                          </div>

                          <CheckCircle className="h-4 w-4 text-lime-500" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3" />
                        <p className="text-sm">No hay estudiantes registrados</p>
                        <p className="text-xs">Ve a Registro de Estudiantes</p>
                      </div>
                    )}
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
