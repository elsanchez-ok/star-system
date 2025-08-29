"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  QrCode,
  Camera,
  Bluetooth,
  Usb,
  Smartphone,
  LogIn,
  LogOut,
  Users,
  Settings,
  Search,
  MapPin,
  CheckCircle,
  XCircle,
  Monitor,
  Scan,
  History,
  Wifi,
  RefreshCw,
  Download,
  Zap,
  Activity,
  Eye,
  Volume2,
  VolumeX,
  Play,
  Square,
} from "lucide-react"

interface RegistrationEntry {
  id: string
  personId: string
  name: string
  type: "student" | "teacher" | "staff"
  photo: string
  entryTime: string
  exitTime?: string
  method: "qr" | "barcode" | "manual" | "camera" | "nfc" | "facial"
  location: "main_entrance" | "secondary_entrance" | "parking" | "emergency_exit"
  status: "entered" | "exited"
  deviceUsed: string
  confidence: number
  temperature?: number
  notes?: string
}

interface Person {
  id: string
  name: string
  type: "student" | "teacher" | "staff"
  photo: string
  idNumber: string
  grade?: string
  section?: string
  department?: string
  currentLocation?: string
  lastSeen?: string
  accessLevel: "basic" | "elevated" | "admin"
  emergencyContact?: string
}

interface Device {
  id: string
  name: string
  type: "camera" | "usb_scanner" | "bluetooth_scanner" | "nfc_reader" | "thermal_camera"
  status: "connected" | "disconnected" | "error" | "maintenance"
  lastUsed: string
  batteryLevel?: number
  signalStrength?: number
  firmware: string
  location: string
  totalScans: number
  errorCount: number
}

interface LocationData {
  id: string
  name: string
  type: "classroom" | "office" | "lab" | "library" | "cafeteria" | "gym" | "auditorium"
  capacity: number
  currentOccupancy: number
  people: Person[]
  coordinates: { x: number; y: number }
  color: string
}

const mockPeople: Person[] = [
  {
    id: "0501201003127",
    name: "MARÍA GONZÁLEZ LÓPEZ",
    type: "student",
    photo: "/placeholder-j0goy.png",
    idNumber: "0501201003127",
    grade: "10°",
    section: "A",
    currentLocation: "AULA 201",
    lastSeen: "08:45 AM",
    accessLevel: "basic",
    emergencyContact: "+504 9876-5432",
  },
  {
    id: "0501200912345",
    name: "JOSÉ MARTÍNEZ RIVERA",
    type: "student",
    photo: "/student-boy.png",
    idNumber: "0501200912345",
    grade: "11°",
    section: "B",
    currentLocation: "LABORATORIO DE CIENCIAS",
    lastSeen: "08:30 AM",
    accessLevel: "basic",
    emergencyContact: "+504 8765-4321",
  },
  {
    id: "PROF001",
    name: "DRA. ANA PATRICIA LÓPEZ",
    type: "teacher",
    photo: "/teacher-woman.png",
    idNumber: "PROF001",
    department: "MATEMÁTICAS",
    currentLocation: "SALA DE PROFESORES",
    lastSeen: "07:30 AM",
    accessLevel: "elevated",
    emergencyContact: "+504 2345-6789",
  },
  {
    id: "STAFF001",
    name: "CARLOS MENDOZA",
    type: "staff",
    photo: "/placeholder.svg",
    idNumber: "STAFF001",
    department: "MANTENIMIENTO",
    currentLocation: "ENTRADA PRINCIPAL",
    lastSeen: "06:00 AM",
    accessLevel: "admin",
    emergencyContact: "+504 3456-7890",
  },
]

const mockDevices: Device[] = [
  {
    id: "CAM001",
    name: "CÁMARA PRINCIPAL",
    type: "camera",
    status: "connected",
    lastUsed: "Hace 2 min",
    firmware: "v2.1.4",
    location: "ENTRADA PRINCIPAL",
    totalScans: 1247,
    errorCount: 3,
  },
  {
    id: "USB001",
    name: "ESCÁNER PDF417",
    type: "usb_scanner",
    status: "connected",
    lastUsed: "Hace 5 min",
    firmware: "v1.8.2",
    location: "RECEPCIÓN",
    totalScans: 892,
    errorCount: 1,
  },
  {
    id: "BT001",
    name: "ESCÁNER BLUETOOTH",
    type: "bluetooth_scanner",
    status: "disconnected",
    lastUsed: "Hace 1 hora",
    batteryLevel: 45,
    signalStrength: 0,
    firmware: "v3.0.1",
    location: "ENTRADA SECUNDARIA",
    totalScans: 234,
    errorCount: 8,
  },
  {
    id: "NFC001",
    name: "LECTOR NFC",
    type: "nfc_reader",
    status: "maintenance",
    lastUsed: "Hace 3 horas",
    firmware: "v1.2.0",
    location: "BIBLIOTECA",
    totalScans: 156,
    errorCount: 12,
  },
]

