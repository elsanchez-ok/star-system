"use client"

import { useState, useRef, useEffect } from "react"
import { MainNavigation } from "@/components/navigation/main-nav"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Camera, QrCode, Save, Edit, Trash2, Search, Plus, UserCheck, Check } from "lucide-react"
import { toast } from "sonner"

// =============================================
// PASO 1: INTERFACE DEL ESTUDIANTE
// =============================================
/**
 * Interface que define la estructura de datos de un estudiante
 * Si necesitas agregar nuevos campos, modifica esta interface
 */
interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  grade: string
  section: string
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  birthDate: string
  photo?: string
  qrCode: string
  userCode: string // Código de usuario personalizable sin límites
  enrollmentDate: string
  status: "active" | "inactive"
}

// =============================================
// PASO 2: FUNCIÓN PARA AGREGAR A NOCODB
// =============================================
/**
 * Función principal para enviar datos a NocoDB
 * Si NocoDB no recibe los datos, modifica esta función
 */
const addStudentToNocoDB = async (student: Student) => {
  try {
    // PASO 2.1: Configuración de URL y API Key de NocoDB
    const nocodbUrl = "https://app.nocodb.com/api/v2/tables/mzszloazfiqhsoy/records"
    const apiKey = "7E4SleM0Lalrnb6o10xU6Ot6VHn9obRTDfmErpbz"

    // PASO 2.2: Estructura de datos para NocoDB (PRUEBA CON MINÚSCULAS)
    const nocoData = {
      "firstName": student.firstName,
      "lastName": student.lastName,
      "email": student.email,
      "phone": student.phone,
      "grade": student.grade,
      "section": student.section,
      "parentName": student.parentName,
      "parentPhone": student.parentPhone,
      "parentEmail": student.parentEmail,
      "address": student.address,
      "birthDate": student.birthDate,
      "photo": student.photo,
      "qrCode": student.qrCode,
      "userCode": student.userCode,
      "enrollmentDate": student.enrollmentDate,
      "status": student.status,
    }

    console.log("📤 ENVIANDO A NOCODB:", nocoData)

    // PASO 2.3: Envío de datos a NocoDB
    const response = await fetch(nocodbUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xc-token": apiKey,
      },
      body: JSON.stringify(nocoData),
    })

    // PASO 2.4: Verificación de respuesta
    if (response.ok) {
      const result = await response.json()
      console.log("✅ ESTUDIANTE AGREGADO A NOCODB:", result)
      return true
    } else {
      const errorText = await response.text()
      console.error("❌ ERROR EN RESPUESTA DE NOCODB:", errorText)
      return false
    }
  } catch (error) {
    console.error("❌ ERROR AL AGREGAR ESTUDIANTE A NOCODB:", error)
    return false
  }
}

// =============================================
// PASO 3: FUNCIÓN PARA ENVIAR A MAKE (WEBHOOK)
// =============================================
/**
 * Función para enviar datos a Make (integromat)
 * Si cambia el webhook, modifica esta función
 */
const sendStudentToMake = async (student: Student) => {
  try {
    const makeWebhookUrl = "https://hook.us2.make.com/jbbhvcxcaj6ebjuzk2og2kguu0pnfjo3"
    await fetch(makeWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })
    console.log("📨 ESTUDIANTE ENVIADO A MAKE:", student)
  } catch (error) {
    console.error("❌ ERROR AL ENVIAR ESTUDIANTE A MAKE:", error)
  }
}

