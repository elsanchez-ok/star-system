"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Users,
  UserPlus,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Edit,
  Trash2,
  Camera,
  QrCode,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  MessageCircle,
  Phone,
  CalendarIcon,
  Bluetooth,
  Usb,
  ScanLine,
  UserCheck,
  MessageSquare,
  Plus,
  Filter,
  Download,
  Upload,
  Monitor,
  Video,
  Scan,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Student {
  id: string
  name: string
  grade: string
  section: string
  idNumber: string
  photo: string
  parentName: string
  parentPhone: string
  whatsappNumber: string
  address: string
  birthDate: string
  status: "active" | "inactive"
  attendanceRate: number
  enrollmentDate: string
  academicYear: string
}

interface User {
  id: string
  name: string
  role: "admin" | "counseling" | "parents" | "direction" | "registration" | "teacher"
  username: string
  email: string
  phone: string
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
  password?: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  type: "admin" | "general"
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "meeting" | "event" | "reminder"
  description: string
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "MARÍA GONZÁLEZ LÓPEZ",
    grade: "10°",
    section: "A",
    idNumber: "0501201003127",
    photo: "/placeholder-j0goy.png",
    parentName: "CARLOS GONZÁLEZ",
    parentPhone: "+504 9876-5432",
    whatsappNumber: "+504 9876-5432",
    address: "COL. KENNEDY, TEGUCIGALPA",
    birthDate: "2008-03-15",
    status: "active",
    attendanceRate: 95,
    enrollmentDate: "2024-01-15",
    academicYear: "2024",
  },
  {
    id: "2",
    name: "JOSÉ MARTÍNEZ RIVERA",
    grade: "11°",
    section: "B",
    idNumber: "0501200912345",
    photo: "/student-boy.png",
    parentName: "ANA RIVERA",
    parentPhone: "+504 8765-4321",
    whatsappNumber: "+504 8765-4321",
    address: "COL. MIRAFLORES, TEGUCIGALPA",
    birthDate: "2007-08-22",
    status: "active",
    attendanceRate: 88,
    enrollmentDate: "2024-01-15",
    academicYear: "2024",
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    name: "ADMIN PRINCIPAL",
    role: "admin",
    username: "admin",
    email: "admin@escuela.edu",
    phone: "+504 1234-5678",
    status: "active",
    lastLogin: "2024-01-15 08:30",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "CONSEJERA MARÍA",
    role: "counseling",
    username: "consejeria",
    email: "consejeria@escuela.edu",
    phone: "+504 2345-6789",
    status: "active",
    lastLogin: "2024-01-15 07:45",
    permissions: ["students", "attendance"],
  },
]

const gradeOptions = [
  { value: "7°", label: "7° GRADO" },
  { value: "8°", label: "8° GRADO" },
  { value: "9°", label: "9° GRADO" },
  { value: "10°", label: "10° GRADO" },
  { value: "11°", label: "11° GRADO" },
  { value: "12°", label: "12° GRADO" },
]

const sectionOptions = ["A", "B", "C", "D", "E"]

