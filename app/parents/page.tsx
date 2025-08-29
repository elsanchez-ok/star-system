"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  CalendarIcon,
  TrendingUp,
  Bell,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Heart,
  BookOpen,
  Award,
  Home,
  Eye,
  Send,
  Plus,
  Map,
  User,
  WheatIcon as WhatsApp,
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
  academicStatus: "excellent" | "good" | "needs_attention" | "critical"
  currentLocation?: string
  currentClass?: string
  nextClass?: string
  classroomCoordinates?: { x: number; y: number }
  classroomColor?: string
}

interface AttendanceRecord {
  id: string
  date: string
  present: boolean
  entryTime?: string
  exitTime?: string
  notes?: string
  location?: string
}

interface Notification {
  id: string
  type: "attendance" | "academic" | "general" | "emergency" | "behavioral"
  title: string
  message: string
  date: string
  read: boolean
  details?: string
  actionRequired?: boolean
}

interface ClassSchedule {
  id: string
  subject: string
  teacher: string
  classroom: string
  startTime: string
  endTime: string
  day: string
  color: string
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "class" | "exam" | "meeting" | "event" | "reminder"
  description: string
  studentId: string
}

// Mock data for parent's children
const mockStudents: Student[] = [
  {
    id: "0501201003127",
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
    academicStatus: "excellent",
    currentLocation: "AULA 10°A",
    currentClass: "MATEMÁTICAS",
    nextClass: "CIENCIAS NATURALES",
    classroomCoordinates: { x: 0, y: 0 },
    classroomColor: "bg-blue-600",
  },
  {
    id: "0501201198765",
    name: "CARLOS GONZÁLEZ LÓPEZ",
    grade: "8°",
    section: "B",
    idNumber: "0501201198765",
    photo: "/student-boy.png",
    parentName: "CARLOS GONZÁLEZ",
    parentPhone: "+504 9876-5432",
    whatsappNumber: "+504 9876-5432",
    address: "COL. KENNEDY, TEGUCIGALPA",
    birthDate: "2010-07-22",
    status: "active",
    attendanceRate: 88,
    academicStatus: "good",
    currentLocation: "AULA 8°B",
    currentClass: "ESPAÑOL",
    nextClass: "EDUCACIÓN FÍSICA",
    classroomCoordinates: { x: 1, y: 1 },
    classroomColor: "bg-green-600",
  },
]

const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    present: true,
    entryTime: "07:45 AM",
    exitTime: "03:30 PM",
    location: "ENTRADA PRINCIPAL",
  },
  {
    id: "2",
    date: "2024-01-14",
    present: true,
    entryTime: "07:50 AM",
    exitTime: "03:30 PM",
    location: "ENTRADA PRINCIPAL",
  },
  {
    id: "3",
    date: "2024-01-13",
    present: false,
    notes: "CITA MÉDICA - JUSTIFICADA",
  },
  {
    id: "4",
    date: "2024-01-12",
    present: true,
    entryTime: "07:40 AM",
    exitTime: "03:30 PM",
    location: "ENTRADA PRINCIPAL",
  },
  {
    id: "5",
    date: "2024-01-11",
    present: true,
    entryTime: "07:45 AM",
    exitTime: "03:30 PM",
    location: "ENTRADA PRINCIPAL",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "attendance",
    title: "ENTRADA REGISTRADA",
    message: "María ha ingresado al plantel a las 07:45 AM",
    date: "2024-01-15 07:45",
    read: false,
    details:
      "Su hija María González López ingresó al plantel educativo el día de hoy a las 07:45 AM a través de la entrada principal. El registro fue realizado mediante el sistema de códigos QR. Ubicación actual: Aula 10°A.",
    actionRequired: false,
  },
  {
    id: "2",
    type: "academic",
    title: "EXCELENTE CALIFICACIÓN",
    message: "María obtuvo 95 puntos en el examen de Matemáticas",
    date: "2024-01-14 14:30",
    read: false,
    details:
      "Su hija María González López obtuvo una calificación sobresaliente de 95 puntos sobre 100 en el examen de Matemáticas del tema 'Funciones Cuadráticas'. Esta calificación la posiciona entre los mejores estudiantes de su grado. La profesora Ana López felicita su dedicación y esfuerzo.",
    actionRequired: false,
  },
  {
    id: "3",
    type: "general",
    title: "REUNIÓN DE PADRES",
    message: "Reunión programada para el viernes 19 de enero a las 2:00 PM",
    date: "2024-01-13 10:00",
    read: true,
    details:
      "Se ha programado una reunión general de padres de familia para el día viernes 19 de enero a las 2:00 PM en el auditorio principal. Se tratarán temas importantes sobre el rendimiento académico del primer período y actividades del segundo período. Su asistencia es muy importante.",
    actionRequired: true,
  },
  {
    id: "4",
    type: "behavioral",
    title: "RECONOCIMIENTO POR LIDERAZGO",
    message: "Carlos fue reconocido por su liderazgo en actividades grupales",
    date: "2024-01-12 11:30",
    read: false,
    details:
      "Su hijo Carlos González López fue reconocido por el profesor de Ciencias Sociales por demostrar excelentes cualidades de liderazgo durante las actividades grupales. Ha sido propuesto para participar en el consejo estudiantil.",
    actionRequired: false,
  },
  {
    id: "5",
    type: "emergency",
    title: "SIMULACRO DE EMERGENCIA",
    message: "Se realizará simulacro de evacuación mañana a las 10:00 AM",
    date: "2024-01-11 16:00",
    read: true,
    details:
      "Estimados padres, mañana miércoles 17 de enero se realizará un simulacro de evacuación a las 10:00 AM como parte del plan de seguridad escolar. Los estudiantes serán instruidos sobre los protocolos de seguridad. El simulacro durará aproximadamente 15 minutos.",
    actionRequired: false,
  },
]

