"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity,
  Target,
  MessageSquare,
  Bell,
  LogOut,
  Eye,
  Search,
  Plus,
  Edit,
  Award,
  DollarSign,
  TrendingDown,
  MessageCircle,
} from "lucide-react"

interface ExecutiveMetric {
  title: string
  value: string
  change: string
  icon: any
  color: string
  trend: "up" | "down" | "stable"
  details: string
}

interface Report {
  id: string
  title: string
  date: string
  status: "Completado" | "En Revisión" | "Pendiente" | "Vencido"
  priority: "high" | "medium" | "low"
  author: string
  description: string
}

interface Meeting {
  id: string
  title: string
  time: string
  date: string
  attendees: number
  type: "Consejo" | "Padres" | "Docentes" | "Administrativo"
  location: string
  status: "Programada" | "En Curso" | "Completada" | "Cancelada"
}

interface Communication {
  id: string
  type: "broadcast" | "individual" | "group"
  recipient: string
  subject: string
  message: string
  date: string
  status: "sent" | "delivered" | "read"
  priority: "high" | "medium" | "low"
}

interface Alert {
  id: string
  type: "academic" | "attendance" | "financial" | "security" | "maintenance"
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  date: string
  resolved: boolean
}

interface ChatMessage {
  id: string
  sender: string
  role: string
  message: string
  timestamp: string
  channel: "direction" | "general"
}

const executiveMetrics: ExecutiveMetric[] = [
  {
    title: "TOTAL ESTUDIANTES",
    value: "1,247",
    change: "+3.2%",
    icon: Users,
    color: "text-blue-400",
    trend: "up",
    details: "Incremento de 38 estudiantes respecto al período anterior",
  },
  {
    title: "ASISTENCIA PROMEDIO",
    value: "94.8%",
    change: "+1.5%",
    icon: CheckCircle,
    color: "text-green-400",
    trend: "up",
    details: "Mejora significativa en la asistencia estudiantil",
  },
  {
    title: "RENDIMIENTO ACADÉMICO",
    value: "87.3%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-purple-400",
    trend: "up",
    details: "Promedio general de calificaciones institucional",
  },
  {
    title: "SATISFACCIÓN PADRES",
    value: "92.1%",
    change: "+0.8%",
    icon: Target,
    color: "text-orange-400",
    trend: "up",
    details: "Basado en encuestas mensuales de satisfacción",
  },
  {
    title: "EFICIENCIA FINANCIERA",
    value: "89.7%",
    change: "-0.3%",
    icon: DollarSign,
    color: "text-yellow-400",
    trend: "down",
    details: "Optimización de recursos y presupuesto institucional",
  },
  {
    title: "RETENCIÓN ESTUDIANTIL",
    value: "96.8%",
    change: "+1.2%",
    icon: Award,
    color: "text-cyan-400",
    trend: "up",
    details: "Porcentaje de estudiantes que continúan sus estudios",
  },
]

const mockReports: Report[] = [
  {
    id: "1",
    title: "INFORME MENSUAL DE ASISTENCIA",
    date: "2024-01-15",
    status: "Completado",
    priority: "high",
    author: "DPTO. ACADÉMICO",
    description: "Análisis detallado de patrones de asistencia estudiantil",
  },
  {
    id: "2",
    title: "EVALUACIÓN DOCENTE Q1",
    date: "2024-01-12",
    status: "En Revisión",
    priority: "medium",
    author: "RECURSOS HUMANOS",
    description: "Evaluación trimestral del desempeño docente",
  },
  {
    id: "3",
    title: "PRESUPUESTO ANUAL 2024",
    date: "2024-01-10",
    status: "Pendiente",
    priority: "high",
    author: "DPTO. FINANCIERO",
    description: "Proyección y asignación presupuestaria anual",
  },
  {
    id: "4",
    title: "PLAN DE MEJORA ACADÉMICA",
    date: "2024-01-08",
    status: "Completado",
    priority: "low",
    author: "COORDINACIÓN ACADÉMICA",
    description: "Estrategias para mejorar el rendimiento estudiantil",
  },
  {
    id: "5",
    title: "INFORME DE INFRAESTRUCTURA",
    date: "2024-01-05",
    status: "Vencido",
    priority: "high",
    author: "MANTENIMIENTO",
    description: "Estado actual de las instalaciones educativas",
  },
]

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "CONSEJO DIRECTIVO",
    time: "10:00 AM",
    date: "HOY",
    attendees: 8,
    type: "Consejo",
    location: "SALA DE JUNTAS",
    status: "Programada",
  },
  {
    id: "2",
    title: "REUNIÓN CON PADRES",
    time: "2:00 PM",
    date: "MAÑANA",
    attendees: 25,
    type: "Padres",
    location: "AUDITORIO PRINCIPAL",
    status: "Programada",
  },
  {
    id: "3",
    title: "EVALUACIÓN DOCENTE",
    time: "9:00 AM",
    date: "VIERNES",
    attendees: 12,
    type: "Docentes",
    location: "SALA DE PROFESORES",
    status: "Programada",
  },
  {
    id: "4",
    title: "PLANIFICACIÓN ACADÉMICA",
    time: "11:00 AM",
    date: "LUNES",
    attendees: 6,
    type: "Administrativo",
    location: "OFICINA DIRECCIÓN",
    status: "Programada",
  },
]

