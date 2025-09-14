"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { MainNavigation } from "@/components/ui/main-navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  QrCode,
  Scan,
  Download,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Calendar,
} from "lucide-react"

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
  section: string
  qrCode: string
  barcode?: string
  customCode?: string
  photo?: string
  parentPhone?: string
  parentEmail?: string
}

interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  studentPhoto?: string
  grade: string
  section: string
  date: string
  entryTime?: string
  exitTime?: string
  status: "present" | "absent" | "late"
  qrCode?: string
  parentNotified?: boolean
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [scannerInput, setScannerInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [filterGrade, setFilterGrade] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [deviceStatus, setDeviceStatus] = useState("Detectando dispositivos...")

  const scannerInputRef = useRef<HTMLInputElement>(null)
  const scanBufferRef = useRef("")
  const scanTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    loadStudentsData()
    loadAttendanceData()
    setupScannerDetection()
  }, [])

  const loadStudentsData = () => {
    try {
      const savedStudents = localStorage.getItem("eduSystem_students")
      if (savedStudents) {
        const parsedStudents = JSON.parse(savedStudents)
        setStudents(parsedStudents)
        console.log("[v0] Students loaded:", parsedStudents.length)
        toast.success(`✅ ${parsedStudents.length} estudiantes cargados correctamente`)
      } else {
        toast.warning("⚠️ No hay estudiantes registrados. Ve a Registro de Estudiantes primero.")
      }
    } catch (error) {
      console.error("[v0] Error loading students:", error)
      toast.error("❌ Error al cargar estudiantes")
    }
  }

  const loadAttendanceData = () => {
    try {
      const savedAttendance = localStorage.getItem("attendanceRecords")
      if (savedAttendance) {
        const parsedAttendance = JSON.parse(savedAttendance)
        setAttendanceRecords(parsedAttendance)
        console.log("[v0] Attendance records loaded:", parsedAttendance.length)
      }
    } catch (error) {
      console.error("[v0] Error loading attendance:", error)
    }
  }

  const setupScannerDetection = async () => {
    console.log("[v0] Setting up scanner detection for Steren COM-5970...")

    setTimeout(() => {
      if (scannerInputRef.current) {
        scannerInputRef.current.focus()
        console.log("[v0] Scanner input focused")
      }
    }, 100)

    const handleScannerInput = (event: KeyboardEvent) => {
      // Skip if user is typing in other inputs
      const activeElement = document.activeElement
      const isOtherInput =
        activeElement &&
        activeElement !== scannerInputRef.current &&
        (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")

      if (isOtherInput) return

      // Clear existing timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
      }

      if (event.key === "Enter") {
        // Process complete scan
        const scannedCode = scanBufferRef.current.trim()
        if (scannedCode) {
          console.log("[v0] Steren scanner detected code:", scannedCode)
          setScannerInput(scannedCode)
          processScannedCode(scannedCode)
          scanBufferRef.current = ""
        }
      } else if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
        // Add alphanumeric characters to buffer
        scanBufferRef.current += event.key
        setScannerInput(scanBufferRef.current)

        // Set timeout to process if no Enter key (some scanners don't send Enter)
        scanTimeoutRef.current = setTimeout(() => {
          const scannedCode = scanBufferRef.current.trim()
          if (scannedCode.length >= 3) {
            // Minimum code length
            console.log("[v0] Steren scanner timeout code:", scannedCode)
            processScannedCode(scannedCode)
            scanBufferRef.current = ""
          }
        }, 300) // Steren scanners typically send data within 300ms
      }
    }

    // Add global keyboard listener
    document.addEventListener("keydown", handleScannerInput, true)
    setDeviceStatus("✅ Sistema listo para escáner Steren COM-5970")
    toast.success("🎯 Sistema configurado para escáner Steren COM-5970", {
      description: "El escáner funcionará automáticamente al escanear códigos",
      duration: 4000,
    })

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleScannerInput, true)
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
      }
    }
  }

  const processScannedCode = (scannedCode: string) => {
    if (!scannedCode.trim()) return

    setIsScanning(true)
    console.log("[v0] Processing scanned code:", scannedCode)

    const findStudent = (code: string) => {
      const normalizedCode = code.trim().toLowerCase()

      return students.find((student) => {
        // Direct QR code match
        if (student.qrCode && student.qrCode.toLowerCase() === normalizedCode) return true

        // Barcode match
        if (student.barcode && student.barcode.toLowerCase() === normalizedCode) return true

        // Custom code match
        if (student.customCode && student.customCode.toLowerCase() === normalizedCode) return true

        // Student ID match
        if (student.id.toLowerCase() === normalizedCode) return true

        // Partial matches for flexibility
        if (student.qrCode && student.qrCode.toLowerCase().includes(normalizedCode)) return true
        if (student.barcode && student.barcode.toLowerCase().includes(normalizedCode)) return true

        return false
      })
    }

    const student = findStudent(scannedCode)

    if (!student) {
      toast.error("❌ ESTUDIANTE NO ENCONTRADO", {
        description: `Código: ${scannedCode}`,
        duration: 4000,
      })
      playNotificationSound("error")
      setIsScanning(false)
      return
    }

    registerAttendance(student, scannedCode)
  }

  const registerAttendance = (student: Student, scannedCode: string) => {
    const now = new Date()
    const currentTime = now.toTimeString().split(" ")[0].substring(0, 5)
    const today = now.toISOString().split("T")[0]

    // Find existing record for today
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.studentId === student.id && record.date === today,
    )

    let updatedRecords = [...attendanceRecords]

    if (existingRecordIndex !== -1) {
      const existingRecord = attendanceRecords[existingRecordIndex]

      if (!existingRecord.entryTime) {
        // Register entry
        const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30)
        updatedRecords[existingRecordIndex] = {
          ...existingRecord,
          entryTime: currentTime,
          status: isLate ? "late" : "present",
        }

        const statusText = isLate ? "⏰ TARDANZA REGISTRADA" : "✅ ENTRADA REGISTRADA"
        toast.success(statusText, {
          description: `${student.firstName} ${student.lastName} - ${currentTime}`,
          duration: 4000,
        })
        playNotificationSound("success")
      } else if (!existingRecord.exitTime) {
        // Register exit
        updatedRecords[existingRecordIndex] = {
          ...existingRecord,
          exitTime: currentTime,
        }

        toast.success("🚪 SALIDA REGISTRADA", {
          description: `${student.firstName} ${student.lastName} - ${currentTime}`,
          duration: 4000,
        })
        playNotificationSound("success")
      } else {
        toast.warning(`⚠️ ${student.firstName} ${student.lastName}`, {
          description: "Ya tiene entrada y salida registradas hoy",
          duration: 3000,
        })
        playNotificationSound("warning")
      }
    } else {
      // Create new record
      const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30)
      const newRecord: AttendanceRecord = {
        id: `${student.id}-${today}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentPhoto: student.photo,
        grade: student.grade,
        section: student.section,
        date: today,
        entryTime: currentTime,
        status: isLate ? "late" : "present",
        qrCode: scannedCode,
        parentNotified: false,
      }

      updatedRecords = [...attendanceRecords, newRecord]

      const statusText = isLate ? "⏰ TARDANZA REGISTRADA" : "✅ ENTRADA REGISTRADA"
      toast.success(statusText, {
        description: `${student.firstName} ${student.lastName} - ${currentTime}`,
        duration: 4000,
      })
      playNotificationSound("success")
    }

    setAttendanceRecords(updatedRecords)
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords))
    localStorage.setItem(`attendance_${today}`, JSON.stringify(updatedRecords))
    localStorage.setItem(`attendance_backup_${Date.now()}`, JSON.stringify(updatedRecords))
    sessionStorage.setItem("attendanceRecords_session", JSON.stringify(updatedRecords))

    console.log("[v0] Attendance saved with multiple backups")

    // Clear scanner input after processing
    setTimeout(() => {
      setScannerInput("")
      scanBufferRef.current = ""
      setIsScanning(false)
      if (scannerInputRef.current) {
        scannerInputRef.current.focus()
      }
    }, 2000)
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
      let currentFreq = 0

      const playTone = () => {
        if (currentFreq < freqs.length) {
          oscillator.frequency.setValueAtTime(freqs[currentFreq], audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

          setTimeout(() => {
            currentFreq++
            if (currentFreq < freqs.length) {
              playTone()
            } else {
              oscillator.stop()
            }
          }, 200)
        }
      }

      oscillator.start()
      playTone()
    } catch (error) {
      console.log("[v0] Audio not available:", error)
    }
  }

  const handleManualProcess = () => {
    if (!scannerInput.trim()) {
      toast.warning("⚠️ Ingrese un código para procesar")
      return
    }
    processScannedCode(scannerInput.trim())
  }

  // Filter and search logic
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesDate = record.date === selectedDate
    const matchesGrade = filterGrade === "all" || record.grade === filterGrade
    const matchesStatus = filterStatus === "all" || record.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDate && matchesGrade && matchesStatus && matchesSearch
  })

  const stats = {
    total: students.length,
    present: filteredRecords.filter((r) => r.status === "present" || r.status === "late").length,
    absent: students.length - filteredRecords.length,
    late: filteredRecords.filter((r) => r.status === "late").length,
  }

  const exportAttendance = () => {
    const csvContent = [
      ["Fecha", "ID Estudiante", "Nombre", "Grado", "Sección", "Entrada", "Salida", "Estado"],
      ...filteredRecords.map((record) => [
        record.date,
        record.studentId,
        record.studentName,
        record.grade,
        record.section,
        record.entryTime || "",
        record.exitTime || "",
        record.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `asistencias-${selectedDate}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success("📊 Reporte exportado correctamente")
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
                  <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                      Control de Asistencias
                    </h1>
                    <p className="text-muted-foreground">Sistema optimizado para escáner Steren COM-5970</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <NeonButton onClick={exportAttendance} variant="secondary">
                    <Download className="h-5 w-5 mr-2" />
                    Exportar CSV
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Scanner Input Section */}
          <div className="slide-in-right mb-8">
            <GlassCard className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="scanner-input" className="text-lg font-semibold mb-2 block">
                    🎯 Escáner Steren COM-5970
                  </Label>
                  <Input
                    id="scanner-input"
                    ref={scannerInputRef}
                    value={scannerInput}
                    onChange={(e) => setScannerInput(e.target.value)}
                    placeholder="Escanee código QR/barras o escriba manualmente..."
                    className={`glass text-lg font-mono transition-all duration-300 ${
                      isScanning ? "ring-2 ring-lime-500 bg-lime-500/10" : ""
                    }`}
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">{deviceStatus}</p>
                    <div className="text-xs text-muted-foreground">
                      {students.length > 0 ? (
                        <span className="text-lime-600 dark:text-lime-400">
                          ✅ {students.length} estudiantes cargados
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">❌ No hay estudiantes registrados</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <NeonButton
                    onClick={handleManualProcess}
                    disabled={!scannerInput.trim() || isScanning}
                    className="group"
                  >
                    <Scan className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    {isScanning ? "Procesando..." : "Procesar"}
                  </NeonButton>

                  <NeonButton
                    variant="secondary"
                    onClick={() => {
                      setScannerInput("")
                      scanBufferRef.current = ""
                      if (scannerInputRef.current) {
                        scannerInputRef.current.focus()
                      }
                    }}
                  >
                    🗑️ Limpiar
                  </NeonButton>
                </div>
              </div>

              {scannerInput && (
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Código detectado: <span className="font-mono text-foreground">{scannerInput}</span>
                  </p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Stats Cards */}
          <div className="scale-in grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <p className="text-muted-foreground">Total Estudiantes</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{stats.present}</span>
              </div>
              <p className="text-muted-foreground">Presentes</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
              </div>
              <p className="text-muted-foreground">Ausentes</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{stats.late}</span>
              </div>
              <p className="text-muted-foreground">Tardanzas</p>
            </GlassCard>
          </div>

          {/* Filters */}
          <div className="slide-in-left mb-8">
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="date-filter">Fecha</Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="glass"
                  />
                </div>

                <div>
                  <Label htmlFor="grade-filter">Grado</Label>
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Todos los grados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los grados</SelectItem>
                      <SelectItem value="1°">1° Grado</SelectItem>
                      <SelectItem value="2°">2° Grado</SelectItem>
                      <SelectItem value="3°">3° Grado</SelectItem>
                      <SelectItem value="4°">4° Grado</SelectItem>
                      <SelectItem value="5°">5° Grado</SelectItem>
                      <SelectItem value="6°">6° Grado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Estado</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="present">Presente</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                      <SelectItem value="late">Tardanza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Buscar estudiante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="glass pl-10"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Attendance Records */}
          <div className="scale-in">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Registros de Asistencia - {selectedDate}</h3>

              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No hay registros para esta fecha</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={record.studentPhoto || "/placeholder.svg"} alt={record.studentName} />
                          <AvatarFallback>
                            {record.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h4 className="font-semibold">{record.studentName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {record.grade} - {record.section} | ID: {record.studentId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Entrada: {record.entryTime || "No registrada"}</span>
                          </div>
                          {record.exitTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">Salida: {record.exitTime}</span>
                            </div>
                          )}
                        </div>

                        <Badge
                          variant={
                            record.status === "present"
                              ? "default"
                              : record.status === "late"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {record.status === "present" ? "Presente" : record.status === "late" ? "Tardanza" : "Ausente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
