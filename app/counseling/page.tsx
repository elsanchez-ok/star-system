"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  UserCheck,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  CalendarIcon,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Eye,
  MessageSquare,
  FileText,
  Heart,
  Brain,
  Phone,
  MapPin,
  Filter,
  Plus,
  MessageCircle,
  Bell,
  WheatIcon as WhatsApp,
  Map,
  Target,
  Activity,
  Send,
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
  todayPresent: boolean
  lastEntry?: string
  behaviorNotes?: string
  academicStatus: "excellent" | "good" | "needs_attention" | "critical"
  currentLocation?: string
  emergencyContact?: string
  medicalNotes?: string
  counselingHistory: CounselingSession[]
}

interface CounselingSession {
  id: string
  date: string
  type: "academic" | "behavioral" | "personal" | "family"
  notes: string
  followUp: boolean
  counselor: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  type: "counseling" | "general"
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "meeting" | "session" | "reminder" | "parent_conference"
  description: string
  studentId?: string
}

interface ClassroomData {
  id: string
  name: string
  grade: string
  section: string
  capacity: number
  currentOccupancy: number
  students: Student[]
  teacher: string
  subject?: string
  coordinates: { x: number; y: number }
  color: string
}

const mockClassrooms: ClassroomData[] = [
  {
    id: "aula_10a",
    name: "AULA 10°A",
    grade: "10°",
    section: "A",
    capacity: 35,
    currentOccupancy: 28,
    students: [],
    teacher: "PROF. MARÍA LÓPEZ",
    subject: "MATEMÁTICAS",
    coordinates: { x: 0, y: 0 },
    color: "bg-blue-600",
  },
  {
    id: "aula_11b",
    name: "AULA 11°B",
    grade: "11°",
    section: "B",
    capacity: 35,
    currentOccupancy: 30,
    students: [],
    teacher: "PROF. CARLOS RIVERA",
    subject: "CIENCIAS",
    coordinates: { x: 1, y: 0 },
    color: "bg-green-600",
  },
  {
    id: "aula_9a",
    name: "AULA 9°A",
    grade: "9°",
    section: "A",
    capacity: 35,
    currentOccupancy: 25,
    students: [],
    teacher: "PROF. ANA GARCÍA",
    subject: "ESPAÑOL",
    coordinates: { x: 2, y: 0 },
    color: "bg-purple-600",
  },
  {
    id: "laboratorio",
    name: "LABORATORIO",
    grade: "MULTI",
    section: "LAB",
    capacity: 25,
    currentOccupancy: 15,
    students: [],
    teacher: "PROF. LUIS MENDOZA",
    subject: "QUÍMICA",
    coordinates: { x: 0, y: 1 },
    color: "bg-orange-600",
  },
  {
    id: "biblioteca",
    name: "BIBLIOTECA",
    grade: "MULTI",
    section: "BIB",
    capacity: 50,
    currentOccupancy: 12,
    students: [],
    teacher: "BIBLIOTECARIA",
    coordinates: { x: 1, y: 1 },
    color: "bg-yellow-600",
  },
  {
    id: "consejeria",
    name: "CONSEJERÍA",
    grade: "ADMIN",
    section: "CNS",
    capacity: 10,
    currentOccupancy: 3,
    students: [],
    teacher: "CONSEJERO/A",
    coordinates: { x: 2, y: 1 },
    color: "bg-red-600",
  },
]

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
    todayPresent: true,
    lastEntry: "07:45 AM",
    behaviorNotes: "ESTUDIANTE EJEMPLAR, PARTICIPATIVA EN CLASE",
    academicStatus: "excellent",
    currentLocation: "AULA 10°A",
    emergencyContact: "+504 9876-5432",
    medicalNotes: "NINGUNA CONDICIÓN MÉDICA ESPECIAL",
    counselingHistory: [
      {
        id: "1",
        date: "2024-01-10",
        type: "academic",
        notes: "Excelente rendimiento académico, se recomienda participar en olimpiadas de matemáticas",
        followUp: false,
        counselor: "CONSEJERA PRINCIPAL",
      },
    ],
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
    todayPresent: false,
    behaviorNotes: "NECESITA APOYO EN MATEMÁTICAS, MUESTRA INTERÉS EN CIENCIAS",
    academicStatus: "needs_attention",
    currentLocation: "AUSENTE",
    emergencyContact: "+504 8765-4321",
    medicalNotes: "LEVE DIFICULTAD DE CONCENTRACIÓN",
    counselingHistory: [
      {
        id: "2",
        date: "2024-01-08",
        type: "academic",
        notes: "Dificultades en matemáticas, se recomienda tutoría adicional",
        followUp: true,
        counselor: "CONSEJERA PRINCIPAL",
      },
      {
        id: "3",
        date: "2024-01-05",
        type: "behavioral",
        notes: "Conversación sobre técnicas de estudio y manejo del tiempo",
        followUp: false,
        counselor: "CONSEJERA PRINCIPAL",
      },
    ],
  },
  {
    id: "3",
    name: "ANA SOFÍA HERNÁNDEZ",
    grade: "9°",
    section: "A",
    idNumber: "0501201098765",
    photo: "/placeholder-cw0bg.png",
    parentName: "LUIS HERNÁNDEZ",
    parentPhone: "+504 3456-7890",
    whatsappNumber: "+504 3456-7890",
    address: "COL. PALMIRA, TEGUCIGALPA",
    birthDate: "2009-01-10",
    status: "active",
    attendanceRate: 92,
    todayPresent: true,
    lastEntry: "07:30 AM",
    behaviorNotes: "EXCELENTE RENDIMIENTO ACADÉMICO, LÍDER NATURAL",
    academicStatus: "excellent",
    currentLocation: "AULA 9°A",
    emergencyContact: "+504 3456-7890",
    medicalNotes: "NINGUNA CONDICIÓN MÉDICA ESPECIAL",
    counselingHistory: [
      {
        id: "4",
        date: "2024-01-12",
        type: "personal",
        notes: "Conversación sobre liderazgo estudiantil y oportunidades de crecimiento",
        followUp: false,
        counselor: "CONSEJERA PRINCIPAL",
      },
    ],
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

export default function CounselingDashboard() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [classrooms] = useState<ClassroomData[]>(mockClassrooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "present" | "absent">("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [sectionFilter, setSectionFilter] = useState<string>("all")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNewSession, setShowNewSession] = useState(false)
  const [newSessionData, setNewSessionData] = useState({
    studentId: "",
    type: "academic" as const,
    notes: "",
    followUp: false,
  })
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeChat, setActiveChat] = useState<"counseling" | "general">("counseling")
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showCalendar, setShowCalendar] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "meeting" as const,
    studentId: "",
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.idNumber.includes(searchTerm) ||
      student.grade.includes(searchTerm)

    const matchesAttendance =
      attendanceFilter === "all" ||
      (attendanceFilter === "present" && student.todayPresent) ||
      (attendanceFilter === "absent" && !student.todayPresent)

    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
    const matchesSection = sectionFilter === "all" || student.section === sectionFilter

    return matchesSearch && matchesAttendance && matchesGrade && matchesSection
  })

  const totalStudents = students.length
  const presentToday = students.filter((s) => s.todayPresent).length
  const absentToday = totalStudents - presentToday
  const attendancePercentage = ((presentToday / totalStudents) * 100).toFixed(1)
  const criticalCases = students.filter(
    (s) => s.academicStatus === "critical" || s.academicStatus === "needs_attention",
  ).length

  const toggleAttendance = (studentId: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              todayPresent: !student.todayPresent,
              lastEntry: !student.todayPresent ? currentTime.toLocaleTimeString("es-HN", { hour12: true }) : undefined,
              currentLocation: !student.todayPresent ? `AULA ${student.grade}${student.section}` : "AUSENTE",
            }
          : student,
      ),
    )
  }

  const addCounselingSession = () => {
    if (newSessionData.studentId && newSessionData.notes) {
      const session: CounselingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        type: newSessionData.type,
        notes: newSessionData.notes,
        followUp: newSessionData.followUp,
        counselor: "CONSEJERA PRINCIPAL",
      }

      setStudents(
        students.map((student) =>
          student.id === newSessionData.studentId
            ? { ...student, counselingHistory: [session, ...student.counselingHistory] }
            : student,
        ),
      )

      setNewSessionData({
        studentId: "",
        type: "academic",
        notes: "",
        followUp: false,
      })
      setShowNewSession(false)
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
        sender: "CONSEJERA PRINCIPAL",
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
        studentId: newEvent.studentId || undefined,
      }
      setCalendarEvents([...calendarEvents, event])
      setNewEvent({
        title: "",
        description: "",
        type: "meeting",
        studentId: "",
      })
      setShowCalendar(false)
    }
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

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-blue-600"
      case "behavioral":
        return "bg-yellow-600"
      case "personal":
        return "bg-green-600"
      case "family":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getSessionTypeText = (type: string) => {
    switch (type) {
      case "academic":
        return "ACADÉMICO"
      case "behavioral":
        return "CONDUCTUAL"
      case "personal":
        return "PERSONAL"
      case "family":
        return "FAMILIAR"
      default:
        return "GENERAL"
    }
  }

  const getClassroomOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100
    if (percentage >= 90) return "text-red-400"
    if (percentage >= 70) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Enhanced Header */}
      <header className="glass-dark border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">PANEL DE CONSEJERÍA ESTUDIANTIL</h1>
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
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-yellow-400" />
              <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                {criticalCases} CASOS CRÍTICOS
              </Badge>
            </div>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              CONSEJERO/A
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              SALIR
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">TOTAL ESTUDIANTES</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalStudents}</div>
              <p className="text-xs text-gray-400">Bajo supervisión</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">PRESENTES HOY</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{presentToday}</div>
              <p className="text-xs text-gray-400">{attendancePercentage}% de asistencia</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">AUSENTES HOY</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{absentToday}</div>
              <p className="text-xs text-gray-400">Requieren seguimiento</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">CASOS CRÍTICOS</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{criticalCases}</div>
              <p className="text-xs text-gray-400">Necesitan atención</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">SESIONES HOY</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {students.reduce(
                  (acc, s) =>
                    acc + s.counselingHistory.filter((h) => h.date === new Date().toISOString().split("T")[0]).length,
                  0,
                )}
              </div>
              <p className="text-xs text-gray-400">Consejería realizada</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border border-gray-600">
            <TabsTrigger value="attendance" className="data-[state=active]:bg-blue-600">
              <Clock className="h-4 w-4 mr-2" />
              ASISTENCIAS
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-blue-600">
              <Users className="h-4 w-4 mr-2" />
              ESTUDIANTES
            </TabsTrigger>
            <TabsTrigger value="counseling" className="data-[state=active]:bg-blue-600">
              <Heart className="h-4 w-4 mr-2" />
              CONSEJERÍA
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-blue-600">
              <Map className="h-4 w-4 mr-2" />
              MAPA
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              CALENDARIO
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              CHAT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            {/* Enhanced Attendance Controls */}
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
                <Button
                  onClick={() =>
                    sendWhatsAppMessage("+50400000000", "Reporte de asistencia diario generado automáticamente.")
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  <WhatsApp className="h-4 w-4 mr-2" />
                  NOTIFICAR PADRES
                </Button>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={attendanceFilter} onValueChange={(value: any) => setAttendanceFilter(value)}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">TODOS</SelectItem>
                      <SelectItem value="present">PRESENTES</SelectItem>
                      <SelectItem value="absent">AUSENTES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
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
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
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

            {/* Enhanced Attendance List */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="glass border-gray-600 hover:bg-gray-800/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{student.name}</h3>
                          <p className="text-sm text-gray-400">
                            {student.grade} - {student.section} | ID: {student.idNumber}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-300">
                              {student.currentLocation || "UBICACIÓN DESCONOCIDA"}
                            </span>
                          </div>
                          {student.lastEntry && (
                            <p className="text-xs text-green-400">Última entrada: {student.lastEntry}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Asistencia</div>
                          <div className="text-lg font-bold text-white">{student.attendanceRate}%</div>
                        </div>
                        <Badge className={getStatusColor(student.academicStatus)}>
                          {getStatusText(student.academicStatus)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`attendance-${student.id}`} className="text-white text-sm">
                            {student.todayPresent ? "PRESENTE" : "AUSENTE"}
                          </Label>
                          <Switch
                            id={`attendance-${student.id}`}
                            checked={student.todayPresent}
                            onCheckedChange={() => toggleAttendance(student.id)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                            className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            VER PERFIL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              sendWhatsAppMessage(
                                student.whatsappNumber,
                                `Hola ${student.parentName}, su hijo/a ${student.name} ${student.todayPresent ? "está presente" : "no se ha presentado"} hoy en clases.`,
                              )
                            }
                            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                          >
                            <WhatsApp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Enhanced Student Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="glass border-gray-600 hover:neon-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
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
                        <div>
                          <h3 className="font-semibold text-white text-sm">{student.name}</h3>
                          <p className="text-xs text-gray-400">
                            {student.grade} - {student.section}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(student.academicStatus)} variant="secondary">
                        {getStatusText(student.academicStatus)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">Asistencia: {student.attendanceRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">{student.parentPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">{student.currentLocation || "UBICACIÓN DESCONOCIDA"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300">{student.counselingHistory.length} sesiones</span>
                      </div>
                      {student.behaviorNotes && (
                        <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                          {student.behaviorNotes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        VER PERFIL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent"
                        onClick={() => {
                          setNewSessionData({ ...newSessionData, studentId: student.id })
                          setShowNewSession(true)
                        }}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                        onClick={() =>
                          sendWhatsAppMessage(
                            student.whatsappNumber,
                            `Hola ${student.parentName}, me gustaría programar una reunión para hablar sobre el progreso de ${student.name}.`,
                          )
                        }
                      >
                        <WhatsApp className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="counseling" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">GESTIÓN DE CONSEJERÍA</h2>
              <Button onClick={() => setShowNewSession(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                NUEVA SESIÓN
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    SEGUIMIENTO ACADÉMICO
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Estudiantes que requieren atención especial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students
                      .filter((s) => s.academicStatus === "needs_attention" || s.academicStatus === "critical")
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.name} />
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white text-sm font-medium">{student.name}</p>
                              <p className="text-gray-400 text-xs">
                                {student.grade} - {student.section} • {student.counselingHistory.length} sesiones
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(student.academicStatus)} variant="secondary">
                              {getStatusText(student.academicStatus)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setNewSessionData({ ...newSessionData, studentId: student.id })
                                setShowNewSession(true)
                              }}
                              className="border-gray-600 text-gray-300 bg-transparent"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    HERRAMIENTAS DE CONSEJERÍA
                  </CardTitle>
                  <CardDescription className="text-gray-300">Recursos y acciones rápidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                      onClick={() => setShowNewSession(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      NUEVA SESIÓN DE CONSEJERÍA
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      REGISTRO DE INCIDENTES
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      CONTACTAR PADRES
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      PLAN DE MEJORA
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      SEGUIMIENTO SEMANAL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Counseling Sessions */}
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">SESIONES RECIENTES</CardTitle>
                <CardDescription className="text-gray-300">Historial de consejería estudiantil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students
                    .flatMap((student) =>
                      student.counselingHistory.map((session) => ({
                        ...session,
                        studentName: student.name,
                        studentPhoto: student.photo,
                        studentGrade: student.grade,
                        studentSection: student.section,
                      })),
                    )
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((session) => (
                      <div key={session.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.studentPhoto || "/placeholder.svg"} alt={session.studentName} />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {session.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white text-sm font-medium">{session.studentName}</p>
                            <Badge className={getSessionTypeColor(session.type)} variant="secondary">
                              {getSessionTypeText(session.type)}
                            </Badge>
                            {session.followUp && (
                              <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                                SEGUIMIENTO
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mb-2">
                            {session.studentGrade} - {session.studentSection} •{" "}
                            {format(new Date(session.date), "PPP", { locale: es })}
                          </p>
                          <p className="text-gray-300 text-sm">{session.notes}</p>
                          <p className="text-gray-500 text-xs mt-1">Por: {session.counselor}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">MAPA DE AULAS Y UBICACIONES</CardTitle>
                <CardDescription className="text-gray-300">
                  Distribución de estudiantes por aula en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-6 min-h-96 relative">
                  {/* Enhanced classroom map grid */}
                  <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full min-h-80">
                    {classrooms.map((classroom) => (
                      <div
                        key={classroom.id}
                        className={`${classroom.color} rounded-lg p-4 text-center relative overflow-hidden hover:scale-105 transition-transform cursor-pointer`}
                        style={{
                          gridColumn: classroom.coordinates.x + 1,
                          gridRow: classroom.coordinates.y + 1,
                        }}
                      >
                        <h4 className="text-white font-semibold mb-2 text-sm">{classroom.name}</h4>
                        <div className="space-y-1">
                          <div className="text-xs text-white opacity-90">
                            <span
                              className={getClassroomOccupancyColor(classroom.currentOccupancy, classroom.capacity)}
                            >
                              {classroom.currentOccupancy}/{classroom.capacity}
                            </span>
                          </div>
                          <Progress
                            value={(classroom.currentOccupancy / classroom.capacity) * 100}
                            className="h-1 bg-white/20"
                          />
                          <div className="text-xs text-white opacity-75 mt-2">
                            <p>{classroom.teacher}</p>
                            {classroom.subject && <p>{classroom.subject}</p>}
                          </div>

                          {/* Show students in this classroom */}
                          <div className="space-y-1 mt-2">
                            {students
                              .filter((s) => s.currentLocation === classroom.name && s.todayPresent)
                              .slice(0, 3)
                              .map((student) => (
                                <div key={student.id} className="flex items-center gap-1 text-xs text-white">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                  <span className="truncate">{student.name.split(" ")[0]}</span>
                                </div>
                              ))}
                            {students.filter((s) => s.currentLocation === classroom.name && s.todayPresent).length >
                              3 && (
                              <div className="text-xs text-white opacity-75">
                                +
                                {students.filter((s) => s.currentLocation === classroom.name && s.todayPresent).length -
                                  3}{" "}
                                más
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Occupancy indicator */}
                        <div className="absolute top-2 right-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              classroom.currentOccupancy === 0
                                ? "bg-gray-400"
                                : classroom.currentOccupancy / classroom.capacity >= 0.9
                                  ? "bg-red-400"
                                  : classroom.currentOccupancy / classroom.capacity >= 0.7
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Legend */}
                  <div className="absolute bottom-4 right-4 bg-gray-900/90 p-4 rounded-lg backdrop-blur">
                    <h5 className="text-white font-semibold mb-3">LEYENDA</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-gray-300">ESTUDIANTE PRESENTE</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full" />
                          <span className="text-gray-300">OCUPACIÓN ALTA (90%+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                          <span className="text-gray-300">OCUPACIÓN MEDIA (70%+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full" />
                          <span className="text-gray-300">OCUPACIÓN BAJA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{presentToday}</div>
                    <p className="text-gray-400 text-sm">ESTUDIANTES PRESENTES</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {classrooms.filter((c) => c.currentOccupancy > 0).length}
                    </div>
                    <p className="text-gray-400 text-sm">AULAS OCUPADAS</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {classrooms.reduce((acc, c) => acc + c.currentOccupancy, 0)}
                    </div>
                    <p className="text-gray-400 text-sm">OCUPACIÓN TOTAL</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round(
                        (classrooms.reduce((acc, c) => acc + c.currentOccupancy, 0) /
                          classrooms.reduce((acc, c) => acc + c.capacity, 0)) *
                          100,
                      )}
                      %
                    </div>
                    <p className="text-gray-400 text-sm">CAPACIDAD UTILIZADA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">CALENDARIO DE CONSEJERÍA</CardTitle>
                  <CardDescription className="text-gray-300">Programar sesiones y reuniones con padres</CardDescription>
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
                          <SelectItem value="session">SESIÓN DE CONSEJERÍA</SelectItem>
                          <SelectItem value="parent_conference">CONFERENCIA CON PADRES</SelectItem>
                          <SelectItem value="reminder">RECORDATORIO</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newEvent.studentId}
                        onValueChange={(value) => setNewEvent({ ...newEvent, studentId: value })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="SELECCIONAR ESTUDIANTE (OPCIONAL)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">SIN ESTUDIANTE ESPECÍFICO</SelectItem>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} - {student.grade}
                              {student.section}
                            </SelectItem>
                          ))}
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
                              {event.studentId && (
                                <p className="text-green-400 text-xs">
                                  Estudiante: {students.find((s) => s.id === event.studentId)?.name}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="border-blue-400 text-blue-300">
                              {event.type.replace("_", " ").toUpperCase()}
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
                    <CardTitle className="text-white">SISTEMA DE COMUNICACIÓN</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={activeChat === "counseling" ? "default" : "outline"}
                        onClick={() => setActiveChat("counseling")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeChat === "counseling"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Chat Consejería
                      </Button>
                      <Button
                        onClick={() => setActiveChat("general")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeChat === "general"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Chat General
                      </Button>
                    </div>

                    <div className="flex-1 bg-gray-800/50 rounded-lg p-4 mb-4 overflow-y-auto max-h-64">
                      {activeChat === "counseling" ? (
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                              AD
                            </div>
                            <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                              <p className="text-sm">¿Cómo va el seguimiento de María González?</p>
                              <span className="text-xs text-gray-400">10:30 AM</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                              <p className="text-sm">Muy bien, ha mejorado su asistencia considerablemente</p>
                              <span className="text-xs text-blue-200">10:32 AM</span>
                            </div>
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                              YO
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                              DR
                            </div>
                            <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                              <p className="text-sm">Reunión general mañana a las 2:00 PM</p>
                              <span className="text-xs text-gray-400">9:15 AM</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                              PR
                            </div>
                            <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                              <p className="text-sm">¿Alguien puede cubrir mi turno el viernes?</p>
                              <span className="text-xs text-gray-400">9:45 AM</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Escribir mensaje..."
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