const mockSchedule: ClassSchedule[] = [
  {
    id: "1",
    subject: "MATEMÁTICAS",
    teacher: "PROF. ANA LÓPEZ",
    classroom: "AULA 10°A",
    startTime: "07:30",
    endTime: "08:30",
    day: "LUNES",
    color: "bg-blue-600",
  },
  {
    id: "2",
    subject: "ESPAÑOL",
    teacher: "PROF. MARÍA RODRÍGUEZ",
    classroom: "AULA 10°A",
    startTime: "08:30",
    endTime: "09:30",
    day: "LUNES",
    color: "bg-green-600",
  },
  {
    id: "3",
    subject: "CIENCIAS NATURALES",
    teacher: "PROF. CARLOS MENDOZA",
    classroom: "LABORATORIO",
    startTime: "09:45",
    endTime: "10:45",
    day: "LUNES",
    color: "bg-purple-600",
  },
  {
    id: "4",
    subject: "HISTORIA",
    teacher: "PROF. LUIS GARCÍA",
    classroom: "AULA 10°A",
    startTime: "10:45",
    endTime: "11:45",
    day: "LUNES",
    color: "bg-orange-600",
  },
  {
    id: "5",
    subject: "EDUCACIÓN FÍSICA",
    teacher: "PROF. SANDRA TORRES",
    classroom: "GIMNASIO",
    startTime: "13:00",
    endTime: "14:00",
    day: "LUNES",
    color: "bg-red-600",
  },
]

const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "EXAMEN DE MATEMÁTICAS",
    date: new Date(2024, 0, 18),
    type: "exam",
    description: "Examen del tema: Funciones Cuadráticas",
    studentId: "0501201003127",
  },
  {
    id: "2",
    title: "REUNIÓN DE PADRES",
    date: new Date(2024, 0, 19),
    type: "meeting",
    description: "Reunión general de padres - Auditorio Principal",
    studentId: "0501201003127",
  },
  {
    id: "3",
    title: "PROYECTO DE CIENCIAS",
    date: new Date(2024, 0, 22),
    type: "event",
    description: "Entrega del proyecto de ciencias naturales",
    studentId: "0501201003127",
  },
]

