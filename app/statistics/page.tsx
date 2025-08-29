"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Download,
  RefreshCw,
  LogOut,
  PieChartIcon,
  Activity,
  Target,
  Award,
  AlertTriangle,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

// Mock data for charts
const attendanceData = [
  { month: "ENE", students: 245, teachers: 28, percentage: 92 },
  { month: "FEB", students: 238, teachers: 27, percentage: 89 },
  { month: "MAR", students: 252, teachers: 29, percentage: 95 },
  { month: "ABR", students: 241, teachers: 28, percentage: 91 },
  { month: "MAY", students: 249, teachers: 28, percentage: 94 },
  { month: "JUN", students: 235, teachers: 26, percentage: 88 },
]

const dailyAttendanceData = [
  { day: "LUN", present: 245, absent: 15, total: 260 },
  { day: "MAR", present: 238, absent: 22, total: 260 },
  { day: "MIE", present: 252, absent: 8, total: 260 },
  { day: "JUE", present: 241, absent: 19, total: 260 },
  { day: "VIE", present: 249, absent: 11, total: 260 },
]

const gradeDistribution = [
  { grade: "7°", students: 45, color: "#3B82F6" },
  { grade: "8°", students: 42, color: "#10B981" },
  { grade: "9°", students: 48, color: "#F59E0B" },
  { grade: "10°", students: 44, color: "#EF4444" },
  { grade: "11°", students: 41, color: "#8B5CF6" },
  { grade: "12°", students: 40, color: "#06B6D4" },
]

const performanceData = [
  { subject: "MATEMÁTICAS", excellent: 35, good: 45, needs_attention: 15, critical: 5 },
  { subject: "ESPAÑOL", excellent: 42, good: 38, needs_attention: 15, critical: 5 },
  { subject: "CIENCIAS", excellent: 28, good: 52, needs_attention: 15, critical: 5 },
  { subject: "HISTORIA", excellent: 38, good: 42, needs_attention: 15, critical: 5 },
  { subject: "INGLÉS", excellent: 32, good: 48, needs_attention: 15, critical: 5 },
]