// =============================================
// PASO 4: COMPONENTE PRINCIPAL DE REGISTRO
// =============================================
export default function RegistrationPage() {
  // =============================================
  // PASO 4.1: ESTADOS PRINCIPALES
  // =============================================
  const [students, setStudents] = useState<Student[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [capturedPhoto, setCapturedPhoto] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  // =============================================
  // PASO 4.2: EFFECT PARA CARGAR DATOS INICIALES
  // =============================================
  useEffect(() => {
    const savedStudents = localStorage.getItem("eduSystem_students")
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    } else {
      // Datos de ejemplo si no hay estudiantes guardados
      const defaultStudents: Student[] = [
        {
          id: "001",
          firstName: "Ana",
          lastName: "García",
          email: "ana.garcia@email.com",
          phone: "555-0101",
          grade: "10",
          section: "A",
          parentName: "Carlos García",
          parentPhone: "555-0102",
          parentEmail: "carlos.garcia@email.com",
          address: "Calle Principal 123",
          birthDate: "2008-05-15",
          qrCode: "QR001STU",
          userCode: "ANA2024001",
          enrollmentDate: "2024-01-15",
          status: "active",
        },
        {
          id: "002",
          firstName: "Luis",
          lastName: "Rodríguez",
          email: "luis.rodriguez@email.com",
          phone: "555-0201",
          grade: "11",
          section: "B",
          parentName: "María Rodríguez",
          parentPhone: "555-0202",
          parentEmail: "maria.rodriguez@email.com",
          address: "Avenida Central 456",
          birthDate: "2007-08-22",
          qrCode: "QR002STU",
          userCode: "LUIS2024002",
          enrollmentDate: "2024-01-15",
          status: "active",
        },
      ]
      setStudents(defaultStudents)
      localStorage.setItem("eduSystem_students", JSON.stringify(defaultStudents))
    }
  }, [])

  // =============================================
  // PASO 4.3: EFFECT PARA AUTO-GUARDADO
  // =============================================
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("eduSystem_students", JSON.stringify(students))
      console.log("💾 AUTO-GUARDADO EN LOCALSTORAGE:", students.length, "estudiantes")
    }
  }, [students])

  // =============================================
  // PASO 4.4: ESTADO DEL FORMULARIO
  // =============================================
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    grade: "",
    section: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    birthDate: "",
    userCode: "", // Código de usuario personalizable
    customQRCode: "", // Código QR personalizable
  })

  // =============================================
  // PASO 4.5: FUNCIONES DE GENERACIÓN DE CÓDIGOS
  // =============================================
  /**
   * Genera código QR automático o usa uno personalizado
   */
  const generateQRCode = (customCode?: string) => {
    if (customCode) return customCode
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `QR${timestamp}${random}`.toUpperCase()
  }

  /**
   * Genera código de usuario automático o usa uno personalizado
   */
  const generateUserCode = (firstName: string, lastName: string, customCode?: string) => {
    if (customCode) return customCode
    const year = new Date().getFullYear()
    const nameCode = (firstName.substring(0, 3) + lastName.substring(0, 3)).toUpperCase()
    const studentNumber = (students.length + 1).toString().padStart(3, "0")
    return `${nameCode}${year}${studentNumber}`
  }

  // =============================================
  // PASO 4.6: FUNCIONES DE CÁMARA Y FOTOS
  // =============================================
  /**
   * Inicia la cámara para tomar fotografía
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      toast.error("Error al acceder a la cámara")
      console.error("Error accediendo a la cámara:", error)
    }
  }

  /**
   * Captura foto desde la cámara
   */
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedPhoto(photoData)

        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCameraActive(false)

        toast.success("Fotografía capturada correctamente")
      }
    }
  }

  // =============================================
  // PASO 4.7: FUNCIÓN PRINCIPAL DE REGISTRO
  // =============================================
  /**
   * Función que se ejecuta al registrar un nuevo estudiante
   * Si hay problemas con el registro, modifica esta función
   */
  const handleRegister = async () => {
    // PASO 4.7.1: Validación de campos obligatorios
    if (!formData.firstName || !formData.lastName || !formData.grade) {
      toast.error("Por favor complete los campos obligatorios")
      return
    }

    // PASO 4.7.2: Creación del objeto estudiante
    const newStudent: Student = {
      id: (students.length + 1).toString().padStart(3, "0"),
      ...formData,
      userCode: formData.userCode || generateUserCode(formData.firstName, formData.lastName),
      photo: capturedPhoto,
      qrCode: generateQRCode(formData.customQRCode),
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "active",
    }

    console.log("🎯 NUEVO ESTUDIANTE CREADO:", newStudent)

    // PASO 4.7.3: Envío a NocoDB
    const nocoDBSuccess = await addStudentToNocoDB(newStudent)
    
    if (nocoDBSuccess) {
      toast.success(`Estudiante ${newStudent.firstName} ${newStudent.lastName} registrado correctamente en NocoDB`)
    } else {
      toast.error("Error al enviar a NocoDB, pero se guardó localmente")
    }

    // PASO 4.7.4: Envío a Make
    sendStudentToMake(newStudent)

    // PASO 4.7.5: Actualización del estado local
    setStudents([...students, newStudent])
    
    // PASO 4.7.6: Limpieza del formulario
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      grade: "",
      section: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      address: "",
      birthDate: "",
      userCode: "",
      customQRCode: "",
    })
    setCapturedPhoto("")
    setIsRegistering(false)
  }

  // =============================================
  // PASO 4.8: FUNCIÓN PARA EDITAR ESTUDIANTES
  // =============================================
  /**
   * Función para editar campos de estudiantes en tiempo real
   */
  const handleEditStudent = (field: keyof Student, value: string, studentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => (student.id === studentId ? { ...student, [field]: value } : student)),
    )
    toast.success(
      `${field === "userCode" ? "Código de usuario" : field === "qrCode" ? "Código QR" : "Campo"} actualizado`,
      { duration: 1500 },
    )
  }

  // =============================================
  // PASO 4.9: FILTRADO DE ESTUDIANTES
  // =============================================
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade

    return matchesSearch && matchesGrade
  })

  // =============================================
  // PASO 4.10: FUNCIÓN PARA ELIMINAR ESTUDIANTES
  // =============================================
  const handleDelete = (studentId: string) => {
    setStudents(students.filter((s) => s.id !== studentId))
    toast.success("Estudiante eliminado correctamente")
  }

  // =============================================
  // PASO 5: INTERFAZ DE USUARIO (JSX)
  // =============================================
  return (
    <div className="min-h-screen page-transition">
      <MainNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* ============================================= */}
          {/* PASO 5.1: ENCABEZADO PRINCIPAL */}
          {/* ============================================= */}
          <div className="slide-in-left mb-8">
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-lime-500 to-cyan-500">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
                      Registro de Estudiantes
                    </h1>
                    <p className="text-muted-foreground">Gestión completa con autoguardado y códigos personalizables</p>
                  </div>
                </div>

                <NeonButton onClick={() => setIsRegistering(true)} variant="primary" className="group">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  Nuevo Estudiante
                </NeonButton>
              </div>
            </GlassCard>
          </div>

          {/* ============================================= */}
          {/* PASO 5.2: FORMULARIO DE REGISTRO */}
          {/* ============================================= */}
          {isRegistering && (
            <div className="scale-in mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Registrar Nuevo Estudiante</h2>
                  <NeonButton variant="secondary" size="sm" onClick={() => setIsRegistering(false)}>
                    Cancelar
                  </NeonButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ============================================= */}
                  {/* PASO 5.2.1: SECCIÓN DE FOTOGRAFÍA */}
                  {/* ============================================= */}
                  <div className="lg:col-span-1">
                    <Label className="text-base font-semibold mb-4 block">Fotografía del Estudiante</Label>

                    {!isCameraActive && !capturedPhoto && (
                      <div className="aspect-square bg-muted rounded-xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/30">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                        <NeonButton onClick={startCamera} size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Activar Cámara
                        </NeonButton>
                      </div>
                    )}

                    {isCameraActive && (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        <NeonButton onClick={capturePhoto} className="w-full">
                          <Camera className="h-4 w-4 mr-2" />
                          Capturar Foto
                        </NeonButton>
                      </div>
                    )}

                    {capturedPhoto && (
                      <div className="space-y-4">
                        <img
                          src={capturedPhoto || "/placeholder.svg"}
                          alt="Foto capturada"
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        <NeonButton
                          onClick={() => {
                            setCapturedPhoto("")
                            startCamera()
                          }}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Tomar Nueva Foto
                        </NeonButton>
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* ============================================= */}
                  {/* PASO 5.2.2: SECCIÓN DE DATOS DEL FORMULARIO */}
                  {/* ============================================= */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Datos del estudiante */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-lime-500" />
                        Datos del Estudiante
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Nombre *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Apellido *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade">Grado *</Label>
                          <Select
                            value={formData.grade}
                            onValueChange={(value) => setFormData({ ...formData, grade: value })}
                          >
                            <SelectTrigger className="glass">
                              <SelectValue placeholder="Seleccionar grado" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  Grado {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="section">Sección</Label>
                          <Select
                            value={formData.section}
                            onValueChange={(value) => setFormData({ ...formData, section: value })}
                          >
                            <SelectTrigger className="glass">
                              <SelectValue placeholder="Seleccionar sección" />
                            </SelectTrigger>
                            <SelectContent>
                              {["A", "B", "C", "D"].map((section) => (
                                <SelectItem key={section} value={section}>
                                  Sección {section}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userCode">Código de Usuario (Personalizable)</Label>
                          <Input
                            id="userCode"
                            value={formData.userCode}
                            onChange={(e) => setFormData({ ...formData, userCode: e.target.value })}
                            placeholder="Ej: ESTUDIANTE2024001 (sin límites de caracteres)"
                            className="glass"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Deja vacío para generar automáticamente</p>
                        </div>
                        <div>
                          <Label htmlFor="customQRCode">Código QR/Barras Personalizado</Label>
                          <Input
                            id="customQRCode"
                            value={formData.customQRCode}
                            onChange={(e) => setFormData({ ...formData, customQRCode: e.target.value })}
                            placeholder="Ej: BARCODE123456 o QR-CUSTOM-001 (sin límites)"
                            className="glass"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Personaliza tu código QR/barras completamente
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Datos del padre/tutor */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-cyan-500" />
                        Datos del Padre/Tutor
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parentName">Nombre del Padre/Tutor</Label>
                          <Input
                            id="parentName"
                            value={formData.parentName}
                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parentPhone">Teléfono del Padre/Tutor</Label>
                          <Input
                            id="parentPhone"
                            value={formData.parentPhone}
                            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                            className="glass"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="parentEmail">Email del Padre/Tutor</Label>
                          <Input
                            id="parentEmail"
                            type="email"
                            value={formData.parentEmail}
                            onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                            className="glass"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="glass"
                        rows={3}
                      />
                    </div>

                    {/* Botón de registro */}
                    <div className="flex justify-end">
                      <NeonButton onClick={handleRegister} size="lg" className="group">
                        <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Registrar Estudiante
                      </NeonButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* ============================================= */}
          {/* PASO 5.3: FILTROS Y BÚSQUEDA */}
          {/* ============================================= */}
          <div className="slide-in-right mb-6">
            <GlassCard className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar estudiantes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Filtrar por grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los grados</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Grado {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ============================================= */}
          {/* PASO 5.4: LISTA DE ESTUDIANTES */}
          {/* ============================================= */}
          <div className="scale-in">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Estudiantes Registrados ({filteredStudents.length})</h2>
                <div className="text-sm text-muted-foreground">✅ Autoguardado activado</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <GlassCard key={student.id} className="p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.photo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-lime-500 to-cyan-500 text-white text-lg">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        {editingStudent?.id === student.id ? (
                          <div className="space-y-3 p-4 bg-gradient-to-r from-lime-500/10 to-cyan-500/10 rounded-lg border border-lime-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <Edit className="h-4 w-4 text-lime-500" />
                              <span className="text-sm font-semibold text-lime-600 dark:text-lime-400">
                                Modo Edición Activo
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Nombre</Label>
                                <Input
                                  value={student.firstName}
                                  onChange={(e) => handleEditStudent("firstName", e.target.value, student.id)}
                                  className="text-sm glass"
                                  placeholder="Nombre"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Apellido</Label>
                                <Input
                                  value={student.lastName}
                                  onChange={(e) => handleEditStudent("lastName", e.target.value, student.id)}
                                  className="text-sm glass"
                                  placeholder="Apellido"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-xs">Código de Usuario (Sin límites)</Label>
                                <Input
                                  value={student.userCode}
                                  onChange={(e) => handleEditStudent("userCode", e.target.value, student.id)}
                                  className="text-sm glass font-mono"
                                  placeholder="Código personalizable sin límites"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-xs">Código QR/Barras (Personalizable)</Label>
                                <Input
                                  value={student.qrCode}
                                  onChange={(e) => handleEditStudent("qrCode", e.target.value, student.id)}
                                  className="text-sm glass font-mono"
                                  placeholder="Tu código QR/barras personalizado"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Email</Label>
                                <Input
                                  value={student.email}
                                  onChange={(e) => handleEditStudent("email", e.target.value, student.id)}
                                  className="text-sm glass"
                                  placeholder="Email"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Teléfono</Label>
                                <Input
                                  value={student.phone}
                                  onChange={(e) => handleEditStudent("phone", e.target.value, student.id)}
                                  className="text-sm glass"
                                  placeholder="Teléfono"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Grado</Label>
                                <Select
                                  value={student.grade}
                                  onValueChange={(value) => handleEditStudent("grade", value, student.id)}
                                >
                                  <SelectTrigger className="glass text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        Grado {i + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Sección</Label>
                                <Select
                                  value={student.section}
                                  onValueChange={(value) => handleEditStudent("section", value, student.id)}
                                >
                                  <SelectTrigger className="glass text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["A", "B", "C", "D"].map((section) => (
                                      <SelectItem key={section} value={section}>
                                        Sección {section}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <NeonButton
                                size="sm"
                                onClick={() => {
                                  setEditingStudent(null)
                                  toast.success("Cambios guardados correctamente")
                                }}
                                className="bg-lime-500 hover:bg-lime-600"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Guardar
                              </NeonButton>
                              <NeonButton size="sm" variant="secondary" onClick={() => setEditingStudent(null)}>
                                Cancelar
                              </NeonButton>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold text-lg truncate">
                              {student.firstName} {student.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                            <p className="text-xs text-lime-600 dark:text-lime-400 font-mono break-all">
                              👤 {student.userCode}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">
                                Grado {student.grade}
                                {student.section}
                              </Badge>
                              <Badge
                                variant={student.status === "active" ? "default" : "destructive"}
                                className={
                                  student.status === "active" ? "bg-lime-500/20 text-lime-700 dark:text-lime-300" : ""
                                }
                              >
                                {student.status === "active" ? "Activo" : "Inactivo"}
                              </Badge>
                            </div>

                            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                              <p className="break-all">📧 {student.email}</p>
                              <p>📱 {student.phone}</p>
                              <p>👨‍👩‍👧‍👦 {student.parentName}</p>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <QrCode className="h-3 w-3" />
                                <span className="font-mono break-all">{student.qrCode}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <NeonButton
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingStudent(student)}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </NeonButton>
                              <NeonButton size="sm" variant="danger" onClick={() => handleDelete(student.id)}>
                                <Trash2 className="h-3 w-3" />
                              </NeonButton>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* ============================================= */}
              {/* PASO 5.5: MENSAJE CUANDO NO HAY ESTUDIANTES */}
              {/* ============================================= */}
              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron estudiantes</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedGrade !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Comienza registrando tu primer estudiante"}
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
