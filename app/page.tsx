"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Shield, Users, UserCheck, QrCode, Eye, EyeOff, Building2 } from "lucide-react"

const userRoles = [
  {
    id: "admin",
    name: "ADMINISTRACIÓN",
    icon: Shield,
    description: "Gestión completa del sistema",
    color: "bg-red-600 hover:bg-red-700",
    credentials: { username: "admin", password: "admin123" },
  },
  {
    id: "counseling",
    name: "CONSEJERÍA",
    icon: UserCheck,
    description: "Gestión de estudiantes y asistencias",
    color: "bg-blue-600 hover:bg-blue-700",
    credentials: { username: "consejeria", password: "consej123" },
  },
  {
    id: "parents",
    name: "PADRES DE FAMILIA",
    icon: Users,
    description: "Consulta de información estudiantil",
    color: "bg-green-600 hover:bg-green-700",
    credentials: { username: "padre", password: "padre123" },
  },
  {
    id: "direction",
    name: "DIRECCIÓN",
    icon: Building2,
    description: "Supervisión y reportes ejecutivos",
    color: "bg-purple-600 hover:bg-purple-700",
    credentials: { username: "direccion", password: "direc123" },
  },
  {
    id: "registration",
    name: "REGISTRO",
    icon: QrCode,
    description: "Control de acceso y registro de asistencias",
    color: "bg-orange-600 hover:bg-orange-700",
    credentials: { username: "registro", password: "regis123" },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Login attempt:", { selectedRole, username, password })

    if (!selectedRole) {
      setError("Por favor seleccione un rol")
      setIsLoading(false)
      return
    }

    const role = userRoles.find((r) => r.id === selectedRole)
    console.log("[v0] Found role:", role)

    if (
      role &&
      username.toLowerCase().trim() === role.credentials.username.toLowerCase() &&
      password.trim() === role.credentials.password
    ) {
      console.log("[v0] Credentials match, redirecting...")

      try {
        if (selectedRole === "direction") {
          await router.push("/direction")
        } else {
          await router.push(`/${selectedRole}`)
        }
        console.log("[v0] Navigation successful")
      } catch (error) {
        console.error("[v0] Navigation error:", error)
        setError("Error al navegar. Intente nuevamente.")
      }
    } else {
      console.log("[v0] Credentials don't match")
      setError("Credenciales incorrectas. Verifique usuario y contraseña.")
    }

    setIsLoading(false)
  }

  const selectedRoleData = userRoles.find((r) => r.id === selectedRole)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-16 w-16 text-blue-400 neon-glow" />
          </div>
          <h1 className="text-4xl font-bold text-white neon-text mb-2">SISTEMA DE REGISTRO ESCOLAR</h1>
          <p className="text-blue-200 text-lg">Plataforma Integral de Gestión Educativa</p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRoles.map((role) => {
              const IconComponent = role.icon
              return (
                <Card
                  key={role.id}
                  className="glass cursor-pointer transition-all duration-300 hover:scale-105 hover:neon-glow border-gray-600"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${role.color} flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{role.name}</CardTitle>
                    <CardDescription className="text-gray-300">{role.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ) : (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <Card className="glass border-gray-600">
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 rounded-full ${selectedRoleData?.color} flex items-center justify-center mx-auto mb-4`}
                >
                  {selectedRoleData && <selectedRoleData.icon className="h-8 w-8 text-white" />}
                </div>
                <CardTitle className="text-white text-2xl">{selectedRoleData?.name}</CardTitle>
                <CardDescription className="text-gray-300">Ingrese sus credenciales para acceder</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      Usuario
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-blue-400"
                      placeholder="Ingrese su usuario"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white focus:border-blue-400 pr-10"
                        placeholder="Ingrese su contraseña"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "INICIANDO..." : "INICIAR SESIÓN"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedRole(null)
                        setError("")
                        setUsername("")
                        setPassword("")
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      disabled={isLoading}
                    >
                      VOLVER
                    </Button>
                  </div>
                </form>

                {/* Credentials Display */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="w-full text-gray-400 hover:text-white"
                  >
                    {showCredentials ? "Ocultar" : "Mostrar"} credenciales de prueba
                  </Button>

                  {showCredentials && selectedRoleData && (
                    <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-300">
                        <div>
                          <strong>Usuario:</strong> {selectedRoleData.credentials.username}
                        </div>
                        <div>
                          <strong>Contraseña:</strong> {selectedRoleData.credentials.password}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <Badge variant="outline" className="border-blue-400 text-blue-300">
            Sistema Educativo v2.0 - Desarrollado con Tecnología Avanzada
          </Badge>
        </div>
      </div>
    </div>
  )
}