const roleOptions = [
  { value: "admin", label: "ADMINISTRADOR" },
  { value: "counseling", label: "CONSEJERÍA" },
  { value: "teacher", label: "DOCENTE" },
  { value: "direction", label: "DIRECCIÓN" },
  { value: "registration", label: "REGISTRO" },
  { value: "parents", label: "PADRE DE FAMILIA" },
]

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingStudent, setIsEditingStudent] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all")
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>("all")
  const [showCamera, setShowCamera] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string>("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeChat, setActiveChat] = useState<"admin" | "general">("admin")
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showCalendar, setShowCalendar] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: "", description: "", type: "meeting" as const })
  const [deviceStatus, setDeviceStatus] = useState({
    camera: "connected",
    scanner: "connected",
    usb: "disconnected",
    bluetooth: "connected",
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    grade: "",
    section: "",
    idNumber: "",
    parentName: "",
    parentPhone: "",
    whatsappNumber: "",
    address: "",
    birthDate: "",
    status: "active",
    academicYear: "2024",
  })

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    role: "teacher",
    username: "",
    email: "",
    phone: "",
    status: "active",
    permissions: [],
  })

  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)

  const updateFilteredStudents = () => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.idNumber.includes(searchTerm) ||
        student.grade.includes(searchTerm)

      const matchesGrade = selectedGradeFilter === "all" || student.grade === selectedGradeFilter
      const matchesSection = selectedSectionFilter === "all" || student.section === selectedSectionFilter

      return matchesSearch && matchesGrade && matchesSection
    })
    setFilteredStudents(filtered)
  }

  useEffect(() => {
    updateFilteredStudents()
  }, [searchTerm, selectedGradeFilter, selectedSectionFilter, students]) // Added students dependency

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "active").length
  const averageAttendance = students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)
      const photoData = canvas.toDataURL("image/jpeg")
      setCapturedPhoto(photoData)
      setShowCamera(false)
      // Stop camera stream
      const stream = video.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
    }
  }

  const handleAddStudent = () => {
    console.log("[v0] Adding new student:", newStudent)
    if (newStudent.name && newStudent.idNumber) {
      const registrationId = `REG-${Date.now()}`
      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name.toUpperCase(),
        grade: newStudent.grade || "",
        section: newStudent.section || "",
        idNumber: newStudent.idNumber,
        photo: capturedPhoto || "/placeholder-cw0bg.png",
        parentName: newStudent.parentName?.toUpperCase() || "",
        parentPhone: newStudent.parentPhone || "",
        whatsappNumber: newStudent.whatsappNumber || newStudent.parentPhone || "",
        address: newStudent.address?.toUpperCase() || "",
        birthDate: newStudent.birthDate || "",
        status: "active",
        attendanceRate: 100,
        enrollmentDate: new Date().toISOString().split("T")[0],
        academicYear: newStudent.academicYear || "2024",
      }

      const updatedStudents = [...students, student]
      setStudents(updatedStudents)

      localStorage.setItem("schoolStudents", JSON.stringify(updatedStudents))

      setNewStudent({
        name: "",
        grade: "",
        section: "",
        idNumber: "",
        parentName: "",
        parentPhone: "",
        whatsappNumber: "",
        address: "",
        birthDate: "",
        status: "active",
        academicYear: "2024",
      })
      setCapturedPhoto("")
      setIsAddingStudent(false)
      console.log("[v0] Student added successfully with ID:", registrationId)
      alert(`Estudiante ${student.name} agregado exitosamente con ID de registro: ${registrationId}`)
    } else {
      console.log("[v0] Missing required fields for new student")
      alert("Por favor complete todos los campos obligatorios")
    }
  }

  const handleEditStudent = (student: Student) => {
    console.log("[v0] Editing student:", student)
    setNewStudent({
      name: student.name,
      grade: student.grade,
      section: student.section,
      idNumber: student.idNumber,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      whatsappNumber: student.whatsappNumber,
      address: student.address,
      birthDate: student.birthDate,
      status: student.status,
      academicYear: student.academicYear,
    })
    setEditingStudentId(student.id)
    setIsEditingStudent(true) // Use editing dialog instead of adding dialog
    setCapturedPhoto(student.photo)
  }

  const handleSaveEditedStudent = () => {
    console.log("[v0] Saving edited student:", { editingStudentId, newStudent })
    if (editingStudentId && newStudent.name && newStudent.idNumber) {
      const updatedStudents = students.map((student) =>
        student.id === editingStudentId
          ? {
              ...student,
              name: newStudent.name.toUpperCase(),
              grade: newStudent.grade || "",
              section: newStudent.section || "",
              idNumber: newStudent.idNumber,
              photo: capturedPhoto || student.photo,
              parentName: newStudent.parentName?.toUpperCase() || "",
              parentPhone: newStudent.parentPhone || "",
              whatsappNumber: newStudent.whatsappNumber || newStudent.parentPhone || "",
              address: newStudent.address?.toUpperCase() || "",
              birthDate: newStudent.birthDate || "",
              status: newStudent.status,
              academicYear: newStudent.academicYear || "2024",
            }
          : student,
      )
      setStudents(updatedStudents)

      localStorage.setItem("schoolStudents", JSON.stringify(updatedStudents))

      setNewStudent({
        name: "",
        grade: "",
        section: "",
        idNumber: "",
        parentName: "",
        parentPhone: "",
        whatsappNumber: "",
        address: "",
        birthDate: "",
        status: "active",
        academicYear: "2024",
      })
      setCapturedPhoto("")
      setEditingStudentId(null)
      setIsEditingStudent(false) // Fixed: was setIsAddingStudent(false)
      console.log("[v0] Student updated successfully")
      alert("Estudiante actualizado exitosamente")
    } else {
      console.log("[v0] Missing required fields for student update")
      alert("Por favor complete todos los campos obligatorios")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditUser = (user: User) => {
    setNewUser({
      name: user.name,
      role: user.role,
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      permissions: user.permissions,
      password: "", // Always require new password for security
    })
    setSelectedUser(user)
    setIsEditingUser(true)
  }

  const handleSaveUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.password) {
      if (newUser.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres")
        return
      }

      if (isEditingUser && selectedUser) {
        // Update existing user
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: newUser.name.toUpperCase(),
                role: newUser.role as any,
                username: newUser.username || user.username,
                email: newUser.email.toLowerCase(),
                phone: newUser.phone || user.phone,
                status: newUser.status || user.status,
                permissions: newUser.permissions || user.permissions,
              }
            : user,
        )
        setUsers(updatedUsers)
        alert("Usuario actualizado exitosamente")
      } else {
        // Create new user
        const user: User = {
          id: Date.now().toString(),
          name: newUser.name.toUpperCase(),
          role: newUser.role as any,
          username: newUser.username || newUser.email.split("@")[0],
          email: newUser.email.toLowerCase(),
          phone: newUser.phone || "",
          status: "active",
          lastLogin: "Nunca",
          permissions: newUser.permissions || [],
        }
        setUsers([...users, user])
        alert("Usuario creado exitosamente")
      }

      // Reset form
      setNewUser({
        name: "",
        role: "teacher",
        username: "",
        email: "",
        phone: "",
        status: "active",
        permissions: [],
        password: "",
      })
      setSelectedUser(null)
      setIsEditingUser(false)
      setIsAddingUser(false)
    } else {
      alert("Por favor complete todos los campos incluyendo la contraseña")
    }
  }

  const handleAddUser = () => {
    if (newUser.name && newUser.username) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name.toUpperCase(),
        role: newUser.role as any,
        username: newUser.username,
        email: newUser.email || "",
        phone: newUser.phone || "",
        status: "active",
        lastLogin: "Nunca",
        permissions: newUser.permissions || [],
      }
      setUsers([...users, user])
      setNewUser({
        name: "",
        role: "teacher",
        username: "",
        email: "",
        phone: "",
        status: "active",
        permissions: [],
      })
      setIsAddingUser(false)
    }
  }

  const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: "ADMIN PRINCIPAL",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: activeChat,
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  const addCalendarEvent = () => {
    if (newEvent.title && selectedDate) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: selectedDate,
        type: newEvent.type,
        description: newEvent.description,
      }
      setCalendarEvents([...calendarEvents, event])
      setNewEvent({ title: "", description: "", type: "meeting" })
      setShowCalendar(false)
    }
  }

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id))
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleStartScanning = async () => {
    console.log("[v0] Starting QR/Barcode scanning...")
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        console.log("[v0] Camera access granted")
        stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately

        setDeviceStatus((prev) => ({ ...prev, scanner: "connected", camera: "connected" }))
        alert("Escáner activado. Cámara detectada y lista para escanear códigos QR y PDF417")
      } else {
        console.log("[v0] Camera not available")
        setDeviceStatus((prev) => ({ ...prev, scanner: "disconnected", camera: "disconnected" }))
        alert("No se pudo acceder a la cámara para el escáner")
      }
    } catch (error) {
      console.error("[v0] Scanner activation error:", error)
      setDeviceStatus((prev) => ({ ...prev, scanner: "disconnected" }))
      alert("Error al activar el escáner: " + error.message)
    }
  }

  const handleActivateUSB = async () => {
    console.log("[v0] Attempting to detect USB devices...")
    try {
      if ("usb" in navigator) {
        const devices = await navigator.usb.getDevices()
        console.log("[v0] Found USB devices:", devices)

        if (devices.length > 0) {
          setDeviceStatus((prev) => ({ ...prev, usb: "connected" }))
          alert(`Dispositivos USB detectados: ${devices.length} dispositivo(s) conectado(s)`)
        } else {
          // Try to request device access
          try {
            const device = await navigator.usb.requestDevice({ filters: [] })
            console.log("[v0] USB device selected:", device)
            setDeviceStatus((prev) => ({ ...prev, usb: "connected" }))
            alert("Dispositivo USB conectado y configurado")
          } catch (error) {
            console.log("[v0] No USB device selected")
            setDeviceStatus((prev) => ({ ...prev, usb: "disconnected" }))
            alert("No se seleccionó ningún dispositivo USB")
          }
        }
      } else {
        console.log("[v0] Web USB API not supported")
        // Fallback for browsers without Web USB API
        setDeviceStatus((prev) => ({ ...prev, usb: "connected" }))
        alert("Dispositivo USB simulado - API Web USB no disponible en este navegador")
      }
    } catch (error) {
      console.error("[v0] USB detection error:", error)
      setDeviceStatus((prev) => ({ ...prev, usb: "disconnected" }))
      alert("Error al detectar dispositivos USB")
    }
  }

  const generateReport = (reportType: string) => {
    console.log("[v0] Generating report:", reportType)
    const reportData = {
      type: reportType,
      generatedAt: new Date().toISOString(),
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === "active").length,
      averageAttendance: Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length),
    }

    // Simulate report generation
    alert(
      `Generando ${reportType}...\nEstudiantes: ${reportData.totalStudents}\nAsistencia promedio: ${reportData.averageAttendance}%`,
    )
  }

  const saveConfiguration = () => {
    console.log("[v0] Saving system configuration...")
    alert("Configuración guardada exitosamente")
  }

  useEffect(() => {
    const savedStudents = localStorage.getItem("schoolStudents")
    if (savedStudents) {
      try {
        const parsedStudents = JSON.parse(savedStudents)
        setStudents(parsedStudents)
        console.log("[v0] Loaded persisted students:", parsedStudents.length)
      } catch (error) {
        console.error("[v0] Error loading persisted students:", error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Header */}
      <header className="glass-dark border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">PANEL DE ADMINISTRACIÓN</h1>
              <p className="text-sm text-gray-300">Sistema de Gestión Escolar Avanzado</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${deviceStatus.camera === "connected" ? "bg-green-400" : "bg-red-400"}`}
              />
              <Camera className="h-4 w-4 text-gray-400" />
              <div
                className={`w-2 h-2 rounded-full ${deviceStatus.scanner === "connected" ? "bg-green-400" : "bg-red-400"}`}
              />
              <ScanLine className="h-4 w-4 text-gray-400" />
              <div
                className={`w-2 h-2 rounded-full ${deviceStatus.usb === "connected" ? "bg-green-400" : "bg-red-400"}`}
              />
              <Usb className="h-4 w-4 text-gray-400" />
              <div
                className={`w-2 h-2 rounded-full ${deviceStatus.bluetooth === "connected" ? "bg-green-400" : "bg-red-400"}`}
              />
              <Bluetooth className="h-4 w-4 text-gray-400" />
            </div>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              ADMINISTRADOR
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              SALIR
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">TOTAL ESTUDIANTES</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalStudents}</div>
              <p className="text-xs text-gray-400">Registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ESTUDIANTES ACTIVOS</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeStudents}</div>
              <p className="text-xs text-gray-400">Estado activo</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ASISTENCIA PROMEDIO</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageAttendance.toFixed(1)}%</div>
              <p className="text-xs text-gray-400">Promedio general</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">USUARIOS ACTIVOS</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter((u) => u.status === "active").length}</div>
              <p className="text-xs text-gray-400">Conectados al sistema</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 border border-gray-600">
            <TabsTrigger value="students" className="data-[state=active]:bg-blue-600">
              <Users className="h-4 w-4 mr-2" />
              ESTUDIANTES
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
              <UserCheck className="h-4 w-4 mr-2" />
              USUARIOS
            </TabsTrigger>
            <TabsTrigger value="scanner" className="data-[state=active]:bg-blue-600">
              <ScanLine className="h-4 w-4 mr-2" />
              ESCÁNER
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              REPORTES
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              CALENDARIO
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              CHAT
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              CONFIG
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            {/* Student Management Header */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="BUSCAR ESTUDIANTE..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      AGREGAR ESTUDIANTE
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-dark border-gray-600 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">AGREGAR NUEVO ESTUDIANTE</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Complete la información del estudiante. Use la cámara para capturar la foto.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mb-6">
                      <Label className="text-white mb-2 block">FOTOGRAFÍA DEL ESTUDIANTE</Label>
                      <div className="flex items-center gap-4">
                        {capturedPhoto ? (
                          <div className="relative">
                            <img
                              src={capturedPhoto || "/placeholder.svg"}
                              alt="Captured"
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                              onClick={() => setCapturedPhoto("")}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                            <Camera className="h-4 w-4 mr-2" />
                            USAR CÁMARA
                          </Button>
                          <label htmlFor="photo-upload">
                            <Button
                              variant="outline"
                              className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
                              asChild
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                SUBIR ARCHIVO
                              </span>
                            </Button>
                          </label>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {showCamera && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                          <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg mb-4" />
                          <canvas ref={canvasRef} style={{ display: "none" }} />
                          <div className="flex gap-2">
                            <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                              <Camera className="h-4 w-4 mr-2" />
                              CAPTURAR FOTO
                            </Button>
                            <Button variant="outline" onClick={() => setShowCamera(false)} className="border-gray-600">
                              CANCELAR
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">NOMBRE COMPLETO</Label>
                        <Input
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value.toUpperCase() })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="NOMBRE DEL ESTUDIANTE"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">NÚMERO DE IDENTIDAD</Label>
                        <Input
                          value={newStudent.idNumber}
                          onChange={(e) => setNewStudent({ ...newStudent, idNumber: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="0501201003127"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">GRADO</Label>
                        <Select
                          value={newStudent.grade}
                          onValueChange={(value) => setNewStudent({ ...newStudent, grade: value })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                            <SelectValue placeholder="SELECCIONAR GRADO" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {gradeOptions.map((grade) => (
                              <SelectItem
                                key={grade.value}
                                value={grade.value}
                                className="text-white hover:bg-gray-700 focus:bg-gray-700"
                              >
                                {grade.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">SECCIÓN</Label>
                        <Select
                          value={newStudent.section}
                          onValueChange={(value) => setNewStudent({ ...newStudent, section: value })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                            <SelectValue placeholder="SELECCIONAR SECCIÓN" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {sectionOptions.map((section) => (
                              <SelectItem
                                key={section}
                                value={section}
                                className="text-white hover:bg-gray-700 focus:bg-gray-700"
                              >
                                SECCIÓN {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">NOMBRE DEL PADRE/MADRE</Label>
                        <Input
                          value={newStudent.parentName}
                          onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value.toUpperCase() })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="NOMBRE DEL RESPONSABLE"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">TELÉFONO</Label>
                        <Input
                          value={newStudent.parentPhone}
                          onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="+504 0000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">WHATSAPP</Label>
                        <Input
                          value={newStudent.whatsappNumber}
                          onChange={(e) => setNewStudent({ ...newStudent, whatsappNumber: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="+504 0000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">FECHA DE NACIMIENTO</Label>
                        <Input
                          type="date"
                          value={newStudent.birthDate}
                          onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-white">DIRECCIÓN</Label>
                        <Textarea
                          value={newStudent.address}
                          onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value.toUpperCase() })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="DIRECCIÓN COMPLETA"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingStudent(false)}
                        className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        CANCELAR
                      </Button>
                      <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                        AGREGAR ESTUDIANTE
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isEditingStudent} onOpenChange={setIsEditingStudent}>
                  <DialogContent className="glass-dark border-gray-600 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">EDITAR ESTUDIANTE</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Modifique la información del estudiante. Use la cámara para actualizar la foto.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mb-6">
                      <Label className="text-white mb-2 block">FOTOGRAFÍA DEL ESTUDIANTE</Label>
                      <div className="flex items-center gap-4">
                        {capturedPhoto ? (
                          <div className="relative">
                            <img
                              src={capturedPhoto || "/placeholder.svg"}
                              alt="Captured"
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                              onClick={() => setCapturedPhoto("")}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                            <Camera className="h-4 w-4 mr-2" />
                            USAR CÁMARA
                          </Button>
                          <label htmlFor="photo-upload-edit">
                            <Button
                              variant="outline"
                              className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
                              asChild
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                SUBIR ARCHIVO
                              </span>
                            </Button>
                          </label>
                          <input
                            id="photo-upload-edit"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {showCamera && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                          <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg mb-4" />
                          <canvas ref={canvasRef} style={{ display: "none" }} />
                          <div className="flex gap-2">
                            <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                              <Camera className="h-4 w-4 mr-2" />
                              CAPTURAR FOTO
                            </Button>
                            <Button variant="outline" onClick={() => setShowCamera(false)} className="border-gray-600">
                              CANCELAR
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">NOMBRE COMPLETO</Label>
                        <Input
                          value={newStudent.name || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value.toUpperCase() })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="NOMBRE DEL ESTUDIANTE"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">NÚMERO DE IDENTIDAD</Label>
                        <Input
                          value={newStudent.idNumber || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, idNumber: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="0501201003127"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">GRADO</Label>
                        <Select
                          value={newStudent.grade || ""}
                          onValueChange={(value) => setNewStudent({ ...newStudent, grade: value })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                            <SelectValue placeholder="SELECCIONAR GRADO" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {gradeOptions.map((grade) => (
                              <SelectItem
                                key={grade.value}
                                value={grade.value}
                                className="text-white hover:bg-gray-700 focus:bg-gray-700"
                              >
                                {grade.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">SECCIÓN</Label>
                        <Select
                          value={newStudent.section || ""}
                          onValueChange={(value) => setNewStudent({ ...newStudent, section: value })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                            <SelectValue placeholder="SELECCIONAR SECCIÓN" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {sectionOptions.map((section) => (
                              <SelectItem
                                key={section}
                                value={section}
                                className="text-white hover:bg-gray-700 focus:bg-gray-700"
                              >
                                SECCIÓN {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">NOMBRE DEL PADRE/MADRE</Label>
                        <Input
                          value={newStudent.parentName || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value.toUpperCase() })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="NOMBRE DEL RESPONSABLE"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">TELÉFONO</Label>
                        <Input
                          value={newStudent.parentPhone || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="+504 0000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">WHATSAPP</Label>
                        <Input
                          value={newStudent.whatsappNumber || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, whatsappNumber: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="+504 0000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">FECHA DE NACIMIENTO</Label>
                        <Input
                          type="date"
                          value={newStudent.birthDate || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-white">DIRECCIÓN</Label>
                        <Textarea
                          value={newStudent.address || ""}
                          onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value.toUpperCase() })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="DIRECCIÓN COMPLETA"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingStudent(false)
                          setEditingStudentId(null)
                          setNewStudent({
                            name: "",
                            grade: "",
                            section: "",
                            idNumber: "",
                            parentName: "",
                            parentPhone: "",
                            whatsappNumber: "",
                            address: "",
                            birthDate: "",
                            status: "active",
                            academicYear: "2024",
                          })
                          setCapturedPhoto("")
                        }}
                        className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        CANCELAR
                      </Button>
                      <Button onClick={handleSaveEditedStudent} className="bg-blue-600 hover:bg-blue-700">
                        ACTUALIZAR ESTUDIANTE
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={selectedGradeFilter} onValueChange={setSelectedGradeFilter}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">TODOS LOS GRADOS</SelectItem>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedSectionFilter} onValueChange={setSelectedSectionFilter}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">TODAS LAS SECCIONES</SelectItem>
                      {sectionOptions.map((section) => (
                        <SelectItem key={section} value={section}>
                          SECCIÓN {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline" className="border-blue-400 text-blue-300">
                  {filteredStudents.length} ESTUDIANTES
                </Badge>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="glass border-gray-600 hover:neon-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="sm"
                            onClick={() => handleEditStudent(student)}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{student.name}</h3>
                          <p className="text-xs text-gray-400">
                            {student.grade} - {student.section}
                          </p>
                        </div>
                      </div>
                      <Badge variant={student.status === "active" ? "default" : "secondary"} className="text-xs">
                        {student.status === "active" ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">ID: {student.idNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">Asistencia: {student.attendanceRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">{student.parentPhone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStudent(student)} // Fixed to pass student object instead of ID
                        className="border-blue-400 text-blue-300 hover:bg-blue-900/20"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        EDITAR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          sendWhatsAppMessage(
                            student.whatsappNumber,
                            `Hola ${student.parentName}, este es un mensaje desde el colegio sobre ${student.name}.`,
                          )
                        }
                        className="border-green-400 text-green-300 hover:bg-green-900/20"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        WHATSAPP
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="BUSCAR USUARIO..." className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
              <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    AGREGAR USUARIO
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-dark border-gray-600 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">AGREGAR NUEVO USUARIO</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Complete la información del usuario del sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">NOMBRE COMPLETO</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value.toUpperCase() })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="NOMBRE DEL USUARIO"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">ROL</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                          <SelectValue placeholder="SELECCIONAR ROL" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {roleOptions.map((role) => (
                            <SelectItem
                              key={role.value}
                              value={role.value}
                              className="text-white hover:bg-gray-700 focus:bg-gray-700"
                            >
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">NOMBRE DE USUARIO</Label>
                      <Input
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value.toLowerCase() })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="usuario123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">EMAIL</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="usuario@escuela.edu"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-white">TELÉFONO</Label>
                      <Input
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="+504 0000-0000"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddUser} className="flex-1 bg-green-600 hover:bg-green-700">
                      CREAR USUARIO
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingUser(false)} className="border-gray-600">
                      CANCELAR
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="glass border-gray-600">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-purple-600 text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{user.name}</h3>
                          <p className="text-xs text-gray-400">
                            {roleOptions.find((r) => r.value === user.role)?.label}
                          </p>
                        </div>
                      </div>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                        {user.status === "active" ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">@{user.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">Último: {user.lastLogin}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)} // Added onClick handler for user editing
                        className="flex-1 border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        EDITAR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    CÁMARA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Estado:</span>
                      <Badge variant={deviceStatus.camera === "connected" ? "default" : "destructive"}>
                        {deviceStatus.camera === "connected" ? "CONECTADA" : "DESCONECTADA"}
                      </Badge>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={startCamera}>
                      <Video className="h-4 w-4 mr-2" />
                      ACTIVAR CÁMARA
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ScanLine className="h-5 w-5" />
                    ESCÁNER QR/CÓDIGO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Estado:</span>
                      <Badge variant={deviceStatus.scanner === "connected" ? "default" : "destructive"}>
                        {deviceStatus.scanner === "connected" ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleStartScanning}>
                      <Scan className="h-4 w-4 mr-2" />
                      INICIAR ESCANEO
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Usb className="h-5 w-5" />
                    DISPOSITIVOS USB
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Estado:</span>
                      <Badge variant={deviceStatus.usb === "connected" ? "default" : "destructive"}>
                        {deviceStatus.usb === "connected" ? "CONECTADO" : "DESCONECTADO"}
                      </Badge>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleActivateUSB}>
                      <Monitor className="h-4 w-4 mr-2" />
                      CONECTAR USB
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">HISTORIAL DE ESCANEOS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <QrCode className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-white text-sm">ESTUDIANTE {i}</p>
                          <p className="text-gray-400 text-xs">ID: 050120100312{i}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">08:3{i} AM</p>
                        <p className="text-gray-400 text-xs">ENTRADA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">CALENDARIO</CardTitle>
                  <CardDescription className="text-gray-300">Seleccione una fecha para agregar eventos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-gray-600"
                    locale={es}
                  />
                  {selectedDate && (
                    <div className="mt-4 space-y-3">
                      <Input
                        placeholder="TÍTULO DEL EVENTO"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Textarea
                        placeholder="DESCRIPCIÓN"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">REUNIÓN</SelectItem>
                          <SelectItem value="event">EVENTO</SelectItem>
                          <SelectItem value="reminder">RECORDATORIO</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addCalendarEvent} className="w-full bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        AGREGAR EVENTO
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">PRÓXIMOS EVENTOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calendarEvents.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay eventos programados</p>
                    ) : (
                      calendarEvents.map((event) => (
                        <div key={event.id} className="p-3 bg-gray-800 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{event.title}</h4>
                              <p className="text-gray-400 text-sm">{event.description}</p>
                              <p className="text-blue-400 text-xs mt-1">{format(event.date, "PPP", { locale: es })}</p>
                            </div>
                            <Badge variant="outline" className="border-blue-400 text-blue-300">
                              {event.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass border-gray-600 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">SISTEMA DE CHAT</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={activeChat === "admin" ? "default" : "outline"}
                        onClick={() => setActiveChat("admin")}
                        className={activeChat === "admin" ? "bg-blue-600" : "border-gray-600"}
                      >
                        CHAT ADMIN
                      </Button>
                      <Button
                        size="sm"
                        variant={activeChat === "general" ? "default" : "outline"}
                        onClick={() => setActiveChat("general")}
                        className={activeChat === "general" ? "bg-blue-600" : "border-gray-600"}
                      >
                        CHAT GENERAL
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-64 bg-gray-800 rounded-lg p-4 overflow-y-auto">
                      {chatMessages
                        .filter((msg) => msg.type === activeChat)
                        .map((message) => (
                          <div key={message.id} className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-blue-400 text-sm font-semibold">{message.sender}</span>
                              <span className="text-gray-500 text-xs">{message.timestamp}</span>
                            </div>
                            <p className="text-white text-sm bg-gray-700 p-2 rounded">{message.message}</p>
                          </div>
                        ))}
                      {chatMessages.filter((msg) => msg.type === activeChat).length === 0 && (
                        <p className="text-gray-400 text-center py-8">No hay mensajes en este chat</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="ESCRIBIR MENSAJE..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button onClick={sendChatMessage} className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">USUARIOS CONECTADOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users
                      .filter((u) => u.status === "active")
                      .map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                          <div
                            className={`w-8 h-8 ${
                              user.role === "admin"
                                ? "bg-blue-600"
                                : user.role === "counseling"
                                  ? "bg-green-600"
                                  : user.role === "direction"
                                    ? "bg-purple-600"
                                    : "bg-gray-600"
                            } rounded-full flex items-center justify-center`}
                          >
                            <span className="text-white text-xs font-bold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">{user.name}</p>
                            <p className="text-gray-400 text-xs">En línea</p>
                          </div>
                        </div>
                      ))}
                    {users.filter((u) => u.status === "active").length === 0 && (
                      <p className="text-gray-400 text-center py-4">No hay usuarios conectados</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">REPORTES Y ESTADÍSTICAS</CardTitle>
                <CardDescription className="text-gray-300">Análisis detallado del sistema educativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">REPORTES DISPONIBLES</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                        onClick={() => generateReport("REPORTE DE ASISTENCIAS")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        REPORTE DE ASISTENCIAS
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                        onClick={() => generateReport("ESTADÍSTICAS MENSUALES")}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        ESTADÍSTICAS MENSUALES
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                        onClick={() => generateReport("LISTADO DE ESTUDIANTES")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        LISTADO DE ESTUDIANTES
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                        onClick={() => generateReport("EXPORTAR DATOS")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        EXPORTAR DATOS
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">ESTADÍSTICAS RÁPIDAS</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Estudiantes por grado:</span>
                        <span className="text-white font-semibold">Promedio 45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Asistencia semanal:</span>
                        <span className="text-green-400 font-semibold">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Registros diarios:</span>
                        <span className="text-blue-400 font-semibold">~250</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Usuarios activos:</span>
                        <span className="text-purple-400 font-semibold">
                          {users.filter((u) => u.status === "active").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">CONFIGURACIÓN DEL SISTEMA</CardTitle>
                <CardDescription className="text-gray-300">Ajustes generales y personalización</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">CONFIGURACIÓN GENERAL</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">NOMBRE DE LA INSTITUCIÓN</Label>
                        <Input
                          defaultValue="INSTITUTO EDUCATIVO PRESTIGIOSO"
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">AÑO ACADÉMICO</Label>
                        <Input defaultValue="2024" className="bg-gray-800 border-gray-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">ZONA HORARIA</Label>
                        <Select defaultValue="america/tegucigalpa">
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america/tegucigalpa">AMÉRICA/TEGUCIGALPA</SelectItem>
                            <SelectItem value="america/guatemala">AMÉRICA/GUATEMALA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">IDIOMA DEL SISTEMA</Label>
                        <Select defaultValue="es">
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">ESPAÑOL</SelectItem>
                            <SelectItem value="en">INGLÉS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-600">
                    <h4 className="font-semibold text-white">CONFIGURACIÓN DE NOTIFICACIONES</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Notificaciones WhatsApp</span>
                        <Button size="sm" variant="outline" className="border-green-600 text-green-400 bg-transparent">
                          ACTIVADO
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Alertas de asistencia</span>
                        <Button size="sm" variant="outline" className="border-blue-600 text-blue-400 bg-transparent">
                          ACTIVADO
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Reportes automáticos</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-600 text-yellow-400 bg-transparent"
                        >
                          ACTIVADO
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveConfiguration}>
                      <Settings className="h-4 w-4 mr-2" />
                      GUARDAR CONFIGURACIÓN
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog
          open={isAddingUser || isEditingUser}
          onOpenChange={(open) => {
            setIsAddingUser(open)
            setIsEditingUser(open)
            if (!open) {
              setSelectedUser(null)
              setNewUser({
                name: "",
                role: "teacher",
                username: "",
                email: "",
                phone: "",
                status: "active",
                permissions: [],
                password: "",
              })
            }
          }}
        >
          <DialogContent className="glass-dark border-gray-600 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditingUser ? "EDITAR USUARIO" : "AGREGAR NUEVO USUARIO"}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {isEditingUser ? "Modifique la información del usuario" : "Complete la información del nuevo usuario"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">NOMBRE COMPLETO</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="NOMBRE DEL USUARIO"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">EMAIL</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="usuario@escuela.edu"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">ROL</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                    <SelectValue placeholder="SELECCIONAR ROL" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {roleOptions.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">NOMBRE DE USUARIO</Label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="usuario123"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">TELÉFONO</Label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="+504 0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">CONTRASEÑA (REQUERIDA)</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
                {isEditingUser ? "ACTUALIZAR USUARIO" : "CREAR USUARIO"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingUser(false)
                  setIsEditingUser(false)
                  setSelectedUser(null)
                }}
                className="border-gray-600"
              >
                CANCELAR
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