const mockLocations: LocationData[] = [
  {
    id: "aula201",
    name: "AULA 201",
    type: "classroom",
    capacity: 35,
    currentOccupancy: 28,
    people: [mockPeople[0]],
    coordinates: { x: 1, y: 0 },
    color: "bg-blue-600",
  },
  {
    id: "lab_ciencias",
    name: "LABORATORIO DE CIENCIAS",
    type: "lab",
    capacity: 25,
    currentOccupancy: 15,
    people: [mockPeople[1]],
    coordinates: { x: 2, y: 0 },
    color: "bg-green-600",
  },
  {
    id: "sala_profesores",
    name: "SALA DE PROFESORES",
    type: "office",
    capacity: 20,
    currentOccupancy: 8,
    people: [mockPeople[2]],
    coordinates: { x: 3, y: 0 },
    color: "bg-yellow-600",
  },
  {
    id: "biblioteca",
    name: "BIBLIOTECA",
    type: "library",
    capacity: 50,
    currentOccupancy: 12,
    people: [],
    coordinates: { x: 0, y: 1 },
    color: "bg-purple-600",
  },
  {
    id: "cafeteria",
    name: "CAFETERÍA",
    type: "cafeteria",
    capacity: 100,
    currentOccupancy: 45,
    people: [],
    coordinates: { x: 1, y: 1 },
    color: "bg-orange-600",
  },
  {
    id: "gimnasio",
    name: "GIMNASIO",
    type: "gym",
    capacity: 80,
    currentOccupancy: 22,
    people: [],
    coordinates: { x: 2, y: 1 },
    color: "bg-red-600",
  },
]

const mockEntries: RegistrationEntry[] = [
  {
    id: "1",
    personId: "0501201003127",
    name: "MARÍA GONZÁLEZ LÓPEZ",
    type: "student",
    photo: "/placeholder-j0goy.png",
    entryTime: "07:45 AM",
    method: "qr",
    location: "main_entrance",
    status: "entered",
    deviceUsed: "CAM001",
    confidence: 98,
    temperature: 36.5,
    notes: "Entrada normal",
  },
  {
    id: "2",
    personId: "PROF001",
    name: "DRA. ANA PATRICIA LÓPEZ",
    type: "teacher",
    photo: "/teacher-woman.png",
    entryTime: "07:30 AM",
    method: "barcode",
    location: "main_entrance",
    status: "entered",
    deviceUsed: "USB001",
    confidence: 100,
    temperature: 36.2,
  },
  {
    id: "3",
    personId: "STAFF001",
    name: "CARLOS MENDOZA",
    type: "staff",
    photo: "/placeholder.svg",
    entryTime: "06:00 AM",
    method: "manual",
    location: "main_entrance",
    status: "entered",
    deviceUsed: "MANUAL",
    confidence: 100,
    notes: "Personal de mantenimiento - entrada temprana",
  },
]