const timeSeriesData = [
  { time: "07:00", entries: 5 },
  { time: "07:15", entries: 25 },
  { time: "07:30", entries: 85 },
  { time: "07:45", entries: 120 },
  { time: "08:00", entries: 25 },
  { time: "08:15", entries: 5 },
  { time: "15:00", entries: 10 },
  { time: "15:15", entries: 45 },
  { time: "15:30", entries: 180 },
  { time: "15:45", entries: 20 },
]

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedGrade, setSelectedGrade] = useState("all")

  const totalStudents = gradeDistribution.reduce((sum, grade) => sum + grade.students, 0)
  const averageAttendance = attendanceData.reduce((sum, month) => sum + month.percentage, 0) / attendanceData.length
  const todayPresent = dailyAttendanceData[dailyAttendanceData.length - 1]?.present || 0
  const excellentPerformance =
    performanceData.reduce((sum, subject) => sum + subject.excellent, 0) / performanceData.length

  const exportData = (format: string) => {
    alert(`Exportando datos en formato ${format.toUpperCase()}...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Header */}
      <header className="glass-dark border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">MÓDULO DE ESTADÍSTICAS</h1>
              <p className="text-sm text-gray-300">Análisis y reportes del sistema educativo</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              ACTUALIZAR
            </Button>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              ESTADÍSTICAS
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              VOLVER
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">HOY</SelectItem>
                <SelectItem value="week">ESTA SEMANA</SelectItem>
                <SelectItem value="month">ESTE MES</SelectItem>
                <SelectItem value="year">ESTE AÑO</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">TODOS LOS GRADOS</SelectItem>
                <SelectItem value="7">7° GRADO</SelectItem>
                <SelectItem value="8">8° GRADO</SelectItem>
                <SelectItem value="9">9° GRADO</SelectItem>
                <SelectItem value="10">10° GRADO</SelectItem>
                <SelectItem value="11">11° GRADO</SelectItem>
                <SelectItem value="12">12° GRADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("pdf")}
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              EXPORTAR PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("excel")}
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              EXPORTAR EXCEL
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">TOTAL ESTUDIANTES</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalStudents}</div>
              <p className="text-xs text-gray-400">Matriculados activos</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ASISTENCIA PROMEDIO</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageAttendance.toFixed(1)}%</div>
              <p className="text-xs text-gray-400">Últimos 6 meses</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">PRESENTES HOY</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{todayPresent}</div>
              <p className="text-xs text-gray-400">{((todayPresent / totalStudents) * 100).toFixed(1)}% del total</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">RENDIMIENTO EXCELENTE</CardTitle>
              <Award className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{excellentPerformance.toFixed(0)}%</div>
              <p className="text-xs text-gray-400">Promedio por materia</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-600">
            <TabsTrigger value="attendance" className="data-[state=active]:bg-blue-600">
              <Clock className="h-4 w-4 mr-2" />
              ASISTENCIA
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
              <Award className="h-4 w-4 mr-2" />
              RENDIMIENTO
            </TabsTrigger>
            <TabsTrigger value="distribution" className="data-[state=active]:bg-blue-600">
              <PieChartIcon className="h-4 w-4 mr-2" />
              DISTRIBUCIÓN
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              TENDENCIAS
            </TabsTrigger>
            <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
              <Activity className="h-4 w-4 mr-2" />
              TIEMPO REAL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">ASISTENCIA MENSUAL</CardTitle>
                  <CardDescription className="text-gray-300">Tendencia de asistencia por mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                        name="Porcentaje de Asistencia"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">ASISTENCIA SEMANAL</CardTitle>
                  <CardDescription className="text-gray-300">Presentes vs Ausentes por día</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyAttendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="present" fill="#10B981" name="Presentes" />
                      <Bar dataKey="absent" fill="#EF4444" name="Ausentes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">RENDIMIENTO ACADÉMICO POR MATERIA</CardTitle>
                <CardDescription className="text-gray-300">
                  Distribución de calificaciones por asignatura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="subject" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="excellent" stackId="a" fill="#10B981" name="Excelente" />
                    <Bar dataKey="good" stackId="a" fill="#3B82F6" name="Bueno" />
                    <Bar dataKey="needs_attention" stackId="a" fill="#F59E0B" name="Requiere Atención" />
                    <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Crítico" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">DISTRIBUCIÓN POR GRADO</CardTitle>
                  <CardDescription className="text-gray-300">Número de estudiantes por grado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ grade, students }) => `${grade}: ${students}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="students"
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">DETALLES POR GRADO</CardTitle>
                  <CardDescription className="text-gray-300">Información detallada de cada grado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gradeDistribution.map((grade, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: grade.color }} />
                          <span className="text-white font-medium">{grade.grade} GRADO</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{grade.students}</div>
                          <div className="text-gray-400 text-sm">
                            {((grade.students / totalStudents) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="glass border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">TENDENCIAS DE ASISTENCIA</CardTitle>
                <CardDescription className="text-gray-300">
                  Análisis de tendencias a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Estudiantes"
                    />
                    <Area
                      type="monotone"
                      dataKey="teachers"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Profesores"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">REGISTROS POR HORA</CardTitle>
                  <CardDescription className="text-gray-300">Entradas y salidas en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="entries"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.6}
                        name="Registros"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">ALERTAS Y NOTIFICACIONES</CardTitle>
                  <CardDescription className="text-gray-300">Eventos importantes del día</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-600">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-yellow-400 font-semibold">AUSENTISMO ALTO</p>
                        <p className="text-gray-300 text-sm">15 estudiantes ausentes hoy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-600">
                      <Target className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-semibold">META ALCANZADA</p>
                        <p className="text-gray-300 text-sm">95% de asistencia este mes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-600">
                      <Activity className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-blue-400 font-semibold">PICO DE ACTIVIDAD</p>
                        <p className="text-gray-300 text-sm">120 registros a las 7:45 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="glass border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-center">RESUMEN SEMANAL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-400">94.2%</div>
                <p className="text-gray-300">Asistencia Promedio</p>
                <Badge className="bg-green-600">+2.1% vs semana anterior</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-center">MEJOR GRADO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-400">9° A</div>
                <p className="text-gray-300">98.5% Asistencia</p>
                <Badge className="bg-blue-600">Excelente rendimiento</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-center">PRÓXIMA META</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-400">96%</div>
                <p className="text-gray-300">Asistencia Objetivo</p>
                <Badge className="bg-yellow-600">1.8% por alcanzar</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