const mockCommunications: Communication[] = [
  {
    id: "1",
    type: "broadcast",
    recipient: "TODOS LOS PADRES",
    subject: "REUNIÓN GENERAL DE PADRES",
    message: "Se convoca a reunión general el viernes 19 de enero a las 2:00 PM",
    date: "2024-01-15 09:30",
    status: "delivered",
    priority: "high",
  },
  {
    id: "2",
    type: "individual",
    recipient: "CARLOS GONZÁLEZ",
    subject: "RENDIMIENTO ACADÉMICO DE MARÍA",
    message: "Su hija María ha mostrado excelente progreso académico",
    date: "2024-01-14 14:20",
    status: "read",
    priority: "medium",
  },
  {
    id: "3",
    type: "group",
    recipient: "DOCENTES 10° GRADO",
    subject: "COORDINACIÓN CURRICULAR",
    message: "Reunión para coordinar actividades del segundo período",
    date: "2024-01-13 11:15",
    status: "sent",
    priority: "medium",
  },
]

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "attendance",
    title: "BAJA ASISTENCIA DETECTADA",
    description: "El grado 8°B presenta un 15% de ausencias hoy",
    severity: "warning",
    date: "2024-01-15 08:30",
    resolved: false,
  },
  {
    id: "2",
    type: "financial",
    title: "PRESUPUESTO MENSUAL AL 85%",
    description: "El presupuesto operativo ha alcanzado el 85% de ejecución",
    severity: "info",
    date: "2024-01-15 07:00",
    resolved: false,
  },
  {
    id: "3",
    type: "security",
    title: "SISTEMA DE ACCESO ACTUALIZADO",
    description: "Se ha actualizado el sistema de control de acceso",
    severity: "info",
    date: "2024-01-14 16:45",
    resolved: true,
  },
  {
    id: "4",
    type: "academic",
    title: "CALIFICACIONES PENDIENTES",
    description: "3 docentes tienen calificaciones pendientes de subir",
    severity: "critical",
    date: "2024-01-14 12:00",
    resolved: false,
  },
]