export default function ParentPortal() {
  const [students] = useState<Student[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student>(mockStudents[0])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [schedule] = useState<ClassSchedule[]>(mockSchedule)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarEvents)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showNotificationDetails, setShowNotificationDetails] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "reminder" as const,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Simulate real-time attendance updates
      if (Math.random() > 0.95) {
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          present: true,
          entryTime: new Date().toLocaleTimeString("es-HN", { hour12: true }),
          location: "ENTRADA PRINCIPAL",
        }
        setAttendance((prev) => [newRecord, ...prev.slice(0, 9)])
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const todayAttendance = attendance.find((record) => record.date === new Date().toISOString().split("T")[0])
  const unreadNotifications = notifications.filter((n) => !n.read).length

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const openNotificationDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setShowNotificationDetails(true)
    markNotificationAsRead(notification.id)
  }

  const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const addCalendarEvent = () => {
    if (newEvent.title && selectedDate) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: selectedDate,
        type: newEvent.type,
        description: newEvent.description,
        studentId: selectedStudent.id,
      }
      setCalendarEvents([...calendarEvents, event])
      setNewEvent({
        title: "",
        description: "",
        type: "reminder",
      })
    }
  }

  const getCurrentClass = () => {
    const now = new Date()
    const currentTime = now.getHours() * 100 + now.getMinutes()
    const currentDay = now.toLocaleDateString("es-HN", { weekday: "long" }).toUpperCase()

    return schedule.find((cls) => {
      const startTime = Number.parseInt(cls.startTime.replace(":", ""))
      const endTime = Number.parseInt(cls.endTime.replace(":", ""))
      return cls.day === currentDay && currentTime >= startTime && currentTime <= endTime
    })
  }

  const getNextClass = () => {
    const now = new Date()
    const currentTime = now.getHours() * 100 + now.getMinutes()
    const currentDay = now.toLocaleDateString("es-HN", { weekday: "long" }).toUpperCase()

    return schedule.find((cls) => {
      const startTime = Number.parseInt(cls.startTime.replace(":", ""))
      return cls.day === currentDay && currentTime < startTime
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-600"
      case "good":
        return "bg-blue-600"
      case "needs_attention":
        return "bg-yellow-600"
      case "critical":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "EXCELENTE"
      case "good":
        return "BUENO"
      case "needs_attention":
        return "REQUIERE ATENCIÓN"
      case "critical":
        return "CRÍTICO"
      default:
        return "SIN EVALUAR"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <Clock className="h-4 w-4" />
      case "academic":
        return <BookOpen className="h-4 w-4" />
      case "emergency":
        return <AlertCircle className="h-4 w-4" />
      case "behavioral":
        return <Heart className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "attendance":
        return "text-blue-400"
      case "academic":
        return "text-green-400"
      case "emergency":
        return "text-red-400"
      case "behavioral":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  const currentClass = getCurrentClass()
  const nextClass = getNextClass()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Enhanced Header */}
      <header className="glass-dark border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">PORTAL DE PADRES</h1>
              <p className="text-sm text-gray-300">
                {currentTime.toLocaleDateString("es-HN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" - "}
                {currentTime.toLocaleTimeString("es-HN", { hour12: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {students.length > 1 && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedStudent.id}
                  onChange={(e) => setSelectedStudent(students.find((s) => s.id === e.target.value) || students[0])}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name.split(" ")[0]} - {student.grade}
                      {student.section}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-gray-300">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-600 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </div>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              PADRE/MADRE
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              SALIR
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Student Info Card */}
        <Card className="glass border-gray-600 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedStudent.photo || "/placeholder.svg"} alt={selectedStudent.name} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedStudent.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">GRADO</p>
                        <p className="text-white font-semibold">
                          {selectedStudent.grade} - {selectedStudent.section}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">ID ESTUDIANTE</p>
                        <p className="text-white font-semibold">{selectedStudent.idNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ASISTENCIA</p>
                        <p className="text-white font-semibold">{selectedStudent.attendanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">UBICACIÓN ACTUAL</p>
                        <p className="text-white font-semibold">{selectedStudent.currentLocation || "NO DISPONIBLE"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-600">
                        <div className="p-2 bg-green-600 rounded-full">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-green-400 font-semibold text-sm">CLASE ACTUAL</p>
                          <p className="text-white text-sm">{currentClass ? currentClass.subject : "DESCANSO"}</p>
                          <p className="text-gray-400 text-xs">
                            {currentClass ? `${currentClass.startTime} - ${currentClass.endTime}` : "Sin clase"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-600">
                        <div className="p-2 bg-blue-600 rounded-full">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-400 font-semibold text-sm">PRÓXIMA CLASE</p>
                          <p className="text-white text-sm">{nextClass ? nextClass.subject : "FIN DE JORNADA"}</p>
                          <p className="text-gray-400 text-xs">
                            {nextClass ? `${nextClass.startTime} - ${nextClass.endTime}` : "No hay más clases"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedStudent.academicStatus)}>
                    {getStatusText(selectedStudent.academicStatus)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ESTADO HOY</CardTitle>
              {todayAttendance?.present ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{todayAttendance?.present ? "PRESENTE" : "AUSENTE"}</div>
              <p className="text-xs text-gray-400">
                {todayAttendance?.entryTime ? `Entrada: ${todayAttendance.entryTime}` : "Sin registro"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ASISTENCIA MENSUAL</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{selectedStudent.attendanceRate}%</div>
              <Progress value={selectedStudent.attendanceRate} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">NOTIFICACIONES</CardTitle>
              <Bell className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{unreadNotifications}</div>
              <p className="text-xs text-gray-400">Sin leer</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">RENDIMIENTO</CardTitle>
              <Award className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">A+</div>
              <p className="text-xs text-gray-400">Promedio general</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">UBICACIÓN</CardTitle>
              <MapPin className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">
                {selectedStudent.currentLocation?.split(" ")[1] || "N/A"}
              </div>
              <p className="text-xs text-gray-400">Aula actual</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border border-gray-600">
            <TabsTrigger value="attendance" className="data-[state=active]:bg-blue-600">
              <Clock className="h-4 w-4 mr-2" />
              ASISTENCIA
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              <Bell className="h-4 w-4 mr-2" />
              NOTIFICACIONES
              {unreadNotifications > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 bg-red-600 text-xs">{unreadNotifications}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              HORARIOS
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-blue-600">
              <Map className="h-4 w-4 mr-2" />
              UBICACIÓN
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-blue-600">
              <BookOpen className="h-4 w-4 mr-2" />
              ACADÉMICO
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-600">
              <Phone className="h-4 w-4 mr-2" />
              CONTACTO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">CALENDARIO DE ASISTENCIA</CardTitle>
                  <CardDescription className="text-gray-300">
                    Seleccione una fecha para ver los detalles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-gray-600 bg-gray-800"
                    locale={es}
                  />
                  {selectedDate && (
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">{format(selectedDate, "PPP", { locale: es })}</h4>
                        {calendarEvents
                          .filter((event) => event.date.toDateString() === selectedDate.toDateString())
                          .map((event) => (
                            <div key={event.id} className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                              <span>{event.title}</span>
                            </div>
                          ))}
                        <div className="mt-3 space-y-2">
                          <Input
                            placeholder="AGREGAR RECORDATORIO..."
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white text-sm"
                          />
                          <div className="flex gap-2">
                            <Button onClick={addCalendarEvent} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Plus className="h-3 w-3 mr-1" />
                              AGREGAR
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">HISTORIAL RECIENTE</CardTitle>
                  <CardDescription className="text-gray-300">
                    Últimos registros de asistencia (actualización automática)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendance.slice(0, 5).map((record, index) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {record.present ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {new Date(record.date).toLocaleDateString("es-HN", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {record.present ? (
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Entrada: {record.entryTime} {record.exitTime && `- Salida: ${record.exitTime}`}
                                </p>
                                {record.location && <p className="text-blue-400 text-xs">{record.location}</p>}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">{record.notes || "AUSENTE"}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant={record.present ? "default" : "secondary"}>
                          {record.present ? "PRESENTE" : "AUSENTE"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Today's Details */}
            {todayAttendance && (
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">DETALLES DE HOY</CardTitle>
                  <CardDescription className="text-gray-300">
                    Registro de entrada y salida en tiempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-green-900/20 rounded-lg border border-green-600">
                      <div className="p-3 bg-green-600 rounded-full">
                        <Home className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">ENTRADA</h4>
                        <p className="text-green-400 text-lg font-bold">
                          {todayAttendance.entryTime || "NO REGISTRADA"}
                        </p>
                        <p className="text-gray-400 text-sm">{todayAttendance.location || "Entrada principal"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-lg border border-blue-600">
                      <div className="p-3 bg-blue-600 rounded-full">
                        <LogOut className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">SALIDA</h4>
                        <p className="text-blue-400 text-lg font-bold">
                          {todayAttendance.exitTime || "AÚN EN EL PLANTEL"}
                        </p>
                        <p className="text-gray-400 text-sm">Salida programada: 3:30 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">NOTIFICACIONES</CardTitle>
                <CardDescription className="text-gray-300">
                  Manténgase informado sobre las actividades de su hijo/a
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        notification.read
                          ? "bg-gray-800 border-gray-600"
                          : "bg-blue-900/20 border-blue-600 hover:bg-blue-900/30"
                      }`}
                      onClick={() => openNotificationDetails(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gray-700 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{notification.title}</h4>
                              <p className="text-gray-300 mt-1">{notification.message}</p>
                              <p className="text-gray-400 text-sm mt-2">
                                {new Date(notification.date).toLocaleString("es-HN")}
                              </p>
                              {notification.actionRequired && (
                                <Badge className="mt-2 bg-yellow-600">ACCIÓN REQUERIDA</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0 mt-1" />
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 bg-transparent"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                VER
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">HORARIO DE CLASES</CardTitle>
                  <CardDescription className="text-gray-300">Horario semanal de {selectedStudent.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.map((cls) => (
                      <div
                        key={cls.id}
                        className={`p-3 rounded-lg border ${
                          currentClass?.id === cls.id
                            ? "bg-green-900/20 border-green-600"
                            : "bg-gray-800 border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${cls.color}`} />
                            <div>
                              <h4 className="text-white font-semibold">{cls.subject}</h4>
                              <p className="text-gray-400 text-sm">{cls.teacher}</p>
                              <p className="text-blue-400 text-xs">{cls.classroom}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">
                              {cls.startTime} - {cls.endTime}
                            </p>
                            <p className="text-gray-400 text-sm">{cls.day}</p>
                            {currentClass?.id === cls.id && <Badge className="mt-1 bg-green-600">EN CURSO</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">PRÓXIMOS EVENTOS</CardTitle>
                  <CardDescription className="text-gray-300">Exámenes, tareas y actividades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calendarEvents
                      .filter((event) => event.studentId === selectedStudent.id)
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .slice(0, 5)
                      .map((event) => (
                        <div key={event.id} className="p-3 bg-gray-800 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{event.title}</h4>
                              <p className="text-gray-400 text-sm">{event.description}</p>
                              <p className="text-blue-400 text-xs mt-1">{format(event.date, "PPP", { locale: es })}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                event.type === "exam"
                                  ? "border-red-400 text-red-300"
                                  : event.type === "meeting"
                                    ? "border-blue-400 text-blue-300"
                                    : "border-green-400 text-green-300"
                              }
                            >
                              {event.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {students.map((student) => (
                <Card key={student.id} className="glass border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">
                      UBICACIÓN DE {student.name.split(" ")[0]} - {student.grade}
                      {student.section}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Mapa del aula y ubicación actual en tiempo real
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-800 rounded-lg p-6 min-h-64 relative">
                      {/* Individual classroom map */}
                      <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full min-h-48">
                        <div
                          className={`${student.classroomColor || "bg-blue-600"} rounded-lg p-4 text-center relative overflow-hidden ${
                            student.id === selectedStudent.id ? "ring-2 ring-yellow-400" : ""
                          }`}
                          style={{
                            gridColumn: (student.classroomCoordinates?.x || 0) + 1,
                            gridRow: (student.classroomCoordinates?.y || 0) + 1,
                          }}
                        >
                          <h4 className="text-white font-semibold mb-2 text-sm">{student.currentLocation}</h4>
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div className="text-xs text-white">
                                <p className="font-semibold">{student.name.split(" ")[0]}</p>
                                <p className="opacity-75">{student.currentClass || "DESCANSO"}</p>
                              </div>
                            </div>
                            <div className="text-xs text-white opacity-75 mt-2">
                              <p>Estado: {student.status === "active" ? "PRESENTE" : "AUSENTE"}</p>
                              <p>Asistencia: {student.attendanceRate}%</p>
                            </div>
                          </div>

                          {/* Real-time indicator */}
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          </div>
                        </div>

                        {/* Other classrooms (dimmed) */}
                        <div className="bg-gray-600 rounded-lg p-2 text-center opacity-50">
                          <p className="text-white text-xs">OTRAS AULAS</p>
                        </div>
                        <div className="bg-gray-600 rounded-lg p-2 text-center opacity-50">
                          <p className="text-white text-xs">LABORATORIO</p>
                        </div>
                        <div className="bg-gray-600 rounded-lg p-2 text-center opacity-50">
                          <p className="text-white text-xs">BIBLIOTECA</p>
                        </div>
                        <div className="bg-gray-600 rounded-lg p-2 text-center opacity-50">
                          <p className="text-white text-xs">GIMNASIO</p>
                        </div>
                        <div className="bg-gray-600 rounded-lg p-2 text-center opacity-50">
                          <p className="text-white text-xs">CAFETERÍA</p>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="absolute bottom-4 right-4 bg-gray-900/90 p-3 rounded-lg backdrop-blur">
                        <h5 className="text-white font-semibold mb-2 text-sm">LEYENDA</h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-gray-300">EN TIEMPO REAL</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                            <span className="text-gray-300">ESTUDIANTE SELECCIONADO</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{student.attendanceRate}%</div>
                        <p className="text-gray-400 text-xs">ASISTENCIA</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {student.status === "active" ? "PRESENTE" : "AUSENTE"}
                        </div>
                        <p className="text-gray-400 text-xs">ESTADO ACTUAL</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {student.currentLocation?.split(" ")[1] || "N/A"}
                        </div>
                        <p className="text-gray-400 text-xs">AULA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    RENDIMIENTO ACADÉMICO
                  </CardTitle>
                  <CardDescription className="text-gray-300">Calificaciones y progreso</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">MATEMÁTICAS</p>
                        <p className="text-gray-400 text-sm">Último examen</p>
                      </div>
                      <Badge className="bg-green-600">95</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">ESPAÑOL</p>
                        <p className="text-gray-400 text-sm">Último examen</p>
                      </div>
                      <Badge className="bg-green-600">92</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">CIENCIAS</p>
                        <p className="text-gray-400 text-sm">Último examen</p>
                      </div>
                      <Badge className="bg-blue-600">88</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">HISTORIA</p>
                        <p className="text-gray-400 text-sm">Último examen</p>
                      </div>
                      <Badge className="bg-green-600">94</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    COMPORTAMIENTO
                  </CardTitle>
                  <CardDescription className="text-gray-300">Notas de conducta y participación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-600">
                      <p className="text-green-400 font-semibold mb-2">EXCELENTE PARTICIPACIÓN</p>
                      <p className="text-gray-300 text-sm">
                        {selectedStudent.name.split(" ")[0]} ha demostrado excelente participación en clase y
                        colaboración con sus compañeros.
                      </p>
                      <p className="text-gray-400 text-xs mt-2">Prof. Ana López - Matemáticas</p>
                    </div>
                    <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-600">
                      <p className="text-blue-400 font-semibold mb-2">LIDERAZGO POSITIVO</p>
                      <p className="text-gray-300 text-sm">
                        Demuestra cualidades de liderazgo y ayuda a sus compañeros en las actividades grupales.
                      </p>
                      <p className="text-gray-400 text-xs mt-2">Prof. Carlos Mendoza - Historia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">INFORMACIÓN DE CONTACTO</CardTitle>
                  <CardDescription className="text-gray-300">Datos actualizados del estudiante</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">TELÉFONO</p>
                      <p className="text-white font-medium">{selectedStudent.parentPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Mail className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-sm">CORREO ELECTRÓNICO</p>
                      <p className="text-white font-medium">carlos.gonzalez@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-gray-400 text-sm">DIRECCIÓN</p>
                      <p className="text-white font-medium">{selectedStudent.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">CONTACTAR ESCUELA</CardTitle>
                  <CardDescription className="text-gray-300">Comunicación directa con el personal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="ESCRIBIR MENSAJE A LA CONSEJERÍA..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        if (newMessage.trim()) {
                          alert("Mensaje enviado a consejería")
                          setNewMessage("")
                        }
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      ENVIAR MENSAJE
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                    onClick={() =>
                      sendWhatsAppMessage(
                        selectedStudent.whatsappNumber,
                        `Hola, soy ${selectedStudent.parentName}, padre/madre de ${selectedStudent.name}. Me gustaría programar una reunión.`,
                      )
                    }
                  >
                    <WhatsApp className="h-4 w-4 mr-2" />
                    WHATSAPP CONSEJERÍA
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    LLAMAR A LA ESCUELA
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 bg-transparent">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    SOLICITAR CITA
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    JUSTIFICAR AUSENCIA
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showNotificationDetails} onOpenChange={setShowNotificationDetails}>
        <DialogContent className="glass border-gray-600 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {selectedNotification && format(new Date(selectedNotification.date), "PPPp", { locale: es })}
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-300">{selectedNotification.details}</p>
              </div>
              {selectedNotification.actionRequired && (
                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-600">
                  <p className="text-yellow-400 font-semibold mb-2">ACCIÓN REQUERIDA</p>
                  <p className="text-gray-300 text-sm">
                    Esta notificación requiere su atención o respuesta. Por favor, contacte a la escuela si es
                    necesario.
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setShowNotificationDetails(false)} className="bg-blue-600 hover:bg-blue-700">
                  ENTENDIDO
                </Button>
                {selectedNotification.actionRequired && (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                    onClick={() =>
                      sendWhatsAppMessage(
                        selectedStudent.whatsappNumber,
                        `Hola, recibí la notificación: "${selectedNotification.title}". Me gustaría más información.`,
                      )
                    }
                  >
                    <WhatsApp className="h-4 w-4 mr-2" />
                    CONTACTAR VÍA WHATSAPP
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