export default function RegistrationDashboard() {
  const [entries, setEntries] = useState<RegistrationEntry[]>(mockEntries)
  const [people] = useState<Person[]>(mockPeople)
  const [devices, setDevices] = useState<Device[]>(mockDevices)
  const [locations] = useState<LocationData[]>(mockLocations)
  const [manualCode, setManualCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanMethod, setScanMethod] = useState<"camera" | "usb" | "bluetooth" | "nfc">("camera")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [welcomeDialog, setWelcomeDialog] = useState<Person | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [showDeviceDetails, setShowDeviceDetails] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "student" | "teacher" | "staff">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "entered" | "exited">("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoMode, setAutoMode] = useState(true)
  const [scannerActive, setScannerActive] = useState(false)
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkStatus: "connected",
    uptime: "2d 14h 32m",
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const todayEntries = entries.filter((entry) => {
    const today = new Date().toDateString()
    const entryDate = new Date().toDateString()
    return today === entryDate
  })

  const studentsEntered = todayEntries.filter((e) => e.type === "student" && e.status === "entered").length
  const teachersEntered = todayEntries.filter((e) => e.type === "teacher" && e.status === "entered").length
  const staffEntered = todayEntries.filter((e) => e.type === "staff" && e.status === "entered").length
  const totalEntered = studentsEntered + teachersEntered + staffEntered

  const connectedDevices = devices.filter((d) => d.status === "connected").length
  const totalDevices = devices.length

  const handleManualEntry = () => {
    if (!manualCode.trim()) return

    const person = people.find((p) => p.idNumber === manualCode.toUpperCase())
    if (person) {
      showWelcomeScreen(person)
      registerEntry(person, "manual")
      if (soundEnabled) {
        // Play success sound
        const audio = new Audio("/success-sound.mp3")
        audio.play().catch(() => {})
      }
    } else {
      alert("CÓDIGO NO ENCONTRADO EN EL SISTEMA")
      if (soundEnabled) {
        // Play error sound
        const audio = new Audio("/error-sound.mp3")
        audio.play().catch(() => {})
      }
    }
    setManualCode("")
  }

  const showWelcomeScreen = (person: Person) => {
    setWelcomeDialog(person)
    setTimeout(() => setWelcomeDialog(null), 4000)
  }

  const registerEntry = (person: Person, method: "qr" | "barcode" | "manual" | "camera" | "nfc" | "facial") => {
    const existingEntry = entries.find((e) => e.personId === person.id && e.status === "entered")

    if (existingEntry) {
      // Register exit
      setEntries(
        entries.map((e) =>
          e.id === existingEntry.id
            ? {
                ...e,
                exitTime: currentTime.toLocaleTimeString("es-HN", { hour12: true }),
                status: "exited" as const,
                notes: e.notes ? `${e.notes} | Salida registrada` : "Salida registrada",
              }
            : e,
        ),
      )
    } else {
      // Register entry
      const newEntry: RegistrationEntry = {
        id: Date.now().toString(),
        personId: person.id,
        name: person.name,
        type: person.type,
        photo: person.photo,
        entryTime: currentTime.toLocaleTimeString("es-HN", { hour12: true }),
        method,
        location: "main_entrance",
        status: "entered",
        deviceUsed: selectedDevice?.id || "MANUAL",
        confidence: method === "manual" ? 100 : Math.floor(Math.random() * 20) + 80,
        temperature: 36 + Math.random() * 1.5,
        notes: `Entrada registrada via ${method.toUpperCase()}`,
      }
      setEntries([newEntry, ...entries])
    }
  }

  const startCameraScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
        setScannerActive(true)

        // Update device status
        setDevices(
          devices.map((d) => (d.type === "camera" ? { ...d, status: "connected" as const, lastUsed: "Ahora" } : d)),
        )
      }
    } catch (error) {
      console.error("Camera error:", error)
      alert("NO SE PUDO ACCEDER A LA CÁMARA. VERIFIQUE LOS PERMISOS.")

      // Update device status to error
      setDevices(devices.map((d) => (d.type === "camera" ? { ...d, status: "error" as const } : d)))
    }
  }

  const stopCameraScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
    setScannerActive(false)
  }

  const connectDevice = (deviceId: string) => {
    setDevices(
      devices.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              status: "connected" as const,
              lastUsed: "Ahora",
              signalStrength: d.type === "bluetooth_scanner" ? Math.floor(Math.random() * 40) + 60 : undefined,
            }
          : d,
      ),
    )
  }

  const disconnectDevice = (deviceId: string) => {
    setDevices(
      devices.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              status: "disconnected" as const,
              signalStrength: d.type === "bluetooth_scanner" ? 0 : undefined,
            }
          : d,
      ),
    )
  }

  const simulateCodeScan = (code: string) => {
    const person = people.find((p) => p.idNumber === code)
    if (person) {
      showWelcomeScreen(person)
      registerEntry(person, scanMethod === "camera" ? "camera" : "qr")

      // Update device scan count
      const activeDevice = devices.find((d) => d.status === "connected" && d.type === scanMethod + "_scanner")
      if (activeDevice) {
        setDevices(
          devices.map((d) =>
            d.id === activeDevice.id ? { ...d, totalScans: d.totalScans + 1, lastUsed: "Ahora" } : d,
          ),
        )
      }
    }
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.personId.includes(searchTerm) ||
      entry.deviceUsed.includes(searchTerm)

    const matchesType = filterType === "all" || entry.type === filterType
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getPersonTypeIcon = (type: string) => {
    switch (type) {
      case "student":
        return "👨‍🎓"
      case "teacher":
        return "👩‍🏫"
      case "staff":
        return "👨‍💼"
      default:
        return "👤"
    }
  }

  const getPersonTypeText = (type: string) => {
    switch (type) {
      case "student":
        return "ESTUDIANTE"
      case "teacher":
        return "PROFESOR/A"
      case "staff":
        return "PERSONAL"
      default:
        return "PERSONA"
    }
  }

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-400"
      case "disconnected":
        return "bg-red-400"
      case "error":
        return "bg-red-600"
      case "maintenance":
        return "bg-yellow-400"
      default:
        return "bg-gray-400"
    }
  }

  const getLocationOccupancyColor = (occupancy: number, capacity: number) => {
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
            <QrCode className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">SISTEMA DE REGISTRO AVANZADO</h1>
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
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${getDeviceStatusColor(devices.find((d) => d.type === "camera")?.status || "disconnected")}`}
                />
                <Camera className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${getDeviceStatusColor(devices.find((d) => d.type === "usb_scanner")?.status || "disconnected")}`}
                />
                <Usb className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${getDeviceStatusColor(devices.find((d) => d.type === "bluetooth_scanner")?.status || "disconnected")}`}
                />
                <Bluetooth className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${systemStats.networkStatus === "connected" ? "bg-green-400" : "bg-red-400"}`}
                />
                <Wifi className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              {connectedDevices}/{totalDevices} DISPOSITIVOS
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              REGISTRO
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
              <CardTitle className="text-sm font-medium text-gray-300">TOTAL ENTRADAS</CardTitle>
              <LogIn className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalEntered}</div>
              <p className="text-xs text-gray-400">Registros del día</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ESTUDIANTES</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentsEntered}</div>
              <p className="text-xs text-gray-400">En el plantel</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">PROFESORES</CardTitle>
              <Users className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{teachersEntered}</div>
              <p className="text-xs text-gray-400">En el plantel</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">PERSONAL</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{staffEntered}</div>
              <p className="text-xs text-gray-400">En el plantel</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">SISTEMA</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">ACTIVO</div>
              <p className="text-xs text-gray-400">Uptime: {systemStats.uptime}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border border-gray-600">
            <TabsTrigger value="scanner" className="data-[state=active]:bg-blue-600">
              <Scan className="h-4 w-4 mr-2" />
              ESCÁNER
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-blue-600">
              <Monitor className="h-4 w-4 mr-2" />
              DISPOSITIVOS
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
              <History className="h-4 w-4 mr-2" />
              HISTORIAL
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-blue-600">
              <MapPin className="h-4 w-4 mr-2" />
              MAPA
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <Activity className="h-4 w-4 mr-2" />
              ANÁLISIS
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              CONFIG
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Scanner Interface */}
              <Card className="glass border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">ESCÁNER MULTIMODO</CardTitle>
                      <CardDescription className="text-gray-300">
                        Sistema avanzado de reconocimiento QR, PDF417, NFC y facial
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={soundEnabled ? "default" : "outline"}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={soundEnabled ? "bg-green-600" : "border-gray-600"}
                      >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={autoMode ? "default" : "outline"}
                        onClick={() => setAutoMode(!autoMode)}
                        className={autoMode ? "bg-blue-600" : "border-gray-600"}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">MÉTODO DE ESCANEO</Label>
                    <Select value={scanMethod} onValueChange={(value: any) => setScanMethod(value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camera">
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            CÁMARA HD + IA
                          </div>
                        </SelectItem>
                        <SelectItem value="usb">
                          <div className="flex items-center gap-2">
                            <Usb className="h-4 w-4" />
                            ESCÁNER PDF417 USB
                          </div>
                        </SelectItem>
                        <SelectItem value="bluetooth">
                          <div className="flex items-center gap-2">
                            <Bluetooth className="h-4 w-4" />
                            ESCÁNER BLUETOOTH
                          </div>
                        </SelectItem>
                        <SelectItem value="nfc">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            LECTOR NFC/RFID
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {scanMethod === "camera" && (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                          style={{ display: isScanning ? "block" : "none" }}
                        />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        {!isScanning && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-400 mb-2">CÁMARA INACTIVA</p>
                              <p className="text-gray-500 text-sm">Resolución: 1280x720 | IA: Activada</p>
                            </div>
                          </div>
                        )}
                        {isScanning && (
                          <div className="absolute inset-0">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-400 rounded-lg animate-pulse">
                              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 px-3 py-1 rounded">
                              <p className="text-green-400 text-sm">● ESCANEANDO...</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {!isScanning ? (
                          <Button onClick={startCameraScanning} className="bg-green-600 hover:bg-green-700">
                            <Play className="h-4 w-4 mr-2" />
                            INICIAR
                          </Button>
                        ) : (
                          <Button onClick={stopCameraScanning} className="bg-red-600 hover:bg-red-700">
                            <Square className="h-4 w-4 mr-2" />
                            DETENER
                          </Button>
                        )}
                        <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                          <Settings className="h-4 w-4 mr-2" />
                          AJUSTES
                        </Button>
                      </div>

                      {/* Manual Entry Section */}
                      <div className="border-t border-gray-600 pt-4">
                        <Label className="text-white mb-2 block">ENTRADA MANUAL</Label>
                        <div className="flex gap-2">
                          <Input
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            placeholder="CÓDIGO DE IDENTIFICACIÓN"
                            className="bg-gray-800 border-gray-600 text-white"
                            onKeyPress={(e) => e.key === "Enter" && handleManualEntry()}
                          />
                          <Button onClick={handleManualEntry} className="bg-blue-600 hover:bg-blue-700">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Demo buttons for testing */}
                      <div className="space-y-2 border-t border-gray-600 pt-4">
                        <p className="text-sm text-gray-400">PRUEBAS DE SISTEMA:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => simulateCodeScan("0501201003127")}
                            className="border-gray-600 text-gray-300 bg-transparent"
                          >
                            ESTUDIANTE
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => simulateCodeScan("PROF001")}
                            className="border-gray-600 text-gray-300 bg-transparent"
                          >
                            PROFESOR
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => simulateCodeScan("STAFF001")}
                            className="border-gray-600 text-gray-300 bg-transparent"
                          >
                            PERSONAL
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => simulateCodeScan("INVALID")}
                            className="border-red-600 text-red-300 bg-transparent"
                          >
                            ERROR
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanMethod === "usb" && (
                    <div className="text-center py-8">
                      <Usb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">ESCÁNER PDF417 USB PROFESIONAL</p>
                      <p className="text-gray-400 text-sm mb-4">
                        Conecte el dispositivo USB y escanee códigos de barras
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${devices.find((d) => d.type === "usb_scanner")?.status === "connected" ? "bg-green-400" : "bg-red-400"}`}
                          />
                          <span className="text-white">
                            {devices.find((d) => d.type === "usb_scanner")?.status === "connected"
                              ? "CONECTADO"
                              : "DESCONECTADO"}
                          </span>
                        </div>
                        <Button
                          onClick={() => connectDevice("USB001")}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={devices.find((d) => d.id === "USB001")?.status === "connected"}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          RECONECTAR DISPOSITIVO
                        </Button>
                      </div>
                    </div>
                  )}

                  {scanMethod === "bluetooth" && (
                    <div className="text-center py-8">
                      <Bluetooth className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">ESCÁNER BLUETOOTH INALÁMBRICO</p>
                      <p className="text-gray-400 text-sm mb-4">Empareje dispositivos Bluetooth compatibles</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${devices.find((d) => d.type === "bluetooth_scanner")?.status === "connected" ? "bg-green-400" : "bg-red-400"}`}
                          />
                          <span className="text-white">
                            {devices.find((d) => d.type === "bluetooth_scanner")?.status === "connected"
                              ? "CONECTADO"
                              : "DESCONECTADO"}
                          </span>
                          {devices.find((d) => d.type === "bluetooth_scanner")?.batteryLevel && (
                            <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                              {devices.find((d) => d.type === "bluetooth_scanner")?.batteryLevel}%
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => connectDevice("BT001")}
                            variant="outline"
                            className="border-gray-600 text-gray-300 bg-transparent"
                          >
                            <Bluetooth className="h-4 w-4 mr-2" />
                            CONECTAR
                          </Button>
                          <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <Search className="h-4 w-4 mr-2" />
                            BUSCAR
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanMethod === "nfc" && (
                    <div className="text-center py-8">
                      <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">LECTOR NFC/RFID</p>
                      <p className="text-gray-400 text-sm mb-4">Acerque tarjetas NFC o dispositivos compatibles</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${devices.find((d) => d.type === "nfc_reader")?.status === "connected" ? "bg-green-400" : "bg-yellow-400"}`}
                          />
                          <span className="text-white">
                            {devices.find((d) => d.type === "nfc_reader")?.status === "maintenance"
                              ? "MANTENIMIENTO"
                              : "LISTO"}
                          </span>
                        </div>
                        <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          REINICIAR LECTOR
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Recent Entries */}
              <Card className="glass border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">REGISTROS EN TIEMPO REAL</CardTitle>
                      <CardDescription className="text-gray-300">
                        Últimas entradas y salidas del sistema
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-green-400 text-green-300">
                      ● LIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {entries.slice(0, 10).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={entry.photo || "/placeholder.svg"} alt={entry.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {entry.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{entry.name}</p>
                          <p className="text-gray-400 text-xs">
                            {getPersonTypeText(entry.type)} • {entry.entryTime}
                            {entry.exitTime && ` → ${entry.exitTime}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs border-blue-400 text-blue-300">
                              {entry.method.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-green-400 text-green-300">
                              {entry.confidence}%
                            </Badge>
                            {entry.temperature && (
                              <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-300">
                                {entry.temperature.toFixed(1)}°C
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={entry.status === "entered" ? "default" : "secondary"}
                            className={entry.status === "entered" ? "bg-green-600" : "bg-red-600"}
                          >
                            {entry.status === "entered" ? "ENTRADA" : "SALIDA"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <Card key={device.id} className="glass border-gray-600 hover:neon-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${getDeviceStatusColor(device.status)} flex items-center justify-center`}
                        >
                          {device.type === "camera" && <Camera className="h-6 w-6 text-white" />}
                          {device.type === "usb_scanner" && <Usb className="h-6 w-6 text-white" />}
                          {device.type === "bluetooth_scanner" && <Bluetooth className="h-6 w-6 text-white" />}
                          {device.type === "nfc_reader" && <Smartphone className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{device.name}</h3>
                          <p className="text-xs text-gray-400">{device.location}</p>
                        </div>
                      </div>
                      <Badge
                        variant={device.status === "connected" ? "default" : "secondary"}
                        className={`text-xs ${
                          device.status === "connected"
                            ? "bg-green-600"
                            : device.status === "error"
                              ? "bg-red-600"
                              : device.status === "maintenance"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                        }`}
                      >
                        {device.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Firmware:</span>
                          <p className="text-white">{device.firmware}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Último uso:</span>
                          <p className="text-white">{device.lastUsed}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Escaneos:</span>
                          <p className="text-white">{device.totalScans.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Errores:</span>
                          <p className={`${device.errorCount > 5 ? "text-red-400" : "text-white"}`}>
                            {device.errorCount}
                          </p>
                        </div>
                      </div>

                      {device.batteryLevel !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Batería</span>
                            <span className="text-white">{device.batteryLevel}%</span>
                          </div>
                          <Progress value={device.batteryLevel} className="h-2" />
                        </div>
                      )}

                      {device.signalStrength !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Señal</span>
                            <span className="text-white">{device.signalStrength}%</span>
                          </div>
                          <Progress value={device.signalStrength} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 bg-transparent"
                          onClick={() => {
                            setSelectedDevice(device)
                            setShowDeviceDetails(true)
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          DETALLES
                        </Button>
                        {device.status === "connected" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                            onClick={() => disconnectDevice(device.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                            onClick={() => connectDevice(device.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Status */}
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">ESTADO DEL SISTEMA</CardTitle>
                <CardDescription className="text-gray-300">Monitoreo en tiempo real del rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">CPU</span>
                      <span className="text-white">{systemStats.cpuUsage}%</span>
                    </div>
                    <Progress value={systemStats.cpuUsage} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Memoria</span>
                      <span className="text-white">{systemStats.memoryUsage}%</span>
                    </div>
                    <Progress value={systemStats.memoryUsage} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Disco</span>
                      <span className="text-white">{systemStats.diskUsage}%</span>
                    </div>
                    <Progress value={systemStats.diskUsage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="BUSCAR EN HISTORIAL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODOS</SelectItem>
                    <SelectItem value="student">ESTUDIANTES</SelectItem>
                    <SelectItem value="teacher">PROFESORES</SelectItem>
                    <SelectItem value="staff">PERSONAL</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODOS</SelectItem>
                    <SelectItem value="entered">ENTRADAS</SelectItem>
                    <SelectItem value="exited">SALIDAS</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  EXPORTAR
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="glass border-gray-600 hover:bg-gray-800/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={entry.photo || "/placeholder.svg"} alt={entry.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {entry.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{entry.name}</h3>
                          <p className="text-sm text-gray-400">
                            {getPersonTypeText(entry.type)} • ID: {entry.personId}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs border-blue-400 text-blue-300">
                              {entry.method.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-purple-400 text-purple-300">
                              {entry.deviceUsed}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-green-400 text-green-300">
                              {entry.confidence}% CONFIANZA
                            </Badge>
                            {entry.temperature && (
                              <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-300">
                                {entry.temperature.toFixed(1)}°C
                              </Badge>
                            )}
                          </div>
                          {entry.notes && <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <LogIn className="h-4 w-4 text-green-400" />
                          <span className="text-white font-medium">{entry.entryTime}</span>
                        </div>
                        {entry.exitTime && (
                          <div className="flex items-center gap-2 mb-2">
                            <LogOut className="h-4 w-4 text-red-400" />
                            <span className="text-white font-medium">{entry.exitTime}</span>
                          </div>
                        )}
                        <Badge
                          variant={entry.status === "entered" ? "default" : "secondary"}
                          className={`${entry.status === "entered" ? "bg-green-600" : "bg-red-600"}`}
                        >
                          {entry.status === "entered" ? "EN EL PLANTEL" : "SALIÓ"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">MAPA INTERACTIVO DEL PLANTEL</CardTitle>
                <CardDescription className="text-gray-300">
                  Ubicación en tiempo real de estudiantes, profesores y personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-6 min-h-96 relative">
                  {/* Enhanced school map grid */}
                  <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full min-h-80">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className={`${location.color} rounded-lg p-4 text-center relative overflow-hidden hover:scale-105 transition-transform cursor-pointer`}
                        style={{
                          gridColumn: location.coordinates.x + 1,
                          gridRow: location.coordinates.y + 1,
                        }}
                      >
                        <h4 className="text-white font-semibold mb-2 text-sm">{location.name}</h4>
                        <div className="space-y-1">
                          <div className="text-xs text-white opacity-90">
                            <span className={getLocationOccupancyColor(location.currentOccupancy, location.capacity)}>
                              {location.currentOccupancy}/{location.capacity}
                            </span>
                          </div>
                          <Progress
                            value={(location.currentOccupancy / location.capacity) * 100}
                            className="h-1 bg-white/20"
                          />
                          <div className="space-y-1 mt-2">
                            {location.people.slice(0, 3).map((person) => (
                              <div key={person.id} className="flex items-center gap-1 text-xs text-white">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    person.type === "student"
                                      ? "bg-green-400"
                                      : person.type === "teacher"
                                        ? "bg-blue-400"
                                        : "bg-yellow-400"
                                  }`}
                                />
                                <span className="truncate">{person.name.split(" ")[0]}</span>
                              </div>
                            ))}
                            {location.people.length > 3 && (
                              <div className="text-xs text-white opacity-75">+{location.people.length - 3} más</div>
                            )}
                          </div>
                        </div>

                        {/* Occupancy indicator */}
                        <div className="absolute top-2 right-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              location.currentOccupancy === 0
                                ? "bg-gray-400"
                                : location.currentOccupancy / location.capacity >= 0.9
                                  ? "bg-red-400"
                                  : location.currentOccupancy / location.capacity >= 0.7
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
                        <span className="text-gray-300">ESTUDIANTE</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full" />
                        <span className="text-gray-300">PROFESOR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <span className="text-gray-300">PERSONAL</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full" />
                          <span className="text-gray-300">OCUPACIÓN ALTA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                          <span className="text-gray-300">OCUPACIÓN MEDIA</span>
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
                    <div className="text-2xl font-bold text-white">{studentsEntered}</div>
                    <p className="text-gray-400 text-sm">ESTUDIANTES EN EL PLANTEL</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{teachersEntered}</div>
                    <p className="text-gray-400 text-sm">PROFESORES EN EL PLANTEL</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{staffEntered}</div>
                    <p className="text-gray-400 text-sm">PERSONAL EN EL PLANTEL</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {locations.reduce((acc, loc) => acc + loc.currentOccupancy, 0)}
                    </div>
                    <p className="text-gray-400 text-sm">OCUPACIÓN TOTAL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">ESTADÍSTICAS DE HOY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pico de entrada:</span>
                      <span className="text-white font-semibold">07:30 - 08:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Método más usado:</span>
                      <span className="text-blue-400 font-semibold">CÁMARA (65%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tiempo promedio:</span>
                      <span className="text-green-400 font-semibold">2.3 segundos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Precisión promedio:</span>
                      <span className="text-green-400 font-semibold">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">RENDIMIENTO DEL SISTEMA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Escaneos exitosos:</span>
                      <span className="text-green-400 font-semibold">98.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Errores de lectura:</span>
                      <span className="text-red-400 font-semibold">1.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Dispositivos activos:</span>
                      <span className="text-blue-400 font-semibold">
                        {connectedDevices}/{totalDevices}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Uptime del sistema:</span>
                      <span className="text-green-400 font-semibold">{systemStats.uptime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">CONFIGURACIÓN GENERAL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">UBICACIÓN DE REGISTRO</Label>
                    <Select defaultValue="main_entrance">
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main_entrance">ENTRADA PRINCIPAL</SelectItem>
                        <SelectItem value="secondary_entrance">ENTRADA SECUNDARIA</SelectItem>
                        <SelectItem value="parking">ESTACIONAMIENTO</SelectItem>
                        <SelectItem value="emergency_exit">SALIDA DE EMERGENCIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">SONIDO DE CONFIRMACIÓN</Label>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">PANTALLA DE BIENVENIDA</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">MODO AUTOMÁTICO</Label>
                    <Switch checked={autoMode} onCheckedChange={setAutoMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">DETECCIÓN FACIAL</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">CONFIGURACIÓN AVANZADA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">TIEMPO DE ESPERA (segundos)</Label>
                    <Input type="number" defaultValue="30" className="bg-gray-800 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">PRECISIÓN MÍNIMA (%)</Label>
                    <Input type="number" defaultValue="85" className="bg-gray-800 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">RESOLUCIÓN DE CÁMARA</Label>
                    <Select defaultValue="1280x720">
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="640x480">640x480 (VGA)</SelectItem>
                        <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                        <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">REGISTRO DE TEMPERATURA</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">ACCIONES DEL SISTEMA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Settings className="h-4 w-4 mr-2" />
                    GUARDAR CONFIGURACIÓN
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    REINICIAR SISTEMA
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    EXPORTAR LOGS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Welcome Dialog */}
        {welcomeDialog && (
          <Dialog open={!!welcomeDialog} onOpenChange={() => setWelcomeDialog(null)}>
            <DialogContent className="glass-dark border-gray-600 max-w-md">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">{getPersonTypeIcon(welcomeDialog.type)}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    ¡BIENVENIDO/A {getPersonTypeText(welcomeDialog.type)}!
                  </h2>
                  <h3 className="text-xl text-blue-400 font-semibold">{welcomeDialog.name}</h3>
                  <p className="text-gray-300 mt-2">
                    {welcomeDialog.type === "student" && `${welcomeDialog.grade} - ${welcomeDialog.section}`}
                    {welcomeDialog.type === "teacher" && welcomeDialog.department}
                    {welcomeDialog.type === "staff" && welcomeDialog.department}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-6 w-6 animate-pulse" />
                  <span className="font-semibold">REGISTRO EXITOSO</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">
                    ENTRADA REGISTRADA A LAS {currentTime.toLocaleTimeString("es-HN", { hour12: true })}
                  </p>
                  <p className="text-blue-400 text-xs mt-1">
                    Dispositivo: {selectedDevice?.name || "MANUAL"} • Método: {scanMethod.toUpperCase()}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Device Details Dialog */}
        {showDeviceDetails && selectedDevice && (
          <Dialog open={showDeviceDetails} onOpenChange={setShowDeviceDetails}>
            <DialogContent className="glass-dark border-gray-600 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">DETALLES DEL DISPOSITIVO</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Nombre</Label>
                    <p className="text-white font-semibold">{selectedDevice.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Tipo</Label>
                    <p className="text-white">{selectedDevice.type.replace("_", " ").toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Estado</Label>
                    <Badge
                      className={`${
                        selectedDevice.status === "connected"
                          ? "bg-green-600"
                          : selectedDevice.status === "error"
                            ? "bg-red-600"
                            : selectedDevice.status === "maintenance"
                              ? "bg-yellow-600"
                              : "bg-gray-600"
                      }`}
                    >
                      {selectedDevice.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-400">Ubicación</Label>
                    <p className="text-white">{selectedDevice.location}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Firmware</Label>
                    <p className="text-white">{selectedDevice.firmware}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Último uso</Label>
                    <p className="text-white">{selectedDevice.lastUsed}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Total de escaneos</Label>
                    <p className="text-white text-2xl font-bold">{selectedDevice.totalScans.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Errores registrados</Label>
                    <p
                      className={`text-2xl font-bold ${selectedDevice.errorCount > 5 ? "text-red-400" : "text-white"}`}
                    >
                      {selectedDevice.errorCount}
                    </p>
                  </div>
                </div>

                {selectedDevice.batteryLevel !== undefined && (
                  <div>
                    <Label className="text-gray-400">Nivel de batería</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={selectedDevice.batteryLevel} className="flex-1" />
                      <span className="text-white font-semibold">{selectedDevice.batteryLevel}%</span>
                    </div>
                  </div>
                )}

                {selectedDevice.signalStrength !== undefined && (
                  <div>
                    <Label className="text-gray-400">Intensidad de señal</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={selectedDevice.signalStrength} className="flex-1" />
                      <span className="text-white font-semibold">{selectedDevice.signalStrength}%</span>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