export default function DirectionDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedMetric, setSelectedMetric] = useState<ExecutiveMetric | null>(null)
  const [showMetricDetails, setShowMetricDetails] = useState(false)
  const [newCommunication, setNewCommunication] = useState({
    type: "broadcast" as const,
    recipient: "",
    subject: "",
    message: "",
    priority: "medium" as const,
  })
  const [showNewCommunication, setShowNewCommunication] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeChat, setActiveChat] = useState<"direction" | "general">("direction")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const openMetricDetails = (metric: ExecutiveMetric) => {
    setSelectedMetric(metric)
    setShowMetricDetails(true)
  }

  const sendCommunication = () => {
    if (newCommunication.subject && newCommunication.message) {
      // Simulate sending communication
      alert(`Comunicación enviada a: ${newCommunication.recipient || "Destinatarios seleccionados"}`)
      setNewCommunication({
        type: "broadcast",
        recipient: "",
        subject: "",
        message: "",
        priority: "medium",
      })
      setShowNewCommunication(false)
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
        sender: "DIRECTOR GENERAL",
        role: "DIRECCIÓN",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        channel: activeChat,
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-600"
      case "En Revisión":
        return "bg-yellow-600"
      case "Pendiente":
        return "bg-blue-600"
      case "Vencido":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-600"
      case "warning":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-600"
      case "info":
        return "text-blue-400 bg-blue-900/20 border-blue-600"
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-600"
    }
  }

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const unresolvedAlerts = mockAlerts.filter((alert) => !alert.resolved)
  const criticalAlerts = unresolvedAlerts.filter((alert) => alert.severity === "critical")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <header className="glass-dark border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PANEL EJECUTIVO DE DIRECCIÓN</h1>
              <p className="text-blue-200">
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
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <Badge className="bg-red-600">{criticalAlerts.length} CRÍTICAS</Badge>
              </div>
            )}
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-gray-300">
                <Bell className="h-4 w-4" />
                {unresolvedAlerts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-600 text-xs">
                    {unresolvedAlerts.length}
                  </Badge>
                )}
              </Button>
            </div>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              DIRECTOR GENERAL
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              SALIR
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {executiveMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card
                key={index}
                className="glass border-gray-600 hover:neon-glow transition-all duration-300 cursor-pointer"
                onClick={() => openMetricDetails(metric)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                      <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${metric.color}`}>{metric.change}</p>
                        <div className="flex items-center">
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          ) : metric.trend === "down" ? (
                            <TrendingDown className="h-3 w-3 text-red-400" />
                          ) : (
                            <Activity className="h-3 w-3 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <IconComponent className={`h-8 w-8 ${metric.color}`} />
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        VER
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border border-gray-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Activity className="h-4 w-4 mr-2" />
              RESUMEN
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              REPORTES
            </TabsTrigger>
            <TabsTrigger value="meetings" className="data-[state=active]:bg-purple-600">
              <Calendar className="h-4 w-4 mr-2" />
              REUNIONES
            </TabsTrigger>
            <TabsTrigger value="communications" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              COMUNICACIONES
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              ANÁLISIS
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              CHAT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-400" />
                      REPORTES RECIENTES
                    </CardTitle>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-3 w-3 mr-1" />
                      NUEVO
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                      <Input
                        placeholder="BUSCAR REPORTES..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-gray-800 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">TODOS</SelectItem>
                        <SelectItem value="Completado">COMPLETADOS</SelectItem>
                        <SelectItem value="Pendiente">PENDIENTES</SelectItem>
                        <SelectItem value="En Revisión">EN REVISIÓN</SelectItem>
                        <SelectItem value="Vencido">VENCIDOS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredReports.slice(0, 5).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{report.title}</p>
                          <p className="text-gray-400 text-sm">
                            {report.author} • {report.date}
                          </p>
                          <p className="text-gray-300 text-xs mt-1">{report.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                      PRÓXIMAS REUNIONES
                    </CardTitle>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-3 w-3 mr-1" />
                      PROGRAMAR
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium">{meeting.title}</p>
                            <Badge variant="outline" className="border-blue-400 text-blue-300 text-xs">
                              {meeting.type}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {meeting.time} - {meeting.date} • {meeting.location}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center text-blue-400 text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {meeting.attendees} asistentes
                            </div>
                            <Badge className="bg-green-600 text-xs">{meeting.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  ALERTAS DEL SISTEMA
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Notificaciones importantes que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unresolvedAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <Badge
                          className={`text-xs ${alert.severity === "critical" ? "bg-red-600" : alert.severity === "warning" ? "bg-yellow-600" : "bg-blue-600"}`}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-70">{alert.date}</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          RESOLVER
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">GESTIÓN DE REPORTES EJECUTIVOS</CardTitle>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    GENERAR REPORTE
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockReports.map((report) => (
                    <div key={report.id} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <Badge
                          variant="outline"
                          className={`border-${report.priority === "high" ? "red" : report.priority === "medium" ? "yellow" : "green"}-400`}
                        >
                          {report.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-white font-semibold mb-2">{report.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{report.author}</span>
                        <span>{report.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 bg-transparent"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          VER
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 bg-transparent"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          EDITAR
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">CALENDARIO DE REUNIONES EJECUTIVAS</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    NUEVA REUNIÓN
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{meeting.title}</h3>
                            <Badge variant="outline" className="border-blue-400 text-blue-300">
                              {meeting.type}
                            </Badge>
                            <Badge className="bg-green-600">{meeting.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                            <div>
                              <span className="text-gray-500">Fecha:</span> {meeting.date}
                            </div>
                            <div>
                              <span className="text-gray-500">Hora:</span> {meeting.time}
                            </div>
                            <div>
                              <span className="text-gray-500">Lugar:</span> {meeting.location}
                            </div>
                            <div>
                              <span className="text-gray-500">Asistentes:</span> {meeting.attendees}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <Edit className="h-3 w-3 mr-1" />
                            EDITAR
                          </Button>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Eye className="h-3 w-3 mr-1" />
                            VER
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">NUEVA COMUNICACIÓN</CardTitle>
                    <Button
                      onClick={() => setShowNewCommunication(!showNewCommunication)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      CREAR
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showNewCommunication && (
                    <div className="space-y-4">
                      <Select
                        value={newCommunication.type}
                        onValueChange={(value: any) => setNewCommunication({ ...newCommunication, type: value })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Tipo de comunicación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="broadcast">DIFUSIÓN GENERAL</SelectItem>
                          <SelectItem value="individual">INDIVIDUAL</SelectItem>
                          <SelectItem value="group">GRUPO ESPECÍFICO</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Destinatario(s)"
                        value={newCommunication.recipient}
                        onChange={(e) => setNewCommunication({ ...newCommunication, recipient: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />

                      <Input
                        placeholder="Asunto"
                        value={newCommunication.subject}
                        onChange={(e) => setNewCommunication({ ...newCommunication, subject: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />

                      <textarea
                        placeholder="Mensaje"
                        value={newCommunication.message}
                        onChange={(e) => setNewCommunication({ ...newCommunication, message: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white resize-none"
                        rows={4}
                      />

                      <div className="flex gap-2">
                        <Button onClick={sendCommunication} className="bg-blue-600 hover:bg-blue-700">
                          ENVIAR COMUNICACIÓN
                        </Button>
                        <Button
                          onClick={() => sendWhatsAppMessage("50412345678", newCommunication.message)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ENVIAR VÍA WHATSAPP
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">HISTORIAL DE COMUNICACIONES</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {mockCommunications.map((comm) => (
                      <div key={comm.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-purple-400 text-purple-300">
                            {comm.type.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${comm.status === "read" ? "bg-green-600" : comm.status === "delivered" ? "bg-blue-600" : "bg-yellow-600"}`}
                            >
                              {comm.status.toUpperCase()}
                            </Badge>
                            <Badge
                              className={`${comm.priority === "high" ? "bg-red-600" : comm.priority === "medium" ? "bg-yellow-600" : "bg-green-600"}`}
                            >
                              {comm.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <h4 className="text-white font-medium">{comm.subject}</h4>
                        <p className="text-gray-400 text-sm">Para: {comm.recipient}</p>
                        <p className="text-gray-300 text-sm mt-1">{comm.message}</p>
                        <p className="text-gray-500 text-xs mt-2">{comm.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">ANÁLISIS DE RENDIMIENTO INSTITUCIONAL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-gray-400">Gráfico de Rendimiento Académico</p>
                      <p className="text-gray-500 text-sm">Datos actualizados en tiempo real</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">TENDENCIAS DE ASISTENCIA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <p className="text-gray-400">Análisis de Asistencia</p>
                      <p className="text-gray-500 text-sm">Comparativa mensual y anual</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">MÉTRICAS FINANCIERAS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg text-center">
                    <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">L. 2,847,392</p>
                    <p className="text-gray-400">INGRESOS MENSUALES</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg text-center">
                    <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">L. 1,923,847</p>
                    <p className="text-gray-400">GASTOS OPERATIVOS</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg text-center">
                    <Award className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">L. 923,545</p>
                    <p className="text-gray-400">UTILIDAD NETA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass border-gray-600 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">SISTEMA DE COMUNICACIÓN INTERNA</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={activeChat === "direction" ? "default" : "outline"}
                        onClick={() => setActiveChat("direction")}
                        className={activeChat === "direction" ? "bg-purple-600" : "border-gray-600 text-gray-300"}
                      >
                        CHAT DIRECCIÓN
                      </Button>
                      <Button
                        size="sm"
                        variant={activeChat === "general" ? "default" : "outline"}
                        onClick={() => setActiveChat("general")}
                        className={activeChat === "general" ? "bg-purple-600" : "border-gray-600 text-gray-300"}
                      >
                        CHAT GENERAL
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto">
                    {chatMessages
                      .filter((msg) => msg.channel === activeChat)
                      .map((message) => (
                        <div key={message.id} className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-purple-400 font-medium">{message.sender}</span>
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              {message.role}
                            </Badge>
                            <span className="text-gray-500 text-xs">{message.timestamp}</span>
                          </div>
                          <p className="text-gray-300 bg-gray-700 p-2 rounded">{message.message}</p>
                        </div>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Escribir en ${activeChat === "direction" ? "chat de dirección" : "chat general"}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Button onClick={sendChatMessage} className="bg-purple-600 hover:bg-purple-700">
                      ENVIAR
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">USUARIOS CONECTADOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "ADMIN PRINCIPAL", role: "ADMINISTRACIÓN", status: "online" },
                      { name: "CONSEJERA MARÍA", role: "CONSEJERÍA", status: "online" },
                      { name: "OPERADOR JUAN", role: "REGISTRO", status: "away" },
                      { name: "PROF. CARLOS", role: "DOCENTE", status: "online" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <div>
                          <p className="text-white text-sm font-medium">{user.name}</p>
                          <p className="text-gray-400 text-xs">{user.role}</p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${user.status === "online" ? "bg-green-400" : "bg-yellow-400"}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Metric Details Modal */}
      {showMetricDetails && selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="glass border-gray-600 w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{selectedMetric.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowMetricDetails(false)} className="text-gray-400">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-white mb-2">{selectedMetric.value}</p>
                <p className={`text-lg font-semibold ${selectedMetric.color}`}>{selectedMetric.change}</p>
              </div>
              <p className="text-gray-300 text-sm">{selectedMetric.details}</p>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">VER DETALLES</Button>
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 bg-transparent">
                  EXPORTAR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
